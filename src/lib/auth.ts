// 클라이언트 컴포넌트에서만 사용
export async function checkAuth() {
  try {
    const response = await fetch('/api/auth/token');
    if (!response.ok) return { isAuthenticated: false, accessToken: null };
    return response.json();
  } catch (error) {
    console.error('Error checking auth:', error);
    return { isAuthenticated: false, accessToken: null };
  }
}

// API 요청을 위한 헤더 생성 헬퍼 함수
export function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}