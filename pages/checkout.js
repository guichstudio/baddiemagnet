import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import questions from "@/lib/questions";
import { isValidEmail } from "@/lib/validate";

const features = [
  "Overall baddie-readiness score (0 to 100)",
  "Personalized game assessment",
  "7 detailed insights across confidence, style, social, communication, mentality, value, and sexuality",
  "Actionable 7-day improvement plan",
];

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("bm_session");
    if (!stored) { router.replace("/"); return; }
    const data = JSON.parse(stored);
    if (Object.keys(data.answers || {}).length < questions.length) {
      router.replace("/quiz");
      return;
    }
    setSessionData(data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateEmail = () => {
    if (!email || !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSendLink = async () => {
    if (!validateEmail()) return;
    setSendingLink(true);
    try {
      await fetch("/api/save-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sessionData.sessionId, email }),
      });
      await fetch("/api/request-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setLinkSent(true);
    } finally {
      setSendingLink(false);
    }
  };

  const handleCheckout = async () => {
    if (!sessionData) return;
    if (!validateEmail()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionData.sessionId || null,
          email,
          answers: sessionData.answers || {},
          names: sessionData.names || null,
        }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => "");
        setLoading(false);
        alert(`Server error (${res.status}): ${text.slice(0, 200) || "No response body"}`);
        return;
      }
      if (!res.ok || !data.url) {
        setLoading(false);
        alert(data.error || "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setLoading(false);
      alert("Network error: " + err.message);
    }
  };

  if (!sessionData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Your Results Are Ready | BaddieMagnet">
      <div className="flex flex-col items-center text-center pt-8">
        <span className="text-5xl mb-6">🔒</span>
        <h1 className="font-heading text-3xl font-bold mb-4" style={{ color: "var(--text-100)" }}>Your Results Are Ready</h1>
        <p className="mb-2" style={{ color: "var(--text-40)" }}>
          You answered all {questions.length} questions.
        </p>
        <p className="mb-8" style={{ color: "var(--text-40)" }}>
          Unlock your personalized baddie-readiness score and detailed analysis.
        </p>

        <div className="w-full rounded-2xl p-8 mb-8 text-left space-y-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--text-100)" }}>What you&apos;ll get:</h3>
          {features.map((f) => (
            <div key={f} className="flex items-start gap-3">
              <span className="text-purple-400">✓</span>
              <span style={{ color: "var(--text-70)" }}>{f}</span>
            </div>
          ))}
        </div>

        <div className="w-full mb-6">
          <label className="block text-left text-sm font-medium mb-2" style={{ color: "var(--text-70)" }}>
            Your email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailError(""); setLinkSent(false); }}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
          />
          {emailError && <p className="text-red-400 text-sm mt-1 text-left">{emailError}</p>}
        </div>

        <p className="text-sm mb-4 flex items-center justify-center gap-2 font-medium" style={{ color: "var(--text-70)" }}>
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          2,166 men discovered their score this week
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="btn-gradient disabled:opacity-50 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors w-full"
        >
          {loading ? "Redirecting to payment..." : "Unlock My Baddie Report — $4.99"}
        </button>

        <p className="text-xs mt-4 mb-4" style={{ color: "var(--text-40)" }}>
          One-time payment. Secure checkout via Stripe.
        </p>

        {linkSent ? (
          <p className="text-sm text-green-400 font-medium text-center">Link sent! Check your inbox.<br /><span style={{ color: "var(--text-40)" }}>(check your spams)</span></p>
        ) : (
          <button
            onClick={handleSendLink}
            disabled={sendingLink}
            className="disabled:opacity-50 w-full text-purple-400 font-semibold text-sm py-3 rounded-xl transition-colors"
            style={{ border: "1px solid rgba(147,51,234,0.3)" }}
          >
            {sendingLink ? "Sending..." : "Send me a link to pay later"}
          </button>
        )}

        <button
          onClick={() => { localStorage.removeItem("bm_session"); router.push("/"); }}
          className="mt-6 text-xs underline"
          style={{ color: "var(--text-40)" }}
        >
          Retake the quiz
        </button>
      </div>
    </Layout>
  );
}
