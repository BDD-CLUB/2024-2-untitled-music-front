import { api } from "@/lib/axios";
import axios from "axios";

export interface Profile {
  name: string;
  description: string;
  link1: string;
  link2: string;
  profileImage: string;
  isMain: true;
}

export const getProfile = async (): Promise<Profile | null> => {
  try {
    const response = await api.get<Profile>("/profile");

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
