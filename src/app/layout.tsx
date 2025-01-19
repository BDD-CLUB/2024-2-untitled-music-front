import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundImage } from "@/components/layout/BackgroundImage";
import { getAuthCookie } from "@/lib/server-auth";
import { ThemeProvider } from "@/contexts/theme/ThemeContext";
import { UserProvider } from "@/contexts/auth/UserContext";
import { Toaster } from "@/components/ui/toaster"
import { PageAnimation } from "@/components/layout/PageAnimation";
import { AudioProvider } from "@/contexts/audio/AudioContext";

// getUser 함수 수정
const getUser = async () => {
  const accessToken = getAuthCookie();
  
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/my-profile`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error('Failed to fetch user:', response.status);
      return null;
    }

    // response.json() 한 번만 호출
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

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
  // 초기 유저 정보 가져오기
  const initialUser = await getUser();
  const isAuthenticated = !!initialUser;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider initialAuth={isAuthenticated}>
            <UserProvider initialUser={initialUser}>
              <AudioProvider>
                <BackgroundImage />
                <div className="relative min-h-screen w-full overflow-hidden">
                  <Header />
                  <Sidebar />
                  <main>
                    <PageAnimation>
                      {children}
                    </PageAnimation>
                  </main>
                  <Toaster />
                </div>
              </AudioProvider>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
