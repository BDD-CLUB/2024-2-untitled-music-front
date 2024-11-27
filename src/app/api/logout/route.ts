import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "Logged out successfully" },
    {
      headers: {
        "Set-Cookie": "access_token=; Max-Age=0; Path=/; HttpOnly",
      },
    }
  );
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");

  return NextResponse.json({
    token: token?.value || null,
  });
}
