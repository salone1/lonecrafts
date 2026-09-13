import { create } from 'zustand';

interface Product {
  id: string;
  tagNumber: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  active: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Store {
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
}

export const useStore = create<Store>((set) => ({
  isAdmin: false,
  setIsAdmin: (admin) => set({ isAdmin: admin }),
  cart: [],
  addToCart: (product, quantity) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
        return { cart: [...state.cart] };
      }
      return { cart: [...state.cart, { product, quantity }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ cart: [] }),
  updateCartQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0),
    })),
}));
