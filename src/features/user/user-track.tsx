import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconClock, IconPlayerPlayFilled } from "@tabler/icons-react";

const UserTrack = () => {
  const dummy = [
    {
      id: 1,
      cover: "/images/music1.png",
      title: "피곤해",
      artist: "RARO",
      album: "SUPERNOVA",
      releaseDate: "2024.10.05",
      duration: "3:02",
    },
    {
      id: 2,
      cover: "/images/music1.png",
      title: "피곤해",
      artist: "RARO",
      album: "SUPERNOVA",
      releaseDate: "2024.10.05",
      duration: "3:02",
    },
    {
      id: 3,
      cover: "/images/music1.png",
      title: "피곤해",
      artist: "RARO",
      album: "SUPERNOVA",
      releaseDate: "2024.10.05",
      duration: "3:02",
    },
    {
      id: 4,
      cover: "/images/music1.png",
      title: "피곤해",
      artist: "RARO",
      album: "SUPERNOVA",
      releaseDate: "2024.10.05",
      duration: "3:02",
    },
    {
      id: 5,
      cover: "/images/music1.png",
      title: "피곤해",
      artist: "RARO",
      album: "SUPERNOVA",
      releaseDate: "2024.10.05",
      duration: "3:02",
    },
  ];

  return (
    <div className="h-full">
      <Table>
        <TableHeader className="bg-white/40 dark:bg-white/5">
          <TableRow className="hidden md:table-row">
            <TableHead>#</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>아티스트</TableHead>
            <TableHead>앨범</TableHead>
            <TableHead>추가한 날짜</TableHead>
            <TableHead>
              <IconClock />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummy.map((song) => (
            <TableRow key={song.id} className="group hover:bg-white/40 dark:hover:bg-white/10">
              <TableCell className="w-[50px]">
                <div className="flex group-hover:hidden">{song.id}</div>
                <div className="hidden group-hover:flex text-[#FF239C]"><IconPlayerPlayFilled /></div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Image
                    src={song.cover}
                    alt={song.title}
                    className="rounded-md"
                    width={40}
                    height={40}
                  />
                  <span className="overflow-hidden shrink-0">{song.title}</span>
                </div>
              </TableCell>
              <TableCell className="overflow-hidden">{song.artist}</TableCell>
              <TableCell className="overflow-hidden">{song.album}</TableCell>
              <TableCell className="overflow-hidden hidden md:table-cell">{song.releaseDate}</TableCell>
              <TableCell>{song.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTrack;
