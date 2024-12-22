import { create } from "zustand";

interface InformationModalStore {
  isOpen: boolean;
  data: any | null; 
  onOpen: (modalData: any) => void; 
  onClose: () => void;
}

const useInformationModal = create<InformationModalStore>((set) => ({
  isOpen: false,
  data: null, 
  onOpen: (modalData: any) => set({ isOpen: true, data: modalData }),
  onClose: () => set({ isOpen: false, data: null }), 
}));

export default useInformationModal;
