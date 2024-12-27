import { api } from "@/lib/axios";
import { Album, Profile, Track } from "./albumService";
import axios from "axios";

export interface TrackResponse {
  trackResponseDto: Track;
  albumResponseDto: Album;
  profileResponseDto: Profile;
}

export const getAllTracks = async (
  page = 0,
  pageSize = 10
): Promise<TrackResponse[]> => {
  try {
    const response = await api.get<TrackResponse[]>("/track", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `트랙 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("트랙 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};

export const getTrackById = async (uuid: string): Promise<TrackResponse> => {
  try {
    const response = await api.get<TrackResponse>(`/track/${uuid}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `트랙 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("트랙 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};