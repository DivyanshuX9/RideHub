import "server-only";

import bcrypt from "bcryptjs";

export interface LocalAuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string | null;
  provider: "password" | "google";
}

const usersByEmail = new Map<string, LocalAuthUser>();

export async function createLocalUser(input: {
  name: string;
  email: string;
  password: string;
  provider?: "password" | "google";
  avatarUrl?: string | null;
}) {
  const email = input.email.trim().toLowerCase();
  const existing = usersByEmail.get(email);
  if (existing) {
    return null;
  }

  const user: LocalAuthUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash: await bcrypt.hash(input.password, 10),
    avatarUrl: input.avatarUrl ?? null,
    provider: input.provider ?? "password",
  };

  usersByEmail.set(email, user);
  return user;
}

export function findLocalUserByEmail(email: string) {
  return usersByEmail.get(email.trim().toLowerCase()) ?? null;
}

export async function verifyLocalPasswordLogin(email: string, password: string) {
  const user = findLocalUserByEmail(email);
  if (!user || user.provider !== "password") {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}
