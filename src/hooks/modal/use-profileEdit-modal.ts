import { create } from "zustand";

interface ProfileEditModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useProfileEditModal = create<ProfileEditModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useProfileEditModal;