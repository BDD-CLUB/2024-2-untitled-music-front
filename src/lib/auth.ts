import { cookies } from 'next/headers';

export function getAuthCookie() {
  const cookieStore = cookies();

  console.log(cookieStore.getAll());
  console.log(cookieStore.get('access_token'));
  return cookieStore.get('access_token');
} 