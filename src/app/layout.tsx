import "./globals.css";
import type { Metadata } from "next";

import { Bar } from "@/features/main/bar";
import { getAccessToken, getProfileUUID } from "@/lib/cookie";
import Topbar from "@/features/main/topbar";
import ModalProvider from "@/components/modal/modal-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";

import AuthProvider from "@/provider/authProvider";
import { UserProvider } from "@/provider/userProvider";
import { ProfileProvider } from "@/provider/profileProvider";

export const metadata: Metadata = {
  title: "Untitled",
  description: "untitled demo app",
  icons: {
    icon: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = getAccessToken();
  const profileUUID = getProfileUUID() ?? null;

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider accessToken={accessToken}>
            <UserProvider>
              <ProfileProvider uuid={profileUUID}>
                <ModalProvider />
                <Toaster />

                <div className="relative flex h-full flex-col overflow-hidden bg-[url('/images/background-color.svg')] bg-cover bg-center dark:bg-[url('/images/background-color-dark.svg')]">
                  <div className="md:hidden fixed bottom-0 inset-x-0 flex mb-1">
                    <Bar />
                  </div>
                  <div className="hidden md:flex fixed left-0 top-1/2 transform -translate-y-1/2 ml-4">
                    <Bar />
                  </div>

                  <div className="fixed top-0 left-0 right-0">
                    <Topbar />
                  </div>

                  {children}
                </div>
              </ProfileProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
