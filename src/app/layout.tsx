import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundImage } from "@/components/layout/BackgroundImage";
import { getAuthCookie } from "@/lib/auth";

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

async function getUser() {
  const accessToken = getAuthCookie();
  
  console.log('GetUser - Access token:', accessToken);
  
  if (!accessToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists`, {
      headers: {
        Cookie: `access_token=${accessToken}`,
      },
      credentials: "include",
      next: { revalidate: 3600 },
    });

    console.log('GetUser - Response status:', response.status);
    
    if (!response.ok) return null;
    const userData = await response.json();
    
    console.log('GetUser - User data:', userData);
    
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html lang="ko">
      <body suppressHydrationWarning>
        <AuthProvider initialUser={user}>
          <div className="relative min-h-screen w-full overflow-hidden">
            <BackgroundImage />
            <div className="relative">
              <div className="fixed inset-0 backdrop-blur-[2px] bg-white/[0.01] dark:bg-transparent" />
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
