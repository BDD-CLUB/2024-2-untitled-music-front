"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProfileStatusProps {
  userId: string;
}

interface StatusItemProps {
  label: string;
  count: number;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, latest => Math.round(latest));

  useEffect(() => {
    const animation = animate(motionValue, value, {
      duration: 1.5,
      type: "spring",
    });

    return animation.stop;
  }, [value, motionValue]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
    >
      {rounded}
    </motion.span>
  );
};

const StatusItem = ({ label, count }: StatusItemProps) => (
  <div className="flex-1 flex flex-col items-center p-4 rounded-2xl backdrop-blur-md 
                  bg-white/5 hover:bg-white/10 dark:bg-black/5 dark:hover:bg-black/10 
                  transition-all duration-300 ease-in-out
                  border border-white/10 hover:border-white/20
                  dark:border-white/5 dark:hover:border-white/10
                  shadow-lg hover:shadow-xl">
    <AnimatedNumber value={count} />
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-sm mt-2 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300
                 transition-colors duration-300"
    >
      {label}
    </motion.span>
  </div>
);

export function ProfileStatus({ userId }: ProfileStatusProps) {
  const { toast } = useToast();
  const [stats, setStats] = useState({
    albums: 0,
    tracks: 0,
    playlists: 0,
    followers: 0,
    following: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 앨범 수 가져오기
        const albumsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${userId}/albums`,
          { credentials: 'include' }
        );
        const albumsData = await albumsResponse.json();
        
        // 트랙 수 가져오기
        const tracksResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${userId}/tracks?page=0&size=1`,
          { credentials: 'include' }
        );
        const tracksData = await tracksResponse.json();
        const totalTracks = tracksData.totalElements || 0;

        // 플레이리스트 수 가져오기
        const playlistsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/artists/${userId}/playlists`,
          { credentials: 'include' }
        );
        const playlistsData = await playlistsResponse.json();

        setStats({
          albums: albumsData.length,
          tracks: totalTracks,
          playlists: playlistsData.length,
          followers: 0, // 아직 구현되지 않음
          following: 0, // 아직 구현되지 않음
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        toast({
          variant: "destructive",
          description: "통계 정보를 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="py-8 px-8">
        <div className="flex gap-4 w-full">
          <StatusItem label="앨범" count={0} />
          <StatusItem label="트랙" count={0} />
          <StatusItem label="플레이리스트" count={0} />
          <StatusItem label="팔로워" count={0} />
          <StatusItem label="팔로잉" count={0} />
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex gap-4 w-full"
      >
        <StatusItem label="앨범" count={stats.albums} />
        <StatusItem label="트랙" count={stats.tracks} />
        <StatusItem label="플레이리스트" count={stats.playlists} />
        <StatusItem label="팔로워" count={stats.followers} />
        <StatusItem label="팔로잉" count={stats.following} />
      </motion.div>
    </div>
  );
} 