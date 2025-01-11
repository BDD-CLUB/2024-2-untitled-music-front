import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 쿠키 스토어에서 모든 쿠키 가져오기
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    console.log('Available cookies:', allCookies.map(c => c.name));

    // access_token 찾기
    const accessToken = cookieStore.get('access_token')?.value;
    console.log('Found access_token:', accessToken ? 'exists' : 'not found');

    if (!accessToken) {
      return NextResponse.json(
        { 
          token: null,
          debug: {
            availableCookies: allCookies.map(c => c.name)
          }
        }, 
        { status: 401 }
      );
    }

    return NextResponse.json({ token: accessToken });
  } catch (error) {
    console.error('Error in token route:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}