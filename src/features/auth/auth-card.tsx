'use client'

import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const AuthCard = () => {
  const router = useRouter();
  
  const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;

  const handleGoogleLogin = async () => {
    router.push(`${googleOAuthUrl}`)
  }

  return (
    <Card className="w-full h-full p-8 bg-transparent backdrop-blur-md shadow-md border-white/50">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center justify-center gap-x-4">
          <Image
            src={"/images/logo.svg"}
            alt="logo"
            width={30}
            height={30}
          />
           <span className="text-white text-2xl font-bold">
             Untitled
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0 pt-4">
        <div className="flex flex-col gap-y-2.5">
            <Button
                disabled={false}
                onClick={handleGoogleLogin}
                variant="outline"
                size="lg"
                className="w-full relative bg-transparent flex items-center justify-start gap-x-14 hover:text-white hover:bg-white/10 md:hover:bg-black/20"
            >
                <FcGoogle className="size-5" />
                <span className="text-white font-bold text-sm">
                Continue with Google
                </span>
            </Button>
          </div>
        </CardContent>
      </Card>
  );
};
