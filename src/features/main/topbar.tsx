import StreamingBar from "@/components/bar/streaming-bar";
import { SigninButton } from "@/components/bar/signin-button";

export default function Topbar() {
  return (
    <div className="h-14 bg-transparent flex items-center justify-end md:justify-between">
      <StreamingBar />
      <SigninButton />
    </div>
  );
}
