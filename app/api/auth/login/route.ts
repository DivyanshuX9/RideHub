import { authCookieValue, signAuthToken } from "@/lib/server/auth";
import { verifyLocalPasswordLogin } from "@/lib/server/local-auth-store";
import { rest, supabaseHeaders } from "@/lib/server/supabase";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function badRequest(detail: string) {
  return NextResponse.json({ error: detail }, { status: 400 });
}

function internalError(detail: string) {
  return NextResponse.json({ error: detail }, { status: 500 });
}

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!email || !password) {
    return badRequest("Email and password are required");
  }

  try {
    const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

    if (!hasSupabase) {
      const localUser = await verifyLocalPasswordLogin(email, password);
      if (!localUser) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const token = signAuthToken({
        id: localUser.id,
        name: localUser.name,
        email: localUser.email,
        provider: localUser.provider,
        avatarUrl: localUser.avatarUrl,
      });

      const response = NextResponse.json(
        {
          token,
          user: {
            id: localUser.id,
            name: localUser.name,
            email: localUser.email,
            avatarUrl: localUser.avatarUrl,
            provider: localUser.provider,
          },
        },
        { status: 200 }
      );
      response.headers.append("Set-Cookie", authCookieValue(token));
      return response;
    }

    const res = await fetch(
      `${rest("users")}?username=eq.${encodeURIComponent(email)}&select=id,username,password_hash`,
      {
        headers: supabaseHeaders(),
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return internalError("Database error");
    }

    const rows = (await res.json()) as Array<{ id: string; username: string; password_hash: string }>;
    const userRow = rows[0];
    if (!userRow) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, userRow.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const name = userRow.username.split("@")[0] || "RideHub User";
    const token = signAuthToken({
      id: String(userRow.id),
      name,
      email: userRow.username,
      provider: "password",
      avatarUrl: null,
    });

    const response = NextResponse.json(
      {
        token,
        user: {
          id: String(userRow.id),
          name,
          email: userRow.username,
          avatarUrl: null,
          provider: "password",
        },
      },
      { status: 200 }
    );
    response.headers.append("Set-Cookie", authCookieValue(token));
    return response;
  } catch {
    return internalError("Unexpected login failure");
  }
}
