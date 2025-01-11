import { cookies } from 'next/headers';

export function getAuthCookie() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  
  // 디버깅 로그
  console.log('All cookies:', cookieStore.getAll());
  console.log('Access token:', accessToken);
  
  return accessToken;
} 