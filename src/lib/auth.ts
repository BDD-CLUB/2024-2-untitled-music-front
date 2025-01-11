import { cookies } from 'next/headers';

// 서버 컴포넌트에서 사용할 함수
export function getAuthCookie() {
  const cookieStore = cookies();
  return cookieStore.get('access_token')?.value;
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function getAuthToken() {
  try {
    const response = await fetch('/api/auth/token');
    if (!response.ok) return null;
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}