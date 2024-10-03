import type { Metadata } from "next";
import "./globals.css";

import Hero from "@/features/main/hero";
import { Bar } from "@/features/main/bar";
import { Toaster } from "@/components/ui/sonner";
import { SigninButton } from "@/features/main/signin-button";
import ModalProvider from "@/components/modal/modal-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Untitled",
  description: "untitled demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider />
          <Toaster />

          <div className="relative flex h-full flex-col overflow-hidden">
            <Hero />

            <div className="md:hidden fixed bottom-0 inset-x-0 flex mb-1">
              <Bar />
            </div>
            <div className="hidden md:flex fixed left-0 top-1/2 transform -translate-y-1/2 ml-4">
              <Bar />
            </div>

            <div className="fixed top-0 right-0 m-4">
              <SigninButton />
            </div>

            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
