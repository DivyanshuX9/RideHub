import "server-only";

import crypto from "node:crypto";

const jwtSecret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === "production" ? undefined : "ridehub-dev-secret");

function requireJwtSecret() {
  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET");
  }
}

function getJwtSecret() {
  requireJwtSecret();
  return jwtSecret as string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  provider?: "password" | "google";
}

interface TokenPayload extends AuthUser {
  iat: number;
  exp: number;
}

function base64UrlEncode(value: Buffer | string) {
  const buffer = typeof value === "string" ? Buffer.from(value, "utf8") : value;
  return buffer.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

export function signAuthToken(user: AuthUser) {
  const secret = getJwtSecret();
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload: TokenPayload = {
    ...user,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest();
  return `${unsigned}.${base64UrlEncode(signature)}`;
}

export function verifyAuthToken(token: string): AuthUser {
  const secret = getJwtSecret();
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token");
  }

  const [header, payload, signature] = parts;
  const unsigned = `${header}.${payload}`;
  const expected = crypto.createHmac("sha256", secret).update(unsigned).digest();
  const actual = Buffer.from(signature.replace(/-/g, "+").replace(/_/g, "/"), "base64");

  if (expected.length !== actual.length || !crypto.timingSafeEqual(new Uint8Array(expected), new Uint8Array(actual))) {
    throw new Error("Invalid token");
  }

  const decoded = JSON.parse(base64UrlDecode(payload)) as TokenPayload;
  if (!decoded.exp || decoded.exp * 1000 < Date.now()) {
    throw new Error("Token expired");
  }

  return {
    id: decoded.id,
    name: decoded.name,
    email: decoded.email,
    avatarUrl: decoded.avatarUrl ?? null,
    provider: decoded.provider,
  };
}

export function getAuthTokenFromRequest(request: Request) {
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|; )ridehub_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function getAuthUserFromRequest(request: Request) {
  const token = getAuthTokenFromRequest(request);
  if (!token) {
    throw new Error("Missing auth token");
  }
  return verifyAuthToken(token);
}

export function authCookieValue(token: string) {
  return `ridehub_token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}
