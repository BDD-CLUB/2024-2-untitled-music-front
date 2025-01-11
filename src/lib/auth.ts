import { cookies } from 'next/headers';

// 서버 컴포넌트에서 사용할 함수
export function getAuthCookie() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  
  // 디버깅 추가
  console.log('All available cookies:', cookieStore.getAll());
  console.log('Trying to get access_token:', accessToken);
  
  return accessToken;
}

// 클라이언트 컴포넌트에서 사용할 함수
export async function getAuthToken() {
  try {
    const response = await fetch('/api/auth/token');
    console.log('Response:', response);
    if (!response.ok) return null;
    const data = await response.json();
    console.log('Data:', data);
    return data.token;
  } catch (error) {
    console.error('Error fetching auth token:', error);
    return null;
  }
}