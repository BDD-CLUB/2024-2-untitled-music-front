import { cn } from "@/lib/utils";
import { AlbumSection } from "@/components/home/AlbumSection";
import { TrackSection } from "@/components/home/TrackSection";
import { ArtistSection } from "@/components/home/ArtistSection";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:pl-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 메인 콘텐츠 영역 */}
        <div className="lg:col-span-8">
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
            <AlbumSection />
            <TrackSection />
          </div>
        </div>

        {/* 사이드바 영역 */}
        <div className="lg:col-span-4">
          <div
            className={cn(
              "rounded-3xl",
              "bg-white/10 dark:bg-black/10",
              "backdrop-blur-2xl",
              "border border-white/20 dark:border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
              "overflow-hidden",
              "sticky top-8"
            )}
          >
            {/* 인기 아티스트 섹션 */}
            <ArtistSection />

            {/* 인기 플레이리스트 섹션 */}
            <section className="p-6 border-t border-white/10">
              <h2 className="text-xl font-bold mb-4">인기 플레이리스트</h2>
              <div className="space-y-4">
                {/* 플레이리스트가 들어갈 자리 */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
