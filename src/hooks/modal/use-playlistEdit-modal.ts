import { create } from "zustand";

interface PlaylistEditModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const usePlaylistEditModal = create<PlaylistEditModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default usePlaylistEditModal;