export interface Album {
  albumResponseDto: {
    uuid: string;
    title: string;
    description: string;
    artImage: string;
    releaseDate: string;
  };
  trackResponseDtos: Array<{
    uuid: string;
    title: string;
    lyric: string;
    duration: number;
    artUrl: string;
  }>;
  artistResponseDto: {
    uuid: string;
    name: string;
    role: "ROLE_USER";
    email: string;
    artistImage: string;
  };
} 