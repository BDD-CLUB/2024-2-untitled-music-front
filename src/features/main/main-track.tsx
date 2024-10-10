import SquareContainer from "@/components/container/square-container";

const MainTrack = () => {
    const dummy = [
        {
            src: "/images/music1.png",
            name: "ROCK-STAR",
        },
        {
            src: "/images/music1.png",
            name: "ROCK-STAR",
        },
        {
            src: "/images/music1.png",
            name: "ROCK-STAR",
        },
        {
            src: "/images/music1.png",
            name: "BREAK",
        },
        {
            src: "/images/music1.png",
            name: "Thirsty",
        },
        {
            src: "/images/music1.png",
            name: "산책",
        },
    ]

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex justify-start">
                <p className="text-[#FF4D74] font-bold text-xl tracking-wide">
                    TRACK
                </p>
            </div>
            <div className="w-full overflow-x-auto flex gap-x-4">
                {dummy.map((item) => (
                    <SquareContainer
                        key={item.name}
                        src={item.src}
                        name={item.name}
                        description="Track"
                        design="rounded-xl"
                    />
                ))}
            </div>
        </div>
    )
};

export default MainTrack;