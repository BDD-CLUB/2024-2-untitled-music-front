import { cookies } from 'next/headers';

// 서버 컴포넌트에서만 사용
export function getAuthCookie() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  return accessToken || null;  // 토큰 값 자체를 반환
} 