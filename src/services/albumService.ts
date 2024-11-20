import { api } from '@/lib/axios';

export interface Album {
  uuid: string;
  title: string;
  description: string;
  artImage: string;
  releaseDate: string;
}

export const getAllAlbums = async (): Promise<Album[]> => {
  try {
    const response = await api.get<Album[]>("/album");
    return response.data;
  } catch (error) {
    console.error('앨범 데이터 조회 실패:', error);
    throw error;
  }
}; 