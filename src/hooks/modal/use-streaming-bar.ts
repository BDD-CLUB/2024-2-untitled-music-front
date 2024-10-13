import { create } from "zustand";

interface StreamingBarStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useStreamingBar = create<StreamingBarStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useStreamingBar;