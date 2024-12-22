import { Album } from "@/services/albumService";
import { create } from "zustand";

interface InformationModalStore {
  isOpen: boolean;
  data: Album | null; 
  onOpen: (modalData: Album) => void; 
  onClose: () => void;
}

const useInformationModal = create<InformationModalStore>((set) => ({
  isOpen: false,
  data: null, 
  onOpen: (modalData: Album) => set({ isOpen: true, data: modalData }),
  onClose: () => set({ isOpen: false, data: null }), 
}));

export default useInformationModal;
