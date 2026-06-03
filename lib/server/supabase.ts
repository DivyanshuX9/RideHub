import "server-only";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

function requireSupabaseConfig() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  }
}

function getSupabaseUrl() {
  requireSupabaseConfig();
  return supabaseUrl as string;
}

function getSupabaseServiceKey() {
  requireSupabaseConfig();
  return supabaseServiceKey as string;
}

export function supabaseHeaders() {
  const serviceKey = getSupabaseServiceKey();
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export function rest(path: string) {
  return `${getSupabaseUrl()}/rest/v1/${path}`;
}
