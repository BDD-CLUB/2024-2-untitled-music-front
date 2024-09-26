import { BottombarItem } from "./bottombar-item";

export const Bottombar = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0">
      <nav className="h-14 border-t border-white bg-black items-center justify-around text-white flex">
        <BottombarItem />
      </nav>
    </div>
  );
};
