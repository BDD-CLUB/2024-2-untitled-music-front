import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth/AuthContext";
import { cookies } from "next/headers";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BackgroundImage } from "@/components/layout/BackgroundImage";

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
  const cookieStore = cookies();
  const authCookie = cookieStore.get('access_token');
  
  if (!authCookie) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists`, {
      headers: {
        Cookie: `access_token=${authCookie.value}`,
      },
      credentials: "include",
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return response.json();
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
