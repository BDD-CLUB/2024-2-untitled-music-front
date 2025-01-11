import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ token: null }, { status: 401 });
  }

  return NextResponse.json({ token: accessToken });
} 