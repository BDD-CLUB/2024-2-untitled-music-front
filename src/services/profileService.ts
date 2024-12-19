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

export const isProfile = async () => {
  try {
    const response = await api.get("/profile");

    console.log(response.data);

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }

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
  };
};

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get<Profile>("/profile");
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
