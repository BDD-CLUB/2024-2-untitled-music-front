// 클라이언트 컴포넌트에서만 사용
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