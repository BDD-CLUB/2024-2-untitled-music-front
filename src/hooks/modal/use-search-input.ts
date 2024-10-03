import { create } from "zustand";

interface SearchInputStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useSearchInput = create<SearchInputStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useSearchInput;