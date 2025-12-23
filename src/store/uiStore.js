import { create } from "zustand";

export const useModalStore = create((set) => ({
  showLoginModal: false,
  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false }),
}));
