import MainTrack from "./main-track";
import MainAlbum from "./main-album";
import MainArtist from "./main-artist";

const MainContents = () => {
  return (
    <div className="h-full w-full flex flex-col gap-y-12 mt-6">
      <MainArtist />
      <MainAlbum />
      <MainTrack />
    </div>
  );
};

export default MainContents;
