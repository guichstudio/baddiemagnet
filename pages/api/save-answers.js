import { getStore } from "@/lib/supabase";

function sanitizeNames(names) {
  if (!names || typeof names !== "object") return null;
  const clean = {};
  for (const [key, val] of Object.entries(names)) {
    if (typeof val === "string") {
      clean[key] = val.trim().slice(0, 100);
    } else if (val && typeof val === "object") {
      // dob objects { day, month, year }
      const obj = {};
      for (const [k, v] of Object.entries(val)) {
        obj[k] = String(v).trim().slice(0, 10);
      }
      clean[key] = obj;
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId, answers, names } = req.body;
  if (!sessionId || !answers) {
    return res.status(400).json({ error: "Missing sessionId or answers" });
  }

  try {
    const store = getStore();
    const update = { answers };
    if (names) update.names = sanitizeNames(names);

    if (store.type === "supabase") {
      const { error } = await store.client
        .from("sessions")
        .update(update)
        .eq("id", sessionId);
      if (error) return res.status(500).json({ error: "Failed to save answers" });
    } else {
      if (store.data[sessionId]) {
        store.data[sessionId].answers = answers;
        if (names) store.data[sessionId].names = sanitizeNames(names);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("save-answers error:", err.message);
    return res.status(500).json({ error: "Failed to save answers" });
  }
}
