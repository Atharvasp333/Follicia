"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { useAuthModal } from "./AuthModalContext";
import axios from "axios";
import { trackProductEvent } from "@/lib/tracking";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  priceDisplay: string;
  quantity: number;
  imageUrl?: string | null;
  category?: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  validateStock: () => Promise<{ valid: boolean; outOfStock: string[]; insufficientStock: Array<{ name: string; available: number; requested: number }> }>;
  cartCount: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "follicia_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { currentUser, dbUser, isLoading: authLoading } = useAuthModal();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false); // Track if cart has been initialized
  const isSyncing = useRef(false); // Prevent concurrent syncs

  // DEBUG: Log cart changes
  useEffect(() => {
    console.log("🛒 Cart updated:", cartItems);
    console.log("🛒 Cart count:", cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [cartItems]);

  // SINGLE INITIALIZATION: Load cart once on mount
  useEffect(() => {
    if (hasInitialized.current || authLoading) return;

    const initializeCart = async () => {
      console.log("� Initializing cart...");
      hasInitialized.current = true;

      try {
        if (dbUser) {
          // User is authenticated - load from DB
          console.log("👤 User authenticated, loading from DB...");
          const response = await axios.get(`/api/cart?userId=${dbUser.id}`);
          const dbCart: CartItem[] = response.data.items || [];
          console.log("📦 Loaded DB cart:", dbCart);
          
          setCartItems(dbCart);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dbCart));
        } else {
          // Guest user - load from localStorage
          console.log("👻 Guest user, loading from localStorage...");
          const stored = localStorage.getItem(CART_STORAGE_KEY);
          
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              // DUPLICATION FIX: Ensure unique items by productId
              const uniqueCart = parsed.reduce((acc: CartItem[], item: CartItem) => {
                const existing = acc.find(i => i.productId === item.productId);
                if (existing) {
                  existing.quantity += item.quantity;
                } else {
                  acc.push(item);
                }
                return acc;
              }, []);
              
              setCartItems(uniqueCart);
              console.log("✅ Cart loaded from localStorage (deduplicated):", uniqueCart);
            } catch (error) {
              console.error("❌ Failed to parse cart from localStorage", error);
              setCartItems([]);
            }
          } else {
            console.log("� No cart found in localStorage");
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error("❌ Failed to initialize cart", error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [dbUser, authLoading]);

  // Sync to localStorage whenever cart changes (after initialization)
  useEffect(() => {
    if (typeof window !== "undefined" && hasInitialized.current && !isLoading && !isSyncing.current) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log("💾 Saved to localStorage:", cartItems);
    }
  }, [cartItems, isLoading]);

  // Sync to DB if user is authenticated
  const syncToDb = async (items: CartItem[]) => {
    if (dbUser && !isSyncing.current) {
      try {
        isSyncing.current = true;
        console.log("☁️ Syncing to DB:", items);
        await axios.post("/api/cart/sync", {
          userId: dbUser.id,
          items,
        });
        console.log("✅ Synced to DB");
      } catch (error) {
        console.error("❌ Failed to sync cart to DB", error);
      } finally {
        isSyncing.current = false;
      }
    }
  };

  // DUPLICATION FIX: Add to cart with find check
  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    console.log("➕ Adding to cart:", item);
    const quantity = item.quantity || 1;
    
    // Track add to cart event
    trackProductEvent(item.productId, "addToCartCount");
    
    // Check stock availability before adding
    try {
      const response = await axios.get('/api/admin/products');
      const products = response.data.products;
      const product = products.find((p: any) => p.id === item.productId);
      
      if (!product) {
        console.error("❌ Product not found");
        return;
      }
      
      const availableStock = product.inventoryCount || 0;
      
      // Check current cart quantity for this product
      const currentCartItem = cartItems.find((i) => i.productId === item.productId);
      const currentQuantity = currentCartItem?.quantity || 0;
      const totalQuantity = currentQuantity + quantity;
      
      if (availableStock === 0) {
        console.error("❌ Product is out of stock");
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-error', { 
            detail: { message: `Sorry, ${item.name} is currently out of stock.` }
          }));
        }
        return;
      }
      
      if (totalQuantity > availableStock) {
        console.error(`❌ Insufficient stock. Available: ${availableStock}, Requested: ${totalQuantity}`);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-error', { 
            detail: { message: `Sorry, only ${availableStock} units of ${item.name} are available.` }
          }));
        }
        return;
      }
    } catch (error) {
      console.error("❌ Failed to check stock", error);
      // Continue anyway if stock check fails
    }
    
    setCartItems((prev) => {
      // DUPLICATION FIX: Find existing item by productId
      const existingIndex = prev.findIndex((i) => i.productId === item.productId);
      
      let newCart: CartItem[];
      if (existingIndex >= 0) {
        // Item exists - INCREMENT quantity only
        newCart = prev.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
        );
        console.log("📝 Updated existing item quantity");
      } else {
        // New item - ADD to cart
        newCart = [...prev, { ...item, quantity }];
        console.log("🆕 Added new item to cart");
      }
      
      console.log("🛒 New cart state:", newCart);
      
      // Sync to DB if authenticated
      syncToDb(newCart);
      
      return newCart;
    });
  };

  const removeFromCart = async (productId: string) => {
    console.log("🗑️ Removing from cart:", productId);
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.productId !== productId);
      syncToDb(newCart);
      return newCart;
    });
  };

  // NEGATIVE QUANTITY FIX: Ensure quantity cannot go below 1
  const updateQuantity = async (productId: string, quantity: number) => {
    console.log("🔢 Updating quantity:", productId, quantity);
    
    // NEGATIVE QUANTITY FIX: Remove item if quantity is 0 or below
    if (quantity < 1) {
      console.log("⚠️ Quantity below 1, removing item");
      await removeFromCart(productId);
      return;
    }
    
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      
      // MULTI-POINT TRACKING: Track add-to-cart when quantity increases
      if (existingItem && quantity > existingItem.quantity) {
        const quantityIncrease = quantity - existingItem.quantity;
        console.log(`📈 Quantity increased by ${quantityIncrease}, tracking add-to-cart`);
        
        // Track each quantity increase as an add-to-cart event
        for (let i = 0; i < quantityIncrease; i++) {
          trackProductEvent(productId, "addToCartCount");
        }
      }
      
      const newCart = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      syncToDb(newCart);
      return newCart;
    });
  };

  // POST-PURCHASE WIPE: Clear cart completely
  const clearCart = async () => {
    console.log("🧹 Clearing cart (POST-PURCHASE WIPE)");
    
    // Clear state
    setCartItems([]);
    
    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
      console.log("�️ Cleared localStorage");
    }
    
    // Clear DB if user is authenticated
    if (dbUser) {
      try {
        await axios.delete(`/api/cart?userId=${dbUser.id}`);
        console.log("🗑️ Cleared DB cart");
      } catch (error) {
        console.error("❌ Failed to clear cart in DB", error);
      }
    }
    
    console.log("✅ Cart cleared successfully");
  };

  // STOCK VALIDATION: Validate cart items against current inventory
  const validateStock = async (): Promise<{ 
    valid: boolean; 
    outOfStock: string[];
    insufficientStock: Array<{ name: string; available: number; requested: number }>;
  }> => {
    console.log("🔍 Validating stock for cart items");
    
    try {
      const response = await axios.get('/api/admin/products');
      const products = response.data.products;
      
      const outOfStock: string[] = [];
      const insufficientStock: Array<{ name: string; available: number; requested: number }> = [];
      
      for (const cartItem of cartItems) {
        const product = products.find((p: any) => p.id === cartItem.productId);
        
        if (!product) {
          outOfStock.push(cartItem.name);
          console.log(`⚠️ ${cartItem.name} not found in inventory`);
          continue;
        }
        
        const availableStock = product.inventoryCount || 0;
        
        if (availableStock === 0) {
          outOfStock.push(cartItem.name);
          console.log(`⚠️ ${cartItem.name} is out of stock`);
        } else if (availableStock < cartItem.quantity) {
          insufficientStock.push({
            name: cartItem.name,
            available: availableStock,
            requested: cartItem.quantity,
          });
          console.log(`⚠️ ${cartItem.name} has insufficient stock (available: ${availableStock}, requested: ${cartItem.quantity})`);
        }
      }
      
      if (outOfStock.length > 0 || insufficientStock.length > 0) {
        console.log("❌ Stock validation failed");
        return { valid: false, outOfStock, insufficientStock };
      }
      
      console.log("✅ Stock validation passed");
      return { valid: true, outOfStock: [], insufficientStock: [] };
    } catch (error) {
      console.error("❌ Failed to validate stock", error);
      return { valid: false, outOfStock: [], insufficientStock: [] };
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        validateStock,
        cartCount,
        subtotal,
        isLoading: isLoading || authLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
