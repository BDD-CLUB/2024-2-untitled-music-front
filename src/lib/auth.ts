import { cookies } from 'next/headers';

// 서버 컴포넌트에서 사용
export function getAuthCookie() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token');
  return !!accessToken;  // 존재 여부만 반환
}

// 클라이언트 컴포넌트에서 사용
export async function checkAuth() {
  try {
    const response = await fetch('/api/auth/token');
    if (!response.ok) return { isAuthenticated: false };
    return response.json();
  } catch (error) {
    console.error('Error checking auth:', error);
    return { isAuthenticated: false };
  }
}