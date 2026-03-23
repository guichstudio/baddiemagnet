import { getStore } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { sessionId, email } = req.body;
  if (!sessionId || !isValidEmail(email)) {
    return res.status(400).json({ error: "Missing or invalid fields" });
  }

  const store = getStore();

  try {
    if (store.type === "supabase") {
      const { data, error: dbErr } = await store.client
        .from("sessions")
        .select("id")
        .eq("id", sessionId)
        .single();
      if (dbErr || !data) return res.status(404).json({ error: "Session not found" });

      await store.client
        .from("sessions")
        .update({ email: email.toLowerCase() })
        .eq("id", sessionId);
    } else {
      const session = store.data[sessionId];
      if (!session) return res.status(404).json({ error: "Session not found" });
      session.email = email.toLowerCase();
    }
  } catch (err) {
    console.error("save-email error:", err.message);
    return res.status(500).json({ error: "Failed to save email" });
  }

  return res.status(200).json({ ok: true });
}
