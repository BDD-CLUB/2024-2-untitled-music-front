import MainContents from "@/features/main/main-contents";

export default function Home() {
  return (
    <main className="bg-transparent h-full mb-20 pl-4 mt-16 pt-2 md:pl-0 md:mb-0 md:ml-48 md:pr-28 overflow-y-auto hide-scrollbar pr-4">
      <MainContents />
    </main>
  );
}