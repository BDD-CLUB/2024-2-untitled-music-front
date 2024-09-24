import { Bottombar } from "@/components/bar/bottombar";
import { Sidebar } from "@/components/bar/sidebar";
import { Topbar } from "@/components/bar/topbar";

interface AlbumLayoutProps {
    children: React.ReactNode;
};

const AlbumLayout = ({
    children
}: AlbumLayoutProps) => {
    return (
        <div className="flex h-full">
          <Sidebar />
          <div className="flex flex-col flex-1">
            <Topbar />
            <div className="flex-1">
              {children}
            </div>
            <Bottombar />
          </div>
        </div>
    );
};

export default AlbumLayout;