import { FcGoogle } from "react-icons/fc"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const AuthCard = () => {
  return (
    <Card className="w-full h-full p-8 bg-black">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-center text-2xl text-white"> 
            Untitled
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-0 pb-0">
        <div className="flex flex-col gap-y-2.5">
            <Button
                disabled={false}
                onClick={() => {}}
                variant="outline"
                size="lg"
                className="w-full relative font-bold bg-white"
            >
                <FcGoogle className="size-5 absolute top-2 left-2.5" />
                Continue with Google
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
