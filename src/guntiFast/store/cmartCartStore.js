import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCMartCartStore = create(
  persist(
    (set) => ({
      cart: [],

      // Add item
      // addToCart: (product) =>
      //   set((state) => {
      //     const exists = state.cart.find((i) => i.id === product.id);
      //     if (exists) {
      //       return {
      //         cart: state.cart.map((item) =>
      //           item.id === product.id
      //             ? { ...item, quantity: item.quantity + 1 }
      //             : item
      //         ),
      //       };
      //     }
      //     return {
      //       cart: [...state.cart, { ...product, quantity: 1 }],
      //     };
      //   }),
      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find((i) => i.id === product.id);
          const qtyToAdd = Number(product.quantity || 1);

          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + qtyToAdd }
                  : item
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...product,
                quantity: qtyToAdd,
              },
            ],
          };
        }),

      // Update quantity
      updateQty: (id, qty) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        })),

      // Remove
      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      // Clear
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cmart-cart", // 🔥 localStorage key
    }
  )
);
