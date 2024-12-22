import { create } from "zustand";

interface AlbumEditModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useAlbumEditModal = create<AlbumEditModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useAlbumEditModal;