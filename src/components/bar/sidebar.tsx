import Link from "next/link";

import { SidebarItem } from "./sidebar-item";
import { SettingButton } from "./setting-button";
import Image from "next/image";

export const Sidebar = () => {
  return (
    <aside className="hidden h-full w-20 border-r border-black bg-black md:flex flex-col gap-y-4 items-center py-4 text-white">
      <Link href={"/"} className="text-2xl mb-6">
        <Image
          src={"/images/logo.svg"}
          alt="logo"
          width={30}
          height={30}
        />  
      </Link>

      <div className="flex flex-col items-center justify-center my-auto">
        <SidebarItem />
      </div>

      <div className="flex flex-col items-center justify-center mt-auto mb-2">
        <SettingButton />
      </div>
    </aside>
  );
};
