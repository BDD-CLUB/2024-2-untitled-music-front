import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { cookies } from "next/headers";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "SOFO",
  description: "SOund FOrest",
  icons: {
    icon: "/images/logo.svg",
  },
};

async function getUser() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('access_token');
  
  if (!authCookie) return null;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists`, {
    headers: {
      Cookie: `access_token=${authCookie.value}`,
    },
    credentials: "include",
  });

  if (!response.ok) return null;
  return response.json();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider initialUser={user}>
          <div className="relative min-h-screen w-full overflow-hidden">
            {/* 배경 이미지 */}
            <div className="fixed inset-0 w-full h-full">
              <div className="absolute inset-0 bg-background dark:hidden">
                <Image
                  src="/images/background-color.svg"
                  alt="Background"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-background hidden dark:block">
                <Image
                  src="/images/background-color-dark.svg"
                  alt="Background Dark"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* 글래스모피즘 컨테이너 */}
            <div className="relative">
              <div
                className={cn(
                  "fixed inset-0 backdrop-blur-[2px]",
                  "bg-white/[0.01] dark:bg-transparent",
                )}
              />
              <Sidebar />
              <Header />
              <main className="relative pt-24">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
