import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  
  // 디버깅용 로그
  console.log('Checking cookies:', {
    hasAccessToken: !!accessToken,
    cookieNames: cookieStore.getAll().map(c => c.name)
  });

  return NextResponse.json({
    isAuthenticated: !!accessToken,
    accessToken: accessToken || null
  });
}