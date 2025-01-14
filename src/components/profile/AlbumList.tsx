import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface Album {
  uuid: string;
  title: string;
  description: string;
  artImage: string;
  releaseDate: string;
}

interface AlbumListProps {
  albums: Album[];
}

export function AlbumList({ albums }: AlbumListProps) {
  if (!albums || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">아직 등록된 앨범이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {albums.map((album, index) => (
        <Link
          key={album.uuid}
          href={`/albums/${album.uuid}`}
          className="group block"
        >
          <div
            className={cn(
              "relative p-2",
              "rounded-3xl",
              "bg-white/5",
              "border border-white/10",
              "backdrop-blur-sm",
              "transition-all duration-500",
              "hover:bg-white/10",
              "hover:scale-[1.02]",
              "hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            )}
          >
            {/* 앨범 커버 */}
            <div className="relative aspect-square mb-4">
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full rounded-xl overflow-hidden">
                <Image
                  src={album.artImage}
                  alt={album.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 
                         (max-width: 1024px) 50vw,
                         25vw"
                  priority={index < 3}  // 처음 3개 이미지는 우선 로딩
                  loading={index < 3 ? "eager" : "lazy"}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  quality={50}  // 품질 조정
                />
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>

            {/* 앨범 정보 */}
            <div className="space-y-2">
              <h3 className="font-medium text-md line-clamp-1 group-hover:text-white/50 dark:group-hover:text-black/50 transition-colors">
                {album.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-white/50 dark:group-hover:text-black/50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(album.releaseDate)}</span>
              </div>
            </div>

            {/* 호버 시 나타나는 그라데이션 테두리 */}
            <div className="absolute inset-0 rounded-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </Link>
      ))}
    </div>
  );
} 