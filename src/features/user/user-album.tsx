import SquareContainer from "@/components/container/square-container";

const UserAlbum = () => {
  const dummy = [
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
    },
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
    },
    {
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
    },
    {
      src: "/images/music1.png",
      name: "BREAK",
      description: "2018 · PALM",
    },
    {
      src: "/images/music1.png",
      name: "Thirsty",
      description: "1988 · RARO",
    },
    {
      src: "/images/music1.png",
      name: "산책",
      description: "EP · BDD",
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

export default UserAlbum;
