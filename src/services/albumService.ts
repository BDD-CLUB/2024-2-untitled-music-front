import axios from 'axios';

export interface Album {
  uuid: string;
  title: string;
  description: string;
  artImage: string;
  releaseDate: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllAlbums = async (): Promise<Album[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/album`);
    return response.data;
  } catch (error) {
    console.error('앨범 데이터 조회 실패:', error);
    throw error;
  }
}; 