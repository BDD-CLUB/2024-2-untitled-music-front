import MainContents from "@/features/main/main-contents";

export default function Home() {
  return (
    <main className="bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-16 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar">
      <MainContents />
    </main>
  );
}