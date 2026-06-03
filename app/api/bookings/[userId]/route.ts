import { getAuthUserFromRequest } from "@/lib/server/auth";
import { rest, supabaseHeaders } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    const authUser = getAuthUserFromRequest(request);
    const { userId } = await context.params;

    if (userId !== authUser.id) {
      return NextResponse.json({ error: "Cannot access another user's bookings" }, { status: 403 });
    }

    const res = await fetch(`${rest("bookings")}?user_id=eq.${encodeURIComponent(userId)}&order=id.desc`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }

    const bookings = await res.json();
    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Unexpected booking failure" }, { status: 500 });
  }
}
