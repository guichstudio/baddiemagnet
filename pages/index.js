import Head from "next/head";
import Link from "next/link";

function FireIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-3.527 2.397-5.236 3.5-6.5.276-.317.5-.725.5-1.5 0 0 1.5 1 2 3 .586-.586 1-2 1-3 3 1 5 4 5 7 0 .828-.247 1.578-.5 2-.378.633-1 1-1 1s.5-1 0-2.5c-.5-1.5-1.5-2-1.5-2s0 1.5-1 2.5c-.5.5-1 1.5-1 2.5 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1-.5-2-1-3 0 0-.5 2-2 2 1-1 1-3.5 0-5 0 1.5-1 2-2 2 0 0 1-1.5 0-3-.667 1-2 2-2 4 0 3.866 3.134 7 7 7z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>BaddieMagnet | Are You Ready For a Baddie?</title>
        <meta
          name="description"
          content="Find out if you have what it takes to attract high-value women."
        />
        <meta property="og:title" content="BaddieMagnet | Are You Ready For a Baddie?" />
        <meta property="og:description" content="Find out if you have what it takes to attract high-value women." />
        <meta property="og:image" content="" />
        <meta property="og:url" content="" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BaddieMagnet | Are You Ready For a Baddie?" />
        <meta name="twitter:description" content="Find out if you have what it takes to attract high-value women." />
        <meta name="twitter:image" content="" />
      </Head>

      <div className="h-screen font-body relative overflow-hidden" style={{ color: "var(--text-100)" }}>

        {/* ── HEADER ── */}
        <header className="px-6 pt-5 pb-2 flex items-center justify-between max-w-[600px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #9333EA 0%, #F97316 100%)" }}>
              <FireIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm tracking-tight" style={{ color: "var(--text-70)" }}>powered by <em className="font-semibold" style={{ color: "var(--text-100)" }}>BaddieMagnet</em></span>
          </div>
          <Link href="/login" className="text-sm" style={{ color: "var(--text-40)" }}>Log In</Link>
        </header>

        {/* ── HERO ── */}
        <main className="max-w-[600px] mx-auto px-6">
          <section className="flex flex-col items-center text-center pt-16 pb-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-10" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #7C3AED, #9333EA)" }} />
                <div className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #F97316, #EF4444)" }} />
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--text-70)" }}>1.2M+ Tests Taken</span>
            </div>

            {/* Title */}
            <h1 className="font-heading font-extrabold text-[44px] lg:text-[52px] leading-[1.05] tracking-tight mb-6">
              Do you have what it takes<br />
              <span style={{
                background: "linear-gradient(90deg, #E8E0F0 0%, #9333EA 35%, #F97316 65%, #EF4444 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                to pull a baddie?
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base leading-[1.6] max-w-[340px] mb-16" style={{ color: "var(--text-40)" }}>
              44 questions. Brutally honest. Find out where you really stand.
            </p>

            {/* Feature card */}
            <div className="w-full rounded-2xl p-4 flex items-center gap-4 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-70)" }}>
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: "var(--text-100)" }}>Baddie Readiness Score</p>
                <p className="text-xs" style={{ color: "var(--text-40)" }}>Unlock your dating game potential</p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/quiz"
              className="w-full h-14 flex items-center justify-center rounded-2xl text-white font-bold text-base mb-4"
              style={{
                background: "linear-gradient(90deg, #9333EA 0%, #F97316 40%, #EF4444 100%)",
                boxShadow: "0 4px 24px rgba(147,51,234,0.25)",
              }}
            >
              Take The Test
            </Link>

            {/* Trust line */}
            <p className="text-xs" style={{ color: "var(--text-40)" }}>
              100% Private &amp; Secure Analysis
            </p>

          </section>

          {/* Education link */}
          <div className="text-center pb-8">
            <Link href="/education" className="text-xs underline" style={{ color: "var(--text-40)" }}>
              Dating Tips, Style Guides &amp; More
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
