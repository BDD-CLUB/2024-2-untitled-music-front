import Image from "next/image";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Album {
  uuid: string;
  title: string;
  artImage: string;
}

interface AlbumSelectProps {
  albums: Album[];
  selectedAlbum: string;
  onSelect: (uuid: string) => void;
}

export function AlbumSelect({ albums, selectedAlbum, onSelect }: AlbumSelectProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album) => (
        <button
          key={album.uuid}
          type="button"
          onClick={() => onSelect(album.uuid)}
          className={cn(
            "relative group p-4",
            "rounded-2xl",
            "bg-white/5",
            "border border-white/10",
            "backdrop-blur-sm",
            "transition-all duration-300",
            "hover:bg-white/10",
            selectedAlbum === album.uuid && "ring-2 ring-primary",
          )}
        >
          <div className="relative aspect-square mb-3">
            <div className="absolute -inset-2 rounded-xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={album.artImage}
                alt={album.title}
                fill
                className="object-cover"
              />
              {selectedAlbum === album.uuid && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Check className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          </div>
          <h3 className="text-sm font-medium truncate text-center">
            {album.title}
          </h3>
        </button>
      ))}
    </div>
  );
} 