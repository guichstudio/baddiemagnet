import { randomUUID } from "crypto";
import Stripe from "stripe";
import { getStore } from "@/lib/supabase";

const stripeConfigured =
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY !== "your_stripe_secret_key";

const stripe = stripeConfigured ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    let { sessionId, email, answers, names } = req.body;
    const store = getStore();
    let session;

    // Ensure we have a valid session in the DB
    if (sessionId && store.type === "supabase") {
      const { data } = await store.client
        .from("sessions")
        .select("id, paid")
        .eq("id", sessionId)
        .eq("app", "baddiemagnet")
        .single();
      session = data;
    } else if (sessionId && store.type === "memory") {
      session = store.data[sessionId];
    }

    // Create session if missing or not found in DB
    if (!session) {
      sessionId = sessionId || randomUUID();
      const row = { id: sessionId, answers: answers || {}, paid: false, app: "baddiemagnet" };
      if (names) row.names = names;
      if (email) row.email = email.toLowerCase();

      if (store.type === "supabase") {
        const { error: insertErr } = await store.client.from("sessions").insert(row);
        if (insertErr) {
          console.error("create-checkout insert error:", insertErr);
          return res.status(500).json({ error: "Failed to create session" });
        }
      } else {
        store.data[sessionId] = { ...row, score: null, stripe_session_id: null, app: "baddiemagnet" };
      }
      session = { id: sessionId, paid: false };
    } else {
      // Session exists — update answers if provided (in case they were never saved)
      const update = {};
      if (answers && Object.keys(answers).length > 0) update.answers = answers;
      if (names) update.names = names;
      if (email) update.email = email.toLowerCase();

      if (Object.keys(update).length > 0) {
        if (store.type === "supabase") {
          await store.client.from("sessions").update(update).eq("id", sessionId).eq("app", "baddiemagnet");
        } else {
          Object.assign(store.data[sessionId], update);
        }
      }
    }

    if (session.paid) {
      return res.status(200).json({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}`,
      });
    }

    // Dev mode: skip Stripe, mark as paid directly
    if (!stripe) {
      if (store.type === "memory") store.data[sessionId].paid = true;
      return res.status(200).json({
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}`,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "BaddieMagnet — Baddie Readiness Report",
              description: "Your personalized baddie-readiness score and detailed analysis with action plan",
            },
            unit_amount: 499,
          },
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      metadata: { sessionId },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/results?session_id=${sessionId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    });

    if (store.type === "supabase") {
      await store.client
        .from("sessions")
        .update({ stripe_session_id: checkoutSession.id })
        .eq("id", sessionId)
        .eq("app", "baddiemagnet");
    }

    return res.status(200).json({ url: checkoutSession.url });
  } catch (err) {
    console.error("create-checkout error:", err);
    return res.status(500).json({ error: err.message });
  }
}
