import MainTrack from "./main-track";
import MainAlbum from "./main-album";
import MainArtist from "./main-artist";
import MainPlaylist from "./main-playlist";

const MainContents = () => {
  return (
    <div className="h-full w-full flex flex-col gap-y-12 mt-6">
      <MainArtist />
      <MainAlbum />
      <MainTrack />
      <MainPlaylist />
    </div>
  );
};

export default MainContents;
