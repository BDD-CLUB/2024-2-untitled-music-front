import { Spotlight } from "@/components/ui/Spotlight";

const Hero = () => {
  return (
    <>
      <Spotlight
        className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
        fill="pink"
      />
      <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
      <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="indigo" />
    </>
  );
};

export default Hero;
