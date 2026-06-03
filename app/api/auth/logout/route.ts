import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.headers.append("Set-Cookie", "ridehub_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
  return response;
}
