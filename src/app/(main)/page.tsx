import Background from "@/components/background";
import Link from "next/link";

export default function MainPage() {
  return (
    <main className="h-full bg-black py-10 px-8 md:px-16 text-white">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <Background
          color="bg-purple-500"
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0}
        />
        <Background
          color="bg-indigo-500"
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5}
        />
        <Background
          color="bg-violet-500"
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={2}
        />

        <Link href={"/album/123"} className="border border-white p-4">
          Go to album page
        </Link>
      </div>
    </main>
  );
}
