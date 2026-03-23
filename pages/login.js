import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";

const ERROR_MESSAGES = {
  invalid_or_expired: "Link expired or invalid. Try again.",
  not_configured: "Authentication is not configured.",
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const queryError = router.query.error;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Layout title="Check Your Inbox | BreakupTime">
        <div className="flex flex-col items-center text-center pt-16">
          <span className="text-5xl mb-6">📬</span>
          <h1 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--text-100)" }}>
            Check your inbox
          </h1>
          <p className="mb-2" style={{ color: "var(--text-70)" }}>
            We sent a login link to <strong>{email}</strong>.
          </p>
          <p className="text-sm" style={{ color: "var(--text-40)" }}>
            The link expires in 15 minutes.<br />(check your spams)
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Log In | BreakupTime">
      <div className="flex flex-col items-center text-center pt-16">
        <span className="text-5xl mb-6">🔑</span>
        <h1 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--text-100)" }}>
          Access your results
        </h1>
        <p className="mb-8" style={{ color: "var(--text-40)" }}>
          Enter the email you used during checkout and we&apos;ll send you a magic link.
        </p>

        {(error || queryError) && (
          <div className="w-full rounded-xl p-3 mb-4 text-sm text-red-400" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {error || ERROR_MESSAGES[queryError] || "Something went wrong."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-xl mb-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-gradient disabled:opacity-50 w-full text-white font-semibold text-base px-8 py-3 rounded-xl transition-colors"
          >
            {loading ? "Sending..." : "Send me a link"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
