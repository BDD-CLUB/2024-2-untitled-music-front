import SquareContainer from "@/components/container/square-container";

const UserPlaylist = () => {
  const dummy = [
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "플레이리스트",
    },
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "플레이리스트",
    },
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "플레이리스트",
    },
    {
      src: "/images/music1.png",
      name: "BREAK",
      description: "플레이리스트",
    },
    {
      src: "/images/music1.png",
      name: "Thirsty",
      description: "플레이리스트",
    },
    {
      src: "/images/music1.png",
      name: "산책",
      description: "플레이리스트",
    },
  ];

  return (
    <div className="h-full">
      <div className="w-full gap-x-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center">
        {dummy.map((item) => (
          <SquareContainer
            key={item.name}
            src={item.src}
            name={item.name}
            description={item.description}
            design="rounded-xl"
          />
        ))}
      </div>
    </div>
  );
};

export default UserPlaylist;
