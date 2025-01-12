import { cookies } from 'next/headers';

// 서버 컴포넌트에서만 사용
export function getAuthCookie() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  return accessToken || null;
}

// 서버 컴포넌트에서 로그아웃 처리
export async function serverLogout() {
  const cookieStore = cookies();
  cookieStore.set('access_token', '', {
    expires: new Date(0),
    path: '/',
  });
} 