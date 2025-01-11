import Image from "next/image";

export function BackgroundImage() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <div className="absolute inset-0 bg-background dark:hidden">
        <Image
          src="/images/background-color.webp"
          alt="Background"
          fill
          priority
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-background hidden dark:block">
        <Image
          src="/images/background-color-dark.webp"
          alt="Background Dark"
          fill
          priority
          sizes="100vw"
          quality={60}
          className="object-cover"
        />
      </div>
    </div>
  );
} 