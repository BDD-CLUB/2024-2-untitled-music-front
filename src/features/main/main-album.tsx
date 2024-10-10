import SquareContainer from "@/components/container/square-container";

const MainAlbum = () => {
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
    ]

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex justify-start">
                <p className="text-[#FF4D74] font-bold text-xl">
                    RARO
                </p>
                <p className="font-bold text-xl">
                    님을 위한 앨범
                </p>
            </div>
            <div className="w-full overflow-x-auto flex gap-x-4">
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
    )
};

export default MainAlbum;