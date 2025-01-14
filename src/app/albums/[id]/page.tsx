import { cn } from "@/lib/utils";
import { AlbumInfo } from "@/components/albums/AlbumInfo";
import { TrackList } from "@/components/albums/TrackList";

interface AlbumPageProps {
  params: {
    id: string;
  };
}

async function getAlbum(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('앨범을 불러오는데 실패했습니다.');
  }

  return response.json();
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const album = await getAlbum(params.id);

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
        <AlbumInfo 
          album={album.albumResponseDto}
          artist={album.artistResponseDto}
        />
        <TrackList tracks={album.trackResponseDtos} />
      </div>
    </div>
  );
} 