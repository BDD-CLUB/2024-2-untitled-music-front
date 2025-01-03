import { cookies } from 'next/headers';

export function getAccessToken() {
  const cookieStore = cookies();
  return cookieStore.get('access_token')?.value;
}

export function getProfileUUID() {
  const cookieStore = cookies();
  return cookieStore.get('profile')?.value;
}