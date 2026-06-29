import { create } from 'zustand'
import type { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
}

interface GiftMateStore {
  cart: CartItem[]
  isCartOpen: boolean
  criteria: string[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  addCriteria: (c: string) => void
  removeCriteria: (c: string) => void
  clearCriteria: () => void
}

export const useStore = create<GiftMateStore>((set) => ({
  cart: [],
  isCartOpen: false,
  criteria: [],

  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id)
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }
      }
      return { cart: [...state.cart, { product, quantity: 1 }] }
    }),

  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart:
        quantity === 0
          ? state.cart.filter((item) => item.product.id !== productId)
          : state.cart.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
    })),

  clearCart: () => set({ cart: [] }),
  setCartOpen: (open) => set({ isCartOpen: open }),

  addCriteria: (c) =>
    set((state) => ({
      criteria: state.criteria.includes(c) ? state.criteria : [...state.criteria, c],
    })),

  removeCriteria: (c) =>
    set((state) => ({ criteria: state.criteria.filter((x) => x !== c) })),

  clearCriteria: () => set({ criteria: [] }),
}))
