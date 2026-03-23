// DEV ONLY: creates a paid session with preset answers for previewing results
import { randomUUID } from "crypto";
import { getStore } from "@/lib/supabase";

// "Bad couple" answers — high values = unhealthy (direction positive, inverted in scoring)
const badAnswers = {
  1: { value: 4 },   // Married (context)
  2: { value: 5 },   // 5+ years (context)
  // Communication (Q3-8) — all bad
  3: { value: 5 },
  4: { value: 5 },
  5: { value: 5 },
  6: { value: 5 },
  7: { value: 5 },
  8: { value: 5 },
  // Trust (Q9-14) — all bad
  9: { value: 5 },
  10: { value: 5 },
  11: { value: 5 },
  12: { value: 5 },
  13: { value: 5 },
  14: { value: 5 },
  // Intimacy (Q15-20) — all bad
  15: { value: 5 },
  16: { value: 5 },
  17: { value: 5 },
  18: { value: 5 },
  19: { value: 5 },
  20: { value: 5 },
  // Desire (Q21-26) — all bad
  21: { value: 5 },
  22: { value: 5 },
  23: { value: 5 },
  24: { value: 5 },
  25: { value: 5 },
  26: { value: 5 },
  // Conflict (Q27-32) — all bad
  27: { value: 5 },
  28: { value: 5 },
  29: { value: 5 },
  30: { value: 5 },
  31: { value: 5 },
  32: { value: 5 },
  // Safety (Q33-38) — all bad
  33: { value: 5 },
  34: { value: 5 },
  35: { value: 5 },
  36: { value: 5 },
  37: { value: 5 },
  38: { value: 5 },
  // Vision (Q39-44) — all bad
  39: { value: 5 },
  40: { value: 5 },
  41: { value: 5 },
  42: { value: 5 },
  43: { value: 5 },
  44: { value: 5 },
};

export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).end();
  }

  const sessionId = randomUUID();
  const store = getStore();

  const session = {
    id: sessionId,
    answers: badAnswers,
    paid: true,
    score: null,
    stripe_session_id: null,
    name1: "Alex",
    name2: "Jordan",
    dob1: "1990-03-15",
    dob2: "1992-07-22",
  };

  if (store.type === "supabase") {
    const { error } = await store.client.from("sessions").insert(session);
    if (error) return res.status(500).json({ error: "Failed to create session", details: error.message });
  } else {
    store.data[sessionId] = session;
  }

  res.redirect(`/results?session_id=${sessionId}`);
}
