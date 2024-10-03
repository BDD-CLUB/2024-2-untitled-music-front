import Image from "next/image";

export default function Loading() {
  return (
    <div className="max-w-4xl h-full w-full mx-auto flex flex-col items-center justify-center gap-y-2">
      <Image
        src={'/images/logo.svg'}
        alt="logo"
        width={50}
        height={50}
      />
      <p className="text-black dark:text-white text-lg font-bold inter-var">
        Untitled
      </p>
    </div>
  );
}
