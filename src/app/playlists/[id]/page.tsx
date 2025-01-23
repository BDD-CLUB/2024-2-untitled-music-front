import { PlaylistInfo } from "@/components/playlists/PlaylistInfo";
import { PlaylistTracks } from "@/components/playlists/PlaylistTracks";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

interface PlaylistPageProps {
  params: {
    id: string;
  };
  searchParams: {
    itemPage?: string;
    itemPageSize?: string;
  };
}

async function getPlaylist(id: string, itemPage = 0, itemPageSize = 10) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${id}?itemPage=${itemPage}&itemPageSize=${itemPageSize}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        next: {revalidate: 0}
      }
    );

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error('플레이리스트를 불러오는데 실패했습니다.');
    }

    const data = await response.json();
    
    if (!data || !data.playlistBasicResponseDto) {
      throw new Error('잘못된 응답 데이터입니다.');
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch playlist:', error);
    throw new Error('플레이리스트를 불러오는데 실패했습니다.');
  }
}

export default async function PlaylistPage({ params, searchParams }: PlaylistPageProps) {
  const itemPage = Number(searchParams.itemPage) || 0;
  const itemPageSize = Number(searchParams.itemPageSize) || 10;
  const playlist = await getPlaylist(params.id, itemPage, itemPageSize);

  return (
    <div className="container mx-auto px-4 py-4">
      <div
        className={cn(
          "rounded-3xl",
          "bg-white/10 dark:bg-black/10",
          "backdrop-blur-2xl",
          "border border-white/20 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "overflow-hidden"
        )}
      >
        <PlaylistInfo 
          playlist={playlist.playlistBasicResponseDto} 
          artist={playlist.artistResponseDto}
        />
        <PlaylistTracks 
          playlistId={params.id}
          initialTracks={playlist.playlistItemResponseDtos}
          artistId={playlist.artistResponseDto.uuid}
        />
      </div>
    </div>
  );
}

export const fetchCache = 'force-no-store';
export const revalidate = 0;