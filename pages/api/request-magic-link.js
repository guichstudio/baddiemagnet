import crypto from "crypto";
import { Resend } from "resend";
import { getStore } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validate";

const resend = new Resend(process.env.RESEND_API_KEY);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  const normalizedEmail = email.toLowerCase();
  const store = getStore();

  // Rate limit: max 3 per email per 15 min
  if (store.type === "supabase") {
    const fifteenAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { count } = await store.client
      .from("magic_links")
      .select("id", { count: "exact", head: true })
      .eq("email", normalizedEmail)
      .gte("created_at", fifteenAgo);
    if (count >= 3) {
      return res.status(200).json({ ok: true }); // silent — no enumeration
    }
  }

  // Generate token: 32 random bytes, store only the SHA-256 hash
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  if (store.type === "supabase") {
    await store.client.from("magic_links").insert({
      email: normalizedEmail,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
  }

  const link = `${BASE_URL}/api/verify-magic-link?token=${token}`;
  try {
    await resend.emails.send({
      from: "BreakupTime <noreply@lovecheck.us>",
      to: normalizedEmail,
      subject: "Your BreakupTime login link",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#EC4899;">BreakupTime</h2>
          <p>Click the link below to access your results:</p>
          <a href="${link}" style="display:inline-block;padding:12px 24px;background:#EC4899;color:white;text-decoration:none;border-radius:8px;font-weight:bold;">
            View My Results
          </a>
          <p style="color:#888;font-size:12px;margin-top:24px;">This link expires in 15 minutes and can only be used once.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send magic link email:", err.message);
  }

  return res.status(200).json({ ok: true });
}
