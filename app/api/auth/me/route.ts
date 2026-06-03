import { getAuthUserFromRequest } from "@/lib/server/auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUserFromRequest(request);
    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
