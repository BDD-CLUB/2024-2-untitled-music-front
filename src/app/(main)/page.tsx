import Link from "next/link";

export default function MainPage() {
  return (
    <main className="h-full bg-black py-10 px-8 md:px-16 text-white relative">

      <div className="h-full w-full flex flex-col items-center justify-center">
        <Link href={"/album/123"} className="border border-white p-4">
          Go to album page !
        </Link>
      </div>
      
    </main>
  );
}
