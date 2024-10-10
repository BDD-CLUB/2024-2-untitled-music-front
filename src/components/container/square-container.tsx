import Image from "next/image";

interface SquareContainerProps {
    src: string;
    name: string;
    description: string;
    design: string;
}

const SquareContainer = ({
    src,
    name,
    description,
    design,
}: SquareContainerProps) => {
    return (
        <div className="flex flex-col h-60 w-52 bg-transparent items-center justify-center hover:bg-gradient-to-b from-[#FBB9B9] to-[#FCE5D5] dark:from-[#D8C2DC4D] dark:to-[#2D1E274D] rounded-lg pb-4 transition">
            <div className="mt-4 flex items-center justify-center h-40 w-40">
                <Image
                    src={src}
                    alt="profile"
                    width={150}
                    height={150}
                    className={design}
                />
            </div>
            <div className="mt-2 font-bold text-lg text-black dark:text-white text-center tracking-wide">
                {name}
            </div>
            <span className="font-medium text-sm text-neutral-600 dark:text-neutral-400 text-center">
                {description}
            </span>
        </div>
    )
};

export default SquareContainer;