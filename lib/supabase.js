import { createClient } from "@supabase/supabase-js";

let _supabase;

const isConfigured =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_URL !== "your_supabase_url" &&
  process.env.SUPABASE_SERVICE_KEY &&
  process.env.SUPABASE_SERVICE_KEY !== "your_supabase_service_role_key";

function getSupabase() {
  if (!isConfigured) return null;
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return _supabase;
}

// In-memory store for local dev when Supabase isn't configured
const memStore = {};

export function getStore() {
  const sb = getSupabase();
  if (sb) return { type: "supabase", client: sb };
  return { type: "memory", data: memStore };
}

export default getSupabase;
