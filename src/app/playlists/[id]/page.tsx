import { PlaylistInfo } from "@/components/playlists/PlaylistInfo";
import { PlaylistTracks } from "@/components/playlists/PlaylistTracks";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { checkAuth } from "@/lib/auth";
interface PlaylistPageProps {
  params: {
    id: string;
  };
}

async function getPlaylist(id: string) {
  try {
    const { accessToken } = await checkAuth();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${id}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (response.status === 404) {
      notFound();
    }

    if (!response.ok) {
      throw new Error('플레이리스트를 불러오는데 실패했습니다.');
    }

    return response.json();
  } catch {
    throw new Error('플레이리스트를 불러오는데 실패했습니다.');
  }
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const playlist = await getPlaylist(params.id);

  return (
    <div className="container mx-auto px-4 py-4 pl-32">
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
        <PlaylistInfo playlist={playlist} />
        <PlaylistTracks tracks={playlist.playlistItemResponseDtos} />
      </div>
    </div>
  );
} 