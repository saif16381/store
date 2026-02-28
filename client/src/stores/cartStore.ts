import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@shared/schema';

export interface CartItem extends Pick<Product, 'id' | 'storeId' | 'title' | 'price' | 'stock'> {
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (product, quantity) => {
        const items = get().items;
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity <= product.stock) {
            set({
              items: items.map((item) =>
                item.id === product.id ? { ...item, quantity: newQuantity } : item
              ),
            });
          }
        } else {
          if (quantity <= product.stock) {
            set({
              items: [
                ...items,
                {
                  id: product.id,
                  storeId: product.storeId,
                  title: product.title,
                  price: Number(product.price),
                  image: product.images[0],
                  quantity,
                  stock: product.stock,
                },
              ],
            });
          }
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === productId);
        if (item && quantity > 0 && quantity <= item.stock) {
          set({
            items: items.map((i) =>
              i.id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      setCartOpen: (open) => set({ isCartOpen: open }),
      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'shopping-cart',
    }
  )
);
