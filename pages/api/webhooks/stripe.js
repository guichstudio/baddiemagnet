import crypto from "crypto";
import Stripe from "stripe";
import { Resend } from "resend";
import getSupabase from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.metadata?.sessionId;

    if (sessionId) {
      // Idempotency: skip if already processed
      const { data: existing } = await getSupabase()
        .from("sessions")
        .select("paid")
        .eq("id", sessionId)
        .single();
      if (existing?.paid) {
        return res.status(200).json({ received: true });
      }

      const updateData = { paid: true, stripe_session_id: session.id };
      if (session.customer_email) {
        updateData.email = session.customer_email.toLowerCase();
      }
      await getSupabase()
        .from("sessions")
        .update(updateData)
        .eq("id", sessionId);

      // Send confirmation email with magic link to results
      const email = session.customer_email;
      if (email) {
        try {
          const token = crypto.randomBytes(32).toString("hex");
          const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
          await getSupabase().from("magic_links").insert({
            email: email.toLowerCase(),
            token_hash: tokenHash,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });
          const link = `${BASE_URL}/api/verify-magic-link?token=${token}`;
          await resend.emails.send({
            from: "BreakupTime <noreply@lovecheck.us>",
            to: email.toLowerCase(),
            subject: "Your BreakupTime results are ready",
            html: `
              <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
                <h2 style="color:#EC4899;">BreakupTime</h2>
                <p>Thank you for your purchase! Your relationship analysis is ready.</p>
                <p>Click below to view your results anytime:</p>
                <a href="${link}" style="display:inline-block;padding:12px 24px;background:#EC4899;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
                  View My Results
                </a>
                <p style="color:#888;font-size:12px;margin-top:24px;">This link is valid for 7 days. You can always request a new one from the login page.</p>
              </div>
            `,
          });
        } catch (err) {
          console.error("Failed to send confirmation email:", err.message);
        }
      }
    }
  }

  return res.status(200).json({ received: true });
}
