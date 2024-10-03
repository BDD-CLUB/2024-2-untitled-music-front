"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../../components/ui/animated-modal";
import { IconLogin } from "@tabler/icons-react";

export function SigninButton() {
  const router = useRouter();
  
  const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;

  const handleGoogleLogin = async () => {
    router.push(`${googleOAuthUrl}`)
  }

  const images = [
    "/images/auth-background.svg",
    "/images/music1.png",
    "/images/music2.jpg",
    "/images/music3.jpg",
    "/images/music4.jpg",
  ];
  return (
    <div className="flex items-center justify-center">
      <Modal>
        <ModalTrigger className="bg-transparent dark:text-neutral-300 text-neutral-700 flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500 text-base font-bold tracking-wide">
            START!
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-neutral-700 dark:text-neutral-300 z-20">
            <IconLogin />
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <div className="flex items-center justify-center">
              <Image
                src={"/images/logo.svg"}
                alt="logo"
                width={35}
                height={35}
              />
              <span className="text-2xl font-bold ml-2">Untitled</span>
            </div>
            <div className="flex justify-center items-center mt-8">
              {images.map((image, idx) => (
                <motion.div
                  key={"images" + idx}
                  style={{
                    rotate: Math.random() * 20 - 10,
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  whileTap={{
                    scale: 1.1,
                    rotate: 0,
                    zIndex: 100,
                  }}
                  className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={image}
                    alt="images"
                    width="500"
                    height="500"
                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                  />
                </motion.div>
              ))}
            </div>
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
          </ModalContent>
          <ModalFooter>
            {""}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
