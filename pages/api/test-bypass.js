// DEV ONLY: marks a session as paid for testing
import { getStore } from "@/lib/supabase";

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).end();
  }

  const { sessionId } = req.query;
  if (!sessionId) return res.status(400).json({ error: "sessionId required" });

  const store = getStore();
  if (store.type === "supabase") {
    await store.client.from("sessions").update({ paid: true }).eq("id", sessionId).eq("app", "baddiemagnet");
  } else {
    if (store.data[sessionId]) store.data[sessionId].paid = true;
  }

  res.redirect(`/results?session_id=${sessionId}`);
}
