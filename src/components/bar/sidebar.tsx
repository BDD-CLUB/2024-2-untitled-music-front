import Link from "next/link";

import { SidebarItem } from "./sidebar-item";
import { SettingButton } from "./setting-button";

export const Sidebar = () => {
  return (
    <aside className="h-full w-20 border-r border-purple-300 bg-black flex flex-col gap-y-4 items-center py-4 text-white">
      <Link href={"/"} className="text-2xl mb-6">
        🦋
      </Link>

      <SidebarItem />

      <div className="flex flex-col items-center justify-center mt-auto mb-2">
        <SettingButton />
      </div>
    </aside>
  );
};
