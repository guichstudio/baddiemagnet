import { randomUUID } from "crypto";
import { getStore } from "@/lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const sessionId = randomUUID();
  const store = getStore();

  if (store.type === "supabase") {
    const { error } = await store.client.from("sessions").insert({
      id: sessionId,
      answers: {},
      paid: false,
      app: "baddiemagnet",
    });
    if (error) return res.status(500).json({ error: "Failed to create session" });
  } else {
    store.data[sessionId] = { id: sessionId, answers: {}, paid: false, score: null, stripe_session_id: null, app: "baddiemagnet" };
  }

  return res.status(200).json({ sessionId });
}
