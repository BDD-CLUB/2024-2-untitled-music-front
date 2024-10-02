import { create } from "zustand";

interface TrackModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useTrackModal = create<TrackModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useTrackModal;