import { cache } from 'react';
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundImage } from "@/components/layout/BackgroundImage";
import { getAuthCookie } from "@/lib/server-auth";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import { UserProvider } from "@/contexts/auth/UserContext";

// getUser를 layout 레벨에서 캐싱
const getUser = cache(async () => {
  const accessToken = getAuthCookie();
  
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
});

export const metadata: Metadata = {
  title: "SOFO",
  description: "SOund FOrest",
  icons: {
    icon: "/images/logo.svg",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 캐시된 getUser 함수 사용
  const user = await getUser();

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider initialUser={user}>
              <BackgroundImage />
              <div className="relative min-h-screen w-full overflow-hidden">
                <div className="fixed inset-0 backdrop-blur-[2px] bg-white/[0.01] dark:bg-transparent" />
                <Sidebar />
                <Header />
                <main className="relative pt-24">{children}</main>
              </div>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
