import { Album } from "@/services/albumService";
import { Playlist } from "@/services/playlistService";
import { create } from "zustand";

interface InformationModalStore {
  isOpen: boolean;
  data: Album | Playlist | null; 
  onOpen: (modalData: Album | Playlist) => void; 
  onClose: () => void;
}

const useInformationModal = create<InformationModalStore>((set) => ({
  isOpen: false,
  data: null, 
  onOpen: (modalData: Album | Playlist) => set({ isOpen: true, data: modalData }),
  onClose: () => set({ isOpen: false, data: null }), 
}));

export default useInformationModal;
