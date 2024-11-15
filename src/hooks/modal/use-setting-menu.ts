import { create } from "zustand";

interface SettingMenuStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useSettingMenu = create<SettingMenuStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useSettingMenu;