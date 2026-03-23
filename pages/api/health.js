import { getStore } from "@/lib/supabase";

export default async function handler(req, res) {
  const store = getStore();

  if (store.type === "supabase") {
    const { count, error } = await store.client
      .from("sessions")
      .select("id", { count: "exact", head: true });
    if (error) return res.status(500).json({ status: "error", error: error.message });
    return res.status(200).json({ status: "ok", db: "supabase", sessions: count });
  }

  return res.status(200).json({ status: "ok", db: "memory" });
}
