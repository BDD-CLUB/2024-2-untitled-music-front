import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogPortal, DialogTitle } from "../ui/dialog";

import useNotiModal from "@/hooks/modal/use-noti-modal";

export const NotiModal = () => {
  const notiModal = useNotiModal();

  const onChange = (open: boolean) => {
    if (!open) {
      notiModal.onClose();
    }
  };

  const imageUpon = (profileImage: string, anotherProfileImage: string) => {
    const first = profileImage;
    const second = anotherProfileImage;

    return (
      <div className="relative w-11 h-11 mr-2">
        <div className="absolute top-0 left-0 w-8 h-8">
          <Image
            src={second}
            alt="Base image"
            width={44}
            height={44}
            className="rounded-full"
          />
        </div>
        <div className="absolute bottom-0 right-0 w-8 h-8">
          <Image
            src={first}
            alt="Overlay image"
            width={44}
            height={44}
            className="rounded-full"
          />
        </div>
      </div>
    );
  };

  const dummy = [
    {
      id: "1",
      username: "didfkdbs_77",
      action: "님이 회원님을 팔로우하기 시작했습니다.",
      time: "지금",
      notiType: "follow",
      profileImage: "/images/music1.png",
      isFollow: true,
    },
    {
      id: "2",
      username: "didfkdbs_77, newjeans_111, StrayKids_88",
      action: "님이 회원님의 플레이리스트를 좋아합니다.",
      time: "1일",
      notiType: "like",
      profileImage: "/images/music1.png",
      anotherProfileImage: "/images/background-color.svg",
    },
    {
      id: "3",
      username: "didfkdbs_77, newjeans_111",
      action: "님이 회원님의 트랙을 좋아합니다.",
      time: "2일",
      notiType: "like",
      profileImage: "/images/music1.png",
      anotherProfileImage: "/images/background-color-dark.svg",
    },
    {
      id: "4",
      username: "didfkdbs_77",
      action: "님이 회원님을 팔로우하기 시작했습니다.",
      time: "지금",
      notiType: "follow",
      profileImage: "/images/music1.png",
      isFollow: false,
    },
  ];

  return (
    <Dialog open={notiModal.isOpen} onOpenChange={onChange}>
      <DialogPortal>
        <DialogContent className="fixed top-[50%] left-0 md:left-[10%] flex flex-col translate-x-0 translate-y-[-50%] border border-transparent h-full md:h-[95%] md:rounded-2xl bg-neutral-100 backdrop-blur-xl bg-opacity-75 dark:bg-neutral-800 w-full md:w-[450px] drop-shadow-2xl p-0">
          <DialogTitle className="text-2xl tracking-wide text-left font-bold w-full mt-4 ml-6">
            알림
          </DialogTitle>
          <DialogDescription className="hidden">알림</DialogDescription>
          <div className="flex flex-col gap-y-6 mt-1 mb-6 mx-6">
            <div className="h-full flex flex-col gap-y-4">
              <h2 className="text-left font-bold text-base">이번주</h2>
              <div className="flex flex-col gap-y-4">
                {dummy.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center gap-x-2 h-[50px]"
                  >
                    {item.anotherProfileImage ? (
                      imageUpon(item.profileImage, item.anotherProfileImage)
                    ) : (
                      <Avatar className="w-11 h-11 mr-2">
                        <AvatarImage
                          src={item.profileImage}
                          alt={item.username}
                        />
                        <AvatarFallback>{item.username[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="overflow-hidden flex-1 mr-2">
                      <p className="text-sm">
                        <span className="font-semibold">{item.username}</span>{" "}
                        {item.action}{" "}
                        <span className="text-gray-500">{item.time}</span>
                      </p>
                    </div>
                    <div className="flex items-end justify-end">
                      {item.notiType === "follow" ? (
                        item.isFollow ? (
                          <button className="bg-[#FD01B0] hover:bg-opacity-75 text-white rounded-md text-sm font-bold p-1 w-[75px]">
                            팔로우
                          </button>
                        ) : (
                          <button className="bg-neutral-300 hover:bg-neutral-400 text-black rounded-md text-sm font-bold p-1 w-[75px]">
                            팔로잉
                          </button>
                        )
                      ) : (
                        <Image
                          src="/images/music1.png"
                          alt="image"
                          width={50}
                          height={50}
                          className="rounded-md aspect-square"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-full flex flex-col gap-y-4">
              <h2 className="text-left font-bold text-base">이번달</h2>
              <div className="flex flex-col gap-y-4">
                {dummy.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-center gap-x-2 h-[50px]"
                  >
                    {item.anotherProfileImage ? (
                      imageUpon(item.profileImage, item.anotherProfileImage)
                    ) : (
                      <Avatar className="w-11 h-11 mr-2">
                        <AvatarImage
                          src={item.profileImage}
                          alt={item.username}
                        />
                        <AvatarFallback>{item.username[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="overflow-hidden flex-1 mr-2">
                      <p className="text-sm">
                        <span className="font-semibold">{item.username}</span>{" "}
                        {item.action}{" "}
                        <span className="text-gray-500">{item.time}</span>
                      </p>
                    </div>
                    <div className="flex items-end justify-end">
                      {item.notiType === "follow" ? (
                        item.isFollow ? (
                          <button className="bg-[#FD01B0] hover:bg-opacity-75 text-white rounded-md text-sm font-bold p-1 w-[75px]">
                            팔로우
                          </button>
                        ) : (
                          <button className="bg-neutral-300 hover:bg-neutral-400 text-black rounded-md text-sm font-bold p-1 w-[75px]">
                            팔로잉
                          </button>
                        )
                      ) : (
                        <Image
                          src="/images/music1.png"
                          alt="image"
                          width={50}
                          height={50}
                          className="rounded-md aspect-square"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
