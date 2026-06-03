import { authCookieValue, signAuthToken } from "@/lib/server/auth";
import { createLocalUser } from "@/lib/server/local-auth-store";
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
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!name || !email || !password) {
    return badRequest("Name, email, and password are required");
  }

  if (!email.includes("@")) {
    return badRequest("Enter a valid email address");
  }

  try {
    const hasSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);

    if (!hasSupabase) {
      const created = await createLocalUser({ name, email, password, provider: "password" });
      if (!created) {
        return NextResponse.json({ error: "Email already taken" }, { status: 409 });
      }

      const token = signAuthToken({
        id: created.id,
        name: created.name,
        email: created.email,
        provider: created.provider,
        avatarUrl: created.avatarUrl,
      });

      const response = NextResponse.json(
        {
          token,
          user: {
            id: created.id,
            name: created.name,
            email: created.email,
            avatarUrl: created.avatarUrl,
            provider: created.provider,
          },
        },
        { status: 201 }
      );
      response.headers.append("Set-Cookie", authCookieValue(token));
      return response;
    }

    const existing = await fetch(`${rest("users")}?username=eq.${encodeURIComponent(email)}&select=id`, {
      headers: supabaseHeaders(),
      cache: "no-store",
    });

    if (!existing.ok) {
      return internalError("Database error");
    }

    const rows = (await existing.json()) as Array<{ id: string }>;
    if (rows.length > 0) {
      return NextResponse.json({ error: "Email already taken" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const createRes = await fetch(rest("users"), {
      method: "POST",
      headers: supabaseHeaders(),
      body: JSON.stringify({ username: email, password_hash: passwordHash }),
      cache: "no-store",
    });

    if (!createRes.ok) {
      return internalError("Failed to create user");
    }

    const created = (await createRes.json()) as Array<{ id: string; username: string }>;
    const userRow = created[0];
    if (!userRow) {
      return internalError("Failed to create user");
    }

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
      { status: 201 }
    );
    response.headers.append("Set-Cookie", authCookieValue(token));
    return response;
  } catch {
    return internalError("Unexpected signup failure");
  }
}
