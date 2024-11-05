"use client";

import axios from "axios";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import useSigninModal from "@/hooks/modal/use-signin-modal";

import ModalTitle from "./modal-title";
import { CustomModal } from "./custom-modal";

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
   router.push(`${googleOAuthUrl}`)
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={
            <Image src={"/images/logo.svg"} alt="logo" width={35} height={35} />
          }
          title="Untitled"
          className="bg-none"
        />
      }
      description="로그인하고 모든 서비스를 이용해보세요!"
      isOpen={signinModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center h-[50%]"
    >
      <div className="mt-20 flex items-center justify-center">
        <button
          onClick={handleGoogleLogin}
          className="md:w-[300px] w-full relative flex items-center justify-start gap-x-10 border py-2.5 rounded-xl bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-300 dark:bg-gray-300 dark:hover:opacity-75"
        >
          <FcGoogle className="size-5 ml-6" />
          <span className="text-neutral-700 font-bold text-sm">
            Continue with Google
          </span>
        </button>
      </div>
    </CustomModal>
  );
}
