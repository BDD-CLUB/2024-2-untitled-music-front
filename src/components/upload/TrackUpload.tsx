"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Music2, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth/AuthContext";
import { AlbumSelect } from "./AlbumSelect";
import { checkAuth } from "@/lib/auth";

interface Album {
  uuid: string;
  title: string;
  artImage: string;
}

interface TrackForm {
  title: string;
  lyric: string;
  duration: number;
  trackFile: string;
}

export function TrackUpload() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [form, setForm] = useState<TrackForm>({
    title: "",
    lyric: "",
    duration: 0,
    trackFile: "",
  });

  useEffect(() => {
    const fetchAlbums = async () => {
      if (!user) return;

      const { accessToken } = await checkAuth();

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${user.uuid}/albums`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok)
          throw new Error("앨범 목록을 불러오는데 실패했습니다.");

        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        toast({
          title: "앨범 목록 불러오기 실패",
          variant: "destructive",
          description:
            error instanceof Error
              ? error.message
              : "앨범 목록을 불러오는데 실패했습니다.",
        });
      }
    };

    fetchAlbums();
  }, [user, toast]);

  const handleAudioUpload = async (file: File) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/musics`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("트랙 파일 업로드에 실패했습니다.");

      const trackUrl = await response.text();
      setForm((prev) => ({ ...prev, trackFile: trackUrl }));

      // 오디오 파일의 재생 시간 가져오기
      const audio = new Audio(URL.createObjectURL(file));
      audio.addEventListener("loadedmetadata", () => {
        setForm((prev) => ({ ...prev, duration: Math.floor(audio.duration) }));
      });

      toast({
        variant: "default",
        title: "트랙 파일 업로드 완료",
        description: "트랙 파일이 업로드되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "트랙 파일 업로드 실패",
        description:
          error instanceof Error
            ? error.message
            : "트랙 파일 업로드에 실패했습니다.",
      });
      setAudioFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlbum) {
      toast({
        title: "앨범 선택 실패",
        variant: "destructive",
        description: "앨범을 선택해주세요.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/${selectedAlbum}/tracks`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!response.ok) throw new Error("트랙 생성에 실패했습니다.");

      toast({
        variant: "default",
        title: "트랙 추가 완료",
        description: "트랙이 추가되었습니다.",
      });

      router.push(`/albums/${selectedAlbum}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "트랙 추가 실패",
        description:
          error instanceof Error ? error.message : "트랙 생성에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center">
          <Music2 className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            트랙을 추가하려면 먼저 앨범을 생성해야 합니다
          </p>
          <Button asChild>
            <Link href="/upload/album">앨범 만들기</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 앨범 선택 섹션 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">앨범 선택</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/upload/album">새 앨범 만들기</Link>
            </Button>
          </div>
          <AlbumSelect
            albums={albums}
            selectedAlbum={selectedAlbum}
            onSelect={setSelectedAlbum}
          />
        </div>

        {/* 트랙 정보 섹션 */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold">트랙 정보</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-bold mb-2 block">
                  트랙 제목
                </label>
                <Input
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="트랙 제목을 입력하세요"
                  className="bg-white/5 border-white/10"
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">정보</label>
                <Textarea
                  value={form.lyric}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lyric: e.target.value }))
                  }
                  placeholder="정보를 입력하세요"
                  className="bg-white/5 border-white/10 min-h-[300px] resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                트랙 파일
              </label>
              <div
                className={cn(
                  "relative aspect-square",
                  "rounded-2xl",
                  "bg-white/5",
                  "border-2 border-dashed border-white/10",
                  "transition-all duration-300",
                  "hover:border-white/20",
                  "group",
                  isLoading && "opacity-50 pointer-events-none"
                )}
              >
                {audioFile ? (
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center">
                      <p className="font-medium mb-2 break-all">
                        {audioFile.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setAudioFile(null)}
                      >
                        파일 변경
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground group-hover:text-black/50 transition-colors" />
                    </div>
                    <div className="text-center">
                      {audioFile ? (
                        <p className="font-medium mb-1">{audioFile}</p>
                      ) : (
                        <>
                          <p className="font-medium mb-1">
                            트랙 파일을 업로드하세요
                          </p>
                          <p className="text-sm text-muted-foreground">
                            MP3, WAV 파일 지원
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  accept="audio/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAudioFile(file);
                      handleAudioUpload(file);
                    }
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !form.trackFile || !selectedAlbum}
          >
            {isLoading ? "트랙 추가 중..." : "트랙 추가하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
