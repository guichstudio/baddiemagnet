import { getStore } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const store = getStore();
    if (store.type === "supabase") {
      await store.client.from("early_access").upsert(
        { email: email.toLowerCase() },
        { onConflict: "email" }
      );
    }
  } catch (err) {
    console.error("save-early-access error:", err.message);
    return res.status(500).json({ error: "Failed to save" });
  }

  return res.status(200).json({ ok: true });
}
