import { api } from "@/lib/axios";
import axios from "axios";

export interface Profile {
  uuid: string;
  name: string;
  description: string;
  link1: string;
  link2: string;
  profileImage: string;
  isMain: true;
}

export const getAllProfiles = async (
  page = 0,
  pageSize = 10
): Promise<Profile[]> => {
  try {
    const response = await api.get<Profile[]>("/profile", {
      params: {
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `프로필 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("프로필 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const response = await api.get<Profile>("/profile/now");

    if (response.status === 200 && response.data) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `프로필 데이터 조회 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("프로필 데이터 조회 중 알 수 없는 오류 발생:", error);
    }
    return null;
  }
};

export const deleteProfile = async (uuid: string) => {
  try {
    const response = await api.delete(`/profile/${uuid}`);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `프로필 삭제 실패: ${error.response?.status}`,
        error.message
      );
    } else {
      console.error("프로필 삭제 중 알 수 없는 오류 발생:", error);
    }
    throw error;
  }
};