import { api } from "@/lib/axios";
import axios from "axios";

export interface Album {
  uuid: string;
  title: string;
  description: string;
  artImage: string;
  releaseDate: string;
}

export interface Track {
  uuid: string;
  title: string;
  lyric: string;
  duration: number;
  artUrl: string;
}

export interface Profile {
  uuid: string;
  name: string;
  description: string;
  link1: string;
  link2: string;
  profileImage: string;
  isMain: boolean;
}

export interface AlbumResponse {
  albumResponseDto: Album;
  trackResponseDtos: Track[];
  profileResponseDto: Profile;
}

export const getAllAlbums = async (
  page = 0,
  pageSize = 10
): Promise<AlbumResponse[]> => {
  try {
    const response = await api.get<AlbumResponse[]>("/album", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `앨범 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("앨범 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};

export const getAlbumById = async (uuid: string): Promise<AlbumResponse> => {
  try {
    const response = await api.get<AlbumResponse>(`/album/${uuid}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `앨범 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("앨범 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};

export const getAlbumByProfileUUID = async (uuid: string): Promise<Album[]> => {
  try {
    const response = await api.get<Album[]>(`/profile/${uuid}/album`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `프로필 앨범 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("프로필 앨범 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};

export const deleteAlbum = async (uuid: string) => {
  try {
    const response = await api.delete(`/album/${uuid}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `앨범 삭제 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("앨범 삭제 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};