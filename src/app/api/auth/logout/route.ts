import { serverLogout } from "@/lib/server-auth";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await serverLogout();
    
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
} 