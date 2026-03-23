import crypto from "crypto";
import { getStore } from "@/lib/supabase";
import { setAuthCookie } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { token } = req.query;
  if (!token) return res.redirect("/login?error=invalid_or_expired");

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const store = getStore();

  if (store.type !== "supabase") {
    return res.redirect("/login?error=not_configured");
  }

  // Find unused, non-expired magic link
  const { data: link, error: linkErr } = await store.client
    .from("magic_links")
    .select("id, email")
    .eq("token_hash", tokenHash)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (linkErr || !link) {
    return res.redirect("/login?error=invalid_or_expired");
  }

  // Mark used immediately (single-use)
  await store.client.from("magic_links").update({ used: true }).eq("id", link.id);

  setAuthCookie(res, link.email);

  // Redirect to latest paid session, or checkout if none
  const { data: paidSession } = await store.client
    .from("sessions")
    .select("id")
    .eq("email", link.email)
    .eq("paid", true)
    .eq("app", "baddiemagnet")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (paidSession) {
    return res.redirect(`/results?session_id=${paidSession.id}`);
  }
  return res.redirect("/checkout");
}
