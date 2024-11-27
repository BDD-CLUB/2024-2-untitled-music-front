import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token");
  
    return NextResponse.json({
      token: token?.value || null,
    });
  }
  