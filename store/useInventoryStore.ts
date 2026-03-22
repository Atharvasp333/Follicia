import { create } from 'zustand';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  inventoryCount: number;
  lowStockThreshold: number;
  price: number;
  imageUrl: string | null;
  category: string | null;
  isActive: boolean;
}

interface InventoryStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Actions
  syncWithDB: () => Promise<void>;
  updateStock: (productId: string, newCount: number) => Promise<boolean>;
  updateStockOptimistic: (productId: string, newCount: number) => void;
  toggleVisibility: (productId: string, isActive: boolean) => Promise<boolean>;
  resetAllStock: () => Promise<boolean>;
  bulkUpdateStock: (updates: { id: string; inventoryCount: number }[]) => Promise<boolean>;
  isAvailable: (productId: string) => boolean;
  getProduct: (productId: string) => Product | undefined;
  decrementStock: (productId: string, quantity: number) => Promise<boolean>;
}

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch latest inventory from database
  syncWithDB: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/admin/products');
      if (response.data.success) {
        set({ 
          products: response.data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            inventoryCount: p.inventoryCount || 0,
            lowStockThreshold: p.lowStockThreshold || 5,
            price: p.price,
            imageUrl: p.imageUrl,
            category: p.category || null,
            isActive: p.isActive ?? true,
          })),
          loading: false 
        });
      }
    } catch (error) {
      console.error('Failed to sync inventory:', error);
      set({ error: 'Failed to sync inventory', loading: false });
    }
  },

  // Optimistic update (immediate UI update)
  updateStockOptimistic: (productId: string, newCount: number) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, inventoryCount: newCount } : p
      ),
    }));
  },

  // Update stock count for a product
  updateStock: async (productId: string, newCount: number) => {
    // Optimistic update
    get().updateStockOptimistic(productId, newCount);

    try {
      const response = await axios.patch(`/api/admin/products/${productId}`, {
        inventoryCount: newCount,
        stock: newCount, // Keep both columns in sync
      });

      if (response.data.success) {
        return true;
      }
      // Revert on failure
      await get().syncWithDB();
      return false;
    } catch (error) {
      console.error('Failed to update stock:', error);
      // Revert on failure
      await get().syncWithDB();
      return false;
    }
  },

  // Toggle product visibility
  toggleVisibility: async (productId: string, isActive: boolean) => {
    // Optimistic update
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, isActive } : p
      ),
    }));

    try {
      const response = await axios.patch(`/api/admin/products/${productId}`, {
        isActive,
      });

      if (response.data.success) {
        return true;
      }
      // Revert on failure
      await get().syncWithDB();
      return false;
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      // Revert on failure
      await get().syncWithDB();
      return false;
    }
  },

  // Reset all stock to 0
  resetAllStock: async () => {
    try {
      const response = await axios.post('/api/admin/inventory/reset');
      if (response.data.success) {
        // Refresh from DB
        await get().syncWithDB();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to reset stock:', error);
      return false;
    }
  },

  // Bulk update multiple products
  bulkUpdateStock: async (updates: { id: string; inventoryCount: number }[]) => {
    try {
      const response = await axios.post('/api/admin/inventory/bulk-update', {
        updates,
      });

      if (response.data.success) {
        // Refresh from DB
        await get().syncWithDB();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to bulk update:', error);
      return false;
    }
  },

  // Decrement stock after purchase
  decrementStock: async (productId: string, quantity: number) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product) return false;

    const newCount = Math.max(0, product.inventoryCount - quantity);
    return get().updateStock(productId, newCount);
  },

  // Check if product is available
  isAvailable: (productId: string) => {
    const product = get().products.find((p) => p.id === productId);
    return product ? product.inventoryCount > 0 : false;
  },

  // Get product details
  getProduct: (productId: string) => {
    return get().products.find((p) => p.id === productId);
  },
}));
