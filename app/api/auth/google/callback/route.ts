import { authCookieValue, signAuthToken } from "@/lib/server/auth";
import { rest, supabaseHeaders } from "@/lib/server/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function fail(origin: string) {
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin;
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");
  const stateCookie = request.cookies.get("ridehub_oauth_state")?.value ?? null;

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=oauth_denied`);
  }

  if (!code || !state || !stateCookie || state !== stateCookie) {
    return fail(origin);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return fail(origin);
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return fail(origin);
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string };
    if (!tokenData.access_token) {
      return fail(origin);
    }

    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    });

    if (!profileResponse.ok) {
      return fail(origin);
    }

    const profile = (await profileResponse.json()) as {
      email?: string;
      name?: string;
      picture?: string;
    };

    const email = profile.email?.trim().toLowerCase();
    if (!email) {
      return fail(origin);
    }

    const name = profile.name?.trim() || email.split("@")[0] || "RideHub User";
    const avatarUrl = profile.picture ?? null;

    const existing = await fetch(`${rest("users")}?username=eq.${encodeURIComponent(email)}&select=id,username`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!existing.ok) {
      return fail(origin);
    }

    const rows = (await existing.json()) as Array<{ id: string; username: string }>;
    let userRow = rows[0];

    if (!userRow) {
      const createRes = await fetch(rest("users"), {
        method: "POST",
        headers: supabaseHeaders(),
        body: JSON.stringify({ username: email, password_hash: crypto.randomUUID() }),
        cache: "no-store",
      });

      if (!createRes.ok) {
        return fail(origin);
      }

      const created = (await createRes.json()) as Array<{ id: string; username: string }>;
      userRow = created[0];
    }

    if (!userRow) {
      return fail(origin);
    }

    const token = signAuthToken({
      id: String(userRow.id),
      name,
      email: userRow.username,
      avatarUrl,
      provider: "google",
    });

    const response = NextResponse.redirect(`${origin}/profile`);
    response.headers.append("Set-Cookie", authCookieValue(token));
    response.headers.append("Set-Cookie", "ridehub_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
    return response;
  } catch {
    return fail(origin);
  }
}
