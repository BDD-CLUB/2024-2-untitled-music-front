"use client";

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import useSigninModal from "@/hooks/modal/use-signin-modal";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";

export function SigninModal() {
  const signinModal = useSigninModal();
  const router = useRouter();

  const onChange = (open: boolean) => {
    if (!open) {
      signinModal.onClose();
    }
  };

  const googleOAuthUrl = `${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL}`;

  const handleGoogleLogin = async () => {
    router.push(`${googleOAuthUrl}`);
  };

  return (
    <Dialog open={signinModal.isOpen} onOpenChange={onChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black dark:bg-opacity-50 bg-opacity-50 fixed inset-0" />
        <DialogContent className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border border-transparent h-[50%] w-full md:max-w-[800px] md:rounded-2xl bg-[url('/images/auth-background.svg')] bg-current bg-center bg-no-repeat p-0 flex">
          <DialogTitle className="hidden">로그인</DialogTitle>
          <DialogDescription className="hidden">로그인</DialogDescription>
          <div className="hidden md:flex w-1/4" />

          <div className="w-full md:w-3/4 h-full flex flex-col gap-y-4 items-center bg-[#FFFFFF99] dark:bg-[#00000099] md:rounded-2xl pt-8">
            <Image src={"/images/logo.svg"} alt="logo" width={35} height={35} />
            <h1 className="text-2xl font-bold dark:text-white">Untitled</h1>
            <p className="text-sm text-[#222222] dark:text-white">
              로그인하고 모든 서비스를 이용해보세요!
            </p>
            <div className="mt-20 flex w-4/5 md:w-full items-center justify-center">
              <button
                onClick={handleGoogleLogin}
                className="md:w-[300px] w-full relative flex items-center justify-center md:justify-start gap-x-4 md:gap-x-10 border py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200  dark:bg-gradient-to-r dark:from-[#000000] dark:to-[#1E1E1E] dark:hover:opacity-75"
              >
                <FcGoogle className="size-5 ml-0 md:ml-6" />
                <span className="text-neutral-700 dark:text-white font-bold text-sm">
                  Continue with Google
                </span>
              </button>
            </div>
          </div>
          
          <DialogClose asChild>
            <CloseIcon />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

const CloseIcon = () => {
  return (
    <button className="absolute top-4 right-4 group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};
