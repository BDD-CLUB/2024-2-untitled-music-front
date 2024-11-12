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