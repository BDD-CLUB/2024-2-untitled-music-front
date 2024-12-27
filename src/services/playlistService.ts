import { api } from "@/lib/axios";
import { Track } from "./albumService";
import axios from "axios";

export interface Playlist {
    uuid: string;
    title: string;
    description: string;
    playlistItemResponseDtos: PlaylistItem[];
}

export interface PlaylistItem {
    uuid: string;
    track: Track;
}

export const getAllPlaylists = async (
    page = 0,
    pageSize = 10
): Promise<Playlist[]> => {
    try {
        const response = await api.get<Playlist[]>("/playlist", {
            params: {
                page,
                pageSize,
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error(
                `플레이리스트 데이터 조회 실패: ${error.response?.status}`,
                error.message
            );
        } else {
            console.error("플레이리스트 데이터 조회 중 알 수 없는 오류 발생:", error);
        }
        throw error;
    }
}