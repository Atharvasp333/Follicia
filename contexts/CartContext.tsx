"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuthModal } from "./AuthModalContext";
import axios from "axios";

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
  const [hasMerged, setHasMerged] = useState(false);

  // DEBUG: Log cart changes
  useEffect(() => {
    console.log("🛒 Cart updated:", cartItems);
    console.log("🛒 Cart count:", cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, [cartItems]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      console.log("📦 Loading cart from localStorage:", stored);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCartItems(parsed);
          console.log("✅ Cart loaded from localStorage:", parsed);
        } catch (error) {
          console.error("❌ Failed to parse cart from localStorage", error);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Guest-to-User merge strategy
  useEffect(() => {
    if (authLoading || hasMerged || !currentUser || !dbUser) return;

    const mergeGuestCart = async () => {
      console.log("🔄 Starting cart merge for user:", dbUser.id);
      
      // Get current cart from state at the time of merge
      setCartItems((currentCart) => {
        // Start async merge process
        (async () => {
          if (currentCart.length > 0) {
            try {
              console.log("📥 Fetching DB cart for merge...");
              const response = await axios.get(`/api/cart?userId=${dbUser.id}`);
              const dbCart: CartItem[] = response.data.items || [];
              console.log("📦 DB cart:", dbCart);

              // Merge logic: combine local and DB carts
              const mergedCart = [...dbCart];
              
              currentCart.forEach((localItem) => {
                const existingIndex = mergedCart.findIndex(
                  (item) => item.productId === localItem.productId
                );
                
                if (existingIndex >= 0) {
                  mergedCart[existingIndex].quantity += localItem.quantity;
                } else {
                  mergedCart.push(localItem);
                }
              });

              console.log("🔀 Merged cart:", mergedCart);

              // Sync merged cart to DB
              await axios.post("/api/cart/sync", {
                userId: dbUser.id,
                items: mergedCart,
              });

              // Update state with merged cart
              setCartItems(mergedCart);
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mergedCart));
              
              console.log("✅ Cart merged successfully");
            } catch (error) {
              console.error("❌ Failed to merge cart", error);
            }
          } else {
            // No local cart - just load from DB
            try {
              console.log("📥 Loading cart from DB (no local cart)...");
              const response = await axios.get(`/api/cart?userId=${dbUser.id}`);
              const dbCart: CartItem[] = response.data.items || [];
              console.log("📦 Loaded DB cart:", dbCart);
              setCartItems(dbCart);
              localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dbCart));
            } catch (error) {
              console.error("❌ Failed to load cart from DB", error);
            }
          }
        })();
        
        // Return current cart unchanged (async operation will update it)
        return currentCart;
      });
      
      setHasMerged(true);
    };

    mergeGuestCart();
  }, [currentUser, dbUser, authLoading, hasMerged]);

  // Sync to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log("💾 Saved to localStorage:", cartItems);
    }
  }, [cartItems, isLoading]);

  // Sync to DB if user is authenticated
  const syncToDb = async (items: CartItem[]) => {
    if (dbUser) {
      try {
        console.log("☁️ Syncing to DB:", items);
        await axios.post("/api/cart/sync", {
          userId: dbUser.id,
          items,
        });
        console.log("✅ Synced to DB");
      } catch (error) {
        console.error("❌ Failed to sync cart to DB", error);
      }
    }
  };

  const addToCart = async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    console.log("➕ Adding to cart:", item);
    const quantity = item.quantity || 1;
    
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === item.productId);
      
      let newCart: CartItem[];
      if (existingIndex >= 0) {
        // Item exists - update quantity
        newCart = prev.map((i, idx) =>
          idx === existingIndex ? { ...i, quantity: i.quantity + quantity } : i
        );
        console.log("📝 Updated existing item quantity");
      } else {
        // New item
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

  const updateQuantity = async (productId: string, quantity: number) => {
    console.log("🔢 Updating quantity:", productId, quantity);
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }
    
    setCartItems((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      syncToDb(newCart);
      return newCart;
    });
  };

  const clearCart = async () => {
    console.log("🧹 Clearing cart");
    setCartItems([]);
    if (dbUser) {
      try {
        await axios.delete(`/api/cart?userId=${dbUser.id}`);
      } catch (error) {
        console.error("❌ Failed to clear cart in DB", error);
      }
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
