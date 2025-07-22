// store/useModalStore.js
import { create } from "zustand";

export const useModalStore = create((set) => ({
  isStatusModalOpen: false,
  openStatusModal: () => set({ isStatusModalOpen: true }),
  closeStatusModal: () => set({ isStatusModalOpen: false }),
}));
