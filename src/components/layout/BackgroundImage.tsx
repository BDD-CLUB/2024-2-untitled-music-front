import Image from "next/image";

export function BackgroundImage() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <div className="absolute inset-0 bg-background dark:hidden">
        <Image
          src="/images/background-color.svg"
          alt="Background"
          fill
          loading="lazy"
          quality={75}
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-background hidden dark:block">
        <Image
          src="/images/background-color-dark.svg"
          alt="Background Dark"
          fill
          loading="lazy"
          quality={75}
          className="object-cover"
        />
      </div>
    </div>
  );
} 