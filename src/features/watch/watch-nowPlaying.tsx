import RectangleContainer from "@/components/container/rectangle-container";

const WatchNowPlaying = () => {
    const dummy = [
        {
            id: 1,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
        {
            id: 2,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
        {
            id: 3,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
        {
            id: 4,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
        {
            id: 5,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
        {
            id: 6,
            cover: "/images/albumcover.png",
            name: "THIRSTY",
            artist: "검정치마",
            album: "THIRSTY",
            duration: "3:02",
        },
    ]
    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            {dummy.map((item) => (
                <RectangleContainer
                    key={item.id}
                    cover={item.cover}
                    name={item.name}
                    artist={item.artist}
                    album={item.album}
                    duration={item.duration}
                />
            ))}
        </div>
    );
};

export default WatchNowPlaying;