import { getAuthUserFromRequest } from "@/lib/server/auth";
import { rest, supabaseHeaders } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function badRequest(detail: string) {
  return NextResponse.json({ error: detail }, { status: 400 });
}

function internalError(detail: string) {
  return NextResponse.json({ error: detail }, { status: 500 });
}

export async function POST(request: NextRequest) {
  let body: {
    user_id?: string;
    from_location?: string;
    to_location?: string;
    service?: string;
    ride_type?: string;
    price?: number;
    distance?: number;
    duration?: number;
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  try {
    const authUser = getAuthUserFromRequest(request);
    if (body.user_id !== authUser.id) {
      return NextResponse.json({ error: "Cannot create booking for another user" }, { status: 403 });
    }

    if (!body.from_location || !body.to_location || !body.service || !body.ride_type) {
      return badRequest("Missing booking fields");
    }

    const payload = {
      id: crypto.randomUUID(),
      user_id: authUser.id,
      from_location: body.from_location,
      to_location: body.to_location,
      service: body.service,
      ride_type: body.ride_type,
      price: body.price ?? 0,
      distance: body.distance ?? 0,
      duration: body.duration ?? 0,
      status: body.status ?? "scheduled",
    };

    const res = await fetch(rest("bookings"), {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return internalError("Failed to create booking");
    }

    const created = await res.json();
    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Missing auth token") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return internalError("Unexpected booking failure");
  }
}
