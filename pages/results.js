import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { getStore } from "@/lib/supabase";
import { getResults } from "@/lib/scoring";
import { generatePremiumContent } from "@/lib/premium";
import ShareButton from "@/components/ShareButton";

const sectionLabels = {
  confidence: "Confidence",
  style: "Style & Appearance",
  social: "Social Game",
  communication: "Communication",
  mentality: "Mentality",
  value: "Value",
  sexuality: "Sexual Energy",
};

/* 5-level health system (high = strong) */
function getHealthLevel(score) {
  if (score >= 80) return 5;
  if (score >= 60) return 4;
  if (score >= 40) return 3;
  if (score >= 20) return 2;
  return 1;
}

function getFillPercent(level) {
  return level * 20;
}

const healthLevelMeta = {
  5: { label: "Strong",          badgeClass: "bg-green-500/10 text-green-400",  barColor: "#22C55E" },
  4: { label: "Good",            badgeClass: "bg-green-500/10 text-green-400",  barColor: "#4ADE80" },
  3: { label: "Developing",      badgeClass: "bg-amber-500/10 text-amber-400",  barColor: "#FBBF24" },
  2: { label: "Needs Attention", badgeClass: "bg-orange-500/10 text-orange-400", barColor: "#F97316" },
  1: { label: "Critical",        badgeClass: "bg-red-500/10 text-red-400",      barColor: "#EF4444" },
};

const missionLevelColors = {
  Easy: "bg-green-500/10 text-green-400",
  Medium: "bg-amber-500/10 text-amber-400",
  Deep: "bg-purple-500/10 text-purple-400",
};

export default function Results({ result, premium, error }) {
  const router = useRouter();
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [checkedDays, setCheckedDays] = useState({});
  const [showWeekPlan, setShowWeekPlan] = useState(false);

  const toggleDay = (day) => setCheckedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  const completedCount = Object.values(checkedDays).filter(Boolean).length;

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (error) {
    return (
      <Layout title="Results | BaddieMagnet">
        <div className="flex flex-col items-center text-center pt-12">
          <span className="text-5xl mb-6">⚠️</span>
          <h1 className="font-heading text-2xl font-bold mb-4" style={{ color: "var(--text-100)" }}>Unable to Load Results</h1>
          <p className="mb-8" style={{ color: "var(--text-40)" }}>{error}</p>
          <button
            onClick={() => router.push("/")}
            className="text-pink-400 hover:text-pink-300 underline"
          >
            Start over
          </button>
        </div>
      </Layout>
    );
  }

  const tier = result.tier || {};
  const tierColor = tier.color || "#F97316";
  const globalScore = result.globalScore ?? 50;

  return (
    <Layout title="Your Results | BaddieMagnet">
      <div className="pt-4 pb-12">

        {/* HERO */}
        <div className="text-center mb-10">
          <span className="text-5xl block mb-4">{tier.emoji || result.emoji}</span>
          <h1 className="font-heading text-3xl font-bold mb-2" style={{ color: "var(--text-100)" }}>
            {premium?.hero?.title || tier.title || result.title}
          </h1>

          {/* Global health score gauge */}
          <div className="inline-flex items-center gap-2 rounded-full px-5 py-2 mt-3" style={{ background: "var(--bg-surface)", border: `1px solid ${tierColor}33` }}>
            <span className="text-sm" style={{ color: "var(--text-40)" }}>Baddie Readiness</span>
            <span className="text-2xl font-bold" style={{ color: tierColor }}>{globalScore}</span>
            <span className="text-sm" style={{ color: "var(--text-40)" }}>/100</span>
          </div>

          {/* Weakness indicator */}
          {result.breakupRisk != null && (
            <div className="mt-2">
              <span className="text-xs" style={{ color: "var(--text-40)" }}>
                Weakness Level: <span className="font-bold text-purple-400">{result.breakupRisk}/100</span>
              </span>
            </div>
          )}
        </div>

        {/* One-line diagnosis */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <p className="leading-relaxed" style={{ color: "var(--text-70)" }}>
            {premium?.hero?.oneLineDiagnosis || result.summary}
          </p>

        </div>

        {/* TOP LEVER */}
        {premium?.topLever && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🎯</span>
              <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--text-100)" }}>Your #1 Lever</h2>
            </div>
            <p className="text-pink-400 font-bold text-base mb-2">{premium.topLever.leverName}</p>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-70)" }}>{premium.topLever.why}</p>
            <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}>
              <p className="text-xs mb-1" style={{ color: "var(--text-40)" }}>Recommended action</p>
              <p className="text-sm font-medium" style={{ color: "var(--text-100)" }}>{premium.topLever.bestAction}</p>
            </div>
          </div>
        )}

        {/* ARCHETYPE */}
        {premium?.archetype && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="font-heading text-xl font-semibold mb-2" style={{ color: "var(--text-100)" }}>Your Player Archetype</h2>
            <p className="text-pink-400 font-bold text-lg mb-3">{premium.archetype.name}</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-70)" }}>{premium.archetype.description}</p>
            {tier.reference && (
              <div className="pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                <p className="text-xs mb-3 uppercase tracking-wide" style={{ color: "var(--text-40)" }}>Your energy matches</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{tier.reference.emoji}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-100)" }}>{tier.reference.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-40)" }}>{tier.reference.source}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ASTRO */}
        {premium?.astro && (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "var(--text-100)" }}>Your Astrology</h2>
            <div className="flex justify-center gap-8 mb-4">
              <div className="text-center">
                <span className="text-3xl block mb-1">{premium.astro.userSign.emoji}</span>
                <p className="text-sm font-medium" style={{ color: "var(--text-100)" }}>{premium.astro.userName || "You"}</p>
                <p className="text-xs" style={{ color: "var(--text-40)" }}>{premium.astro.userSign.name}</p>
              </div>
              <div className="flex items-center text-2xl" style={{ color: "var(--text-40)" }}>×</div>
              <div className="text-center">
                <span className="text-3xl block mb-1">{premium.astro.partnerSign.emoji}</span>
                <p className="text-sm font-medium" style={{ color: "var(--text-100)" }}>{premium.astro.partnerName || "Partner"}</p>
                <p className="text-xs" style={{ color: "var(--text-40)" }}>{premium.astro.partnerSign.name}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-70)" }}>{premium.astro.coupleComment}</p>
          </div>
        )}

        {/* BREAKDOWN */}
        <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "var(--text-100)" }}>Your Detailed Breakdown</h2>
        <div className="space-y-4 mb-8">
          {result.insights.map((ins) => {
            const level = getHealthLevel(ins.score);
            const fill = getFillPercent(level);
            const meta = healthLevelMeta[level];
            const enhancement = premium?.cardsEnhancements?.[ins.section];
            return (
              <div
                key={ins.section}
                className="rounded-2xl p-5"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold" style={{ color: "var(--text-100)" }}>
                    {sectionLabels[ins.section] || ins.section}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                    <span className="text-sm font-bold" style={{ color: "var(--text-100)" }}>
                      {ins.score}%
                    </span>
                  </div>
                </div>

                {/* 5-level progress bar */}
                <div className="relative w-full h-2.5 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full animate-fill-bar"
                    style={{
                      "--bar-width": `${fill}%`,
                      background: `linear-gradient(90deg, ${meta.barColor}88 0%, ${meta.barColor} 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex">
                    {[1, 2, 3, 4].map((tick) => (
                      <div
                        key={tick}
                        className="absolute top-0 h-full w-px bg-white/10"
                        style={{ left: `${tick * 20}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between text-[9px] mb-3 px-0.5" style={{ color: "var(--text-40)" }}>
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: "var(--text-70)" }}>
                  {ins.insight}
                </p>
                {enhancement && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--text-100)" }}>{enhancement.shortTip}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-40)" }}>{enhancement.impactHint}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ACTION PLAN */}
        {premium?.actionPlan?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "var(--text-100)" }}>Action Plan</h2>
            <div className="space-y-4">
              {premium.actionPlan.map((plan, i) => (
                <div key={plan.categoryKey} className="rounded-2xl p-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                  <h3 className="font-heading text-base font-semibold mb-4" style={{ color: "var(--text-100)" }}>{plan.category}</h3>

                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--text-40)" }}>Do</p>
                    <div className="space-y-2">
                      {plan.do.map((action, j) => (
                        <div key={j} className="flex gap-2 text-sm">
                          <span className="text-green-400 shrink-0 mt-0.5">✓</span>
                          <span style={{ color: "var(--text-70)" }}>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--text-40)" }}>Avoid</p>
                    <div className="space-y-2">
                      {plan.avoid.map((err, j) => (
                        <div key={j} className="flex gap-2 text-sm">
                          <span className="text-red-400 shrink-0 mt-0.5">✗</span>
                          <span style={{ color: "var(--text-70)" }}>{err}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--text-40)" }}>Script to copy</p>
                    <p className="text-sm italic leading-relaxed mb-2" style={{ color: "var(--text-100)" }}>&ldquo;{plan.copyScript}&rdquo;</p>
                    <button
                      onClick={() => copyToClipboard(plan.copyScript, `plan-${i}`)}
                      className="text-xs text-pink-400 font-medium hover:underline"
                    >
                      {copiedIdx === `plan-${i}` ? "Copied ✓" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MISSIONS */}
        {premium?.missions?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4" style={{ color: "var(--text-100)" }}>Your Missions</h2>
            <div className="space-y-4">
              {premium.missions.map((mission, i) => (
                <div key={i} className="rounded-2xl p-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold" style={{ color: "var(--text-100)" }}>{mission.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${missionLevelColors[mission.level] || ""}`}>
                        {mission.level}
                      </span>
                      <span className="text-xs" style={{ color: "var(--text-40)" }}>{mission.durationMinutes} min</span>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: "var(--text-70)" }}>{mission.goal}</p>
                  <div className="space-y-2 mb-3">
                    {mission.howTo.map((step, j) => (
                      <div key={j} className="flex gap-2 text-sm">
                        <span className="text-pink-400 font-bold shrink-0">{j + 1}.</span>
                        <span style={{ color: "var(--text-70)" }}>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg p-3 mb-2" style={{ background: "rgba(236,72,153,0.06)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--text-40)" }}>Example</p>
                    <p className="text-sm italic" style={{ color: "var(--text-70)" }}>&ldquo;{mission.exampleLine}&rdquo;</p>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-40)" }}>{mission.whyItHelps}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TIP CARD */}
        {globalScore >= 50 ? (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-40)" }}>💡 PRO TIP</p>
            <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: "var(--text-100)" }}>The 2-2-2 Rule</h3>
            <div className="flex justify-around gap-4 my-5">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>2</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>weeks</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>One date night every 2 weeks</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>2</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>months</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>One weekend getaway every 2 months</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>2</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>years</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>One week-long vacation every 2 years</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-70)" }}>
              The simplest rule to level up your game. Break the routine, invest in yourself, stay intentional. Adjust the scale to your life — the principle is what matters.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-6 mb-8" style={{ background: "var(--bg-surface)", border: "1px solid rgba(251,146,60,0.3)" }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-40)" }}>🛟 ONE THING TO TRY</p>
            <h3 className="font-heading text-lg font-semibold mb-1" style={{ color: "var(--text-100)" }}>The 5-5-5 Method</h3>
            <div className="flex justify-around gap-4 my-5">
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>5</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>minutes</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>Talk about your day. No screens. No fixing.</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>5</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>seconds</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>One real hug when you see each other. Hold it.</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-4xl font-extrabold" style={{ color: "var(--text-100)" }}>5</span>
                <span className="text-[11px] uppercase tracking-wider mt-1" style={{ color: "var(--text-40)" }}>words</span>
                <span className="text-sm mt-2 max-w-[140px]" style={{ color: "var(--text-70)" }}>&ldquo;How are you really doing?&rdquo;</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-70)" }}>
              You don&apos;t need to fix everything tonight. Start with 5 minutes of presence. That&apos;s it. Rebuilding starts with one small moment of genuine connection.
            </p>
          </div>
        )}

        {/* POSITIVE TRAJECTORY (healthy couples, no projection) */}
        {!premium?.projection && result.breakupRisk != null && result.breakupRisk <= 14 && (
          <div className="mb-8">
            <div className="rounded-2xl p-6" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🚀</span>
                <h2 className="font-heading text-xl font-semibold" style={{ color: "var(--text-100)" }}>Your Trajectory</h2>
              </div>
              <p className="text-base font-medium text-center mb-3 text-green-400">
                Your game shows strong long-term potential.
              </p>
              <p className="text-sm leading-relaxed text-center" style={{ color: "var(--text-70)" }}>
                Keep investing in yourself. The men who attract baddies aren&apos;t the ones without flaws. They&apos;re the ones who never stop improving.
              </p>
            </div>
          </div>
        )}

        {/* PROJECTION IF NOTHING CHANGES */}
        {premium?.projection && (
          <div className="mb-8">
            <div className="rounded-2xl p-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⏳</span>
                <h2 className="font-heading text-xl font-semibold" style={{ color: "var(--text-100)" }}>Projection if Nothing Changes</h2>
              </div>
              <div className="rounded-xl p-4 mb-4" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                <p className="text-base font-medium text-center" style={{ color: "var(--text-100)" }}>
                  Risk of stagnation in <span className="text-red-400 font-bold">{premium.projection.label}</span>
                </p>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--text-40)" }}>
                  <span>{premium.projection.minDays}d</span>
                  <span>{premium.projection.maxDays}d</span>
                </div>
                <div className="w-full h-2 rounded-full relative" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-red-400 to-red-500 animate-fill-bar"
                    style={{
                      "--bar-width": `${Math.round(((premium.projection.days - premium.projection.minDays) / Math.max(1, premium.projection.maxDays - premium.projection.minDays)) * 100)}%`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 border-2 border-white/20 rounded-full shadow"
                    style={{
                      left: `${Math.round(((premium.projection.days - premium.projection.minDays) / Math.max(1, premium.projection.maxDays - premium.projection.minDays)) * 100)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                </div>
                <p className="text-center text-xs mt-2" style={{ color: "var(--text-40)" }}>
                  ~{premium.projection.days} days based on your current trajectory
                </p>
              </div>
              <p className="text-xs text-center italic" style={{ color: "var(--text-40)" }}>
                This is an estimation, not a certainty. The goal is to help you take action.
              </p>
            </div>

            {/* REDUCE THE RISK */}
            <div className="rounded-2xl p-6 mt-4" style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🛡️</span>
                <h2 className="font-heading text-lg font-semibold" style={{ color: "var(--text-100)" }}>Reduce the Risk</h2>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-70)" }}>
                If you complete 3 missions this week, your risk window could be pushed back.
                Small consistent actions create real momentum.
              </p>
              <button
                onClick={() => setShowWeekPlan((v) => !v)}
                className="btn-gradient w-full py-3 rounded-xl text-white font-semibold text-base transition-colors mb-3"
                aria-expanded={showWeekPlan}
                aria-controls="week-plan"
              >
                {showWeekPlan ? "Hide 7-Day Plan" : "Reduce the Risk. See Your 7-Day Plan"}
              </button>

              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-sm" style={{ color: "var(--text-70)" }}>Missions completed this week:</span>
                <span className={`text-sm font-bold ${completedCount >= 3 ? "text-green-400" : "text-pink-400"}`}>
                  {completedCount}/3
                </span>
              </div>
              {completedCount >= 3 && (
                <div className="rounded-xl p-3 mt-2 mb-2" style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)" }}>
                  <p className="text-green-400 text-sm text-center font-medium">
                    Well done. You have created momentum. Your trajectory is improving.
                  </p>
                </div>
              )}

              {/* 7-Day Plan */}
              {showWeekPlan && premium?.weekPlan && (
                <div id="week-plan" className="space-y-2 mt-4" role="list" aria-label="7-day mission plan">
                  {premium.weekPlan.map((item) => {
                    const checked = !!checkedDays[item.day];
                    return (
                      <label
                        key={item.day}
                        className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors"
                        style={{
                          background: checked ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.04)",
                          borderColor: checked ? "rgba(34,197,94,0.15)" : "var(--border-subtle)",
                        }}
                        role="listitem"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDay(item.day)}
                          className="mt-0.5 h-4 w-4 rounded border-white/20 text-pink-500 focus:ring-pink-500/20 shrink-0"
                          aria-label={`Day ${item.day}: ${item.mission}`}
                        />
                        <div>
                          <span className={`text-xs font-semibold ${checked ? "text-green-400" : "text-pink-400"}`}>
                            Day {item.day}
                          </span>
                          <p className={`text-sm leading-relaxed ${checked ? "line-through" : ""}`} style={{ color: checked ? "var(--text-40)" : "var(--text-70)" }}>
                            {item.mission}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOVE CHECK APP CTA */}
        <div className="mb-8">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.25)" }}>
            <div className="p-6 text-center" style={{ background: "linear-gradient(180deg, rgba(249,115,22,0.15) 0%, rgba(239,68,68,0.15) 100%)" }}>
              <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">We recommend</p>
              <h2 className="font-heading text-2xl font-bold text-white mb-3">
                LoveCheck App
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-2">
                Got a girl? Keep her.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-5">
                Free exclusive app to improve your relationship at any stage. Daily missions, insights, and tools built by the same team.
              </p>

              <a
                href="https://apps.apple.com/fr/app/love-check-app/id6755603323?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full px-5 py-3.5 rounded-xl bg-white font-bold text-base transition-all hover:scale-[1.02]"
                style={{ color: "#EA580C" }}
              >
                Get it free on the App Store
              </a>
            </div>
          </div>
        </div>

        {/* WHAT WE RECOMMEND */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.15)" }}>
          <h2 className="text-lg font-semibold mb-2 text-pink-400">
            What We Recommend
          </h2>
          <p className="leading-relaxed" style={{ color: "var(--text-70)" }}>{result.advice}</p>
        </div>

        {/* SHARE WITH PARTNER */}
        <ShareButton score={result.score} />

        <p className="text-xs text-center" style={{ color: "var(--text-40)" }}>
          This quiz is for entertainment and self-reflection purposes only. It
          is not a substitute for professional coaching or therapy.
        </p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const { session_id } = query;

  if (!session_id) {
    return { props: { error: "No session ID provided.", result: null, premium: null } };
  }

  const store = getStore();
  let session;

  if (store.type === "supabase") {
    const { data, error: dbError } = await store.client
      .from("sessions")
      .select("*")
      .eq("id", session_id)
      .eq("app", "baddiemagnet")
      .single();
    if (dbError || !data) return { props: { error: "Session not found.", result: null, premium: null } };
    session = data;
  } else {
    session = store.data[session_id];
    if (!session) return { props: { error: "Session not found.", result: null, premium: null } };
  }

  // If not marked paid yet, check Stripe directly (webhook may not have fired yet)
  if (!session.paid && session.stripe_session_id) {
    try {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const stripeSession = await stripe.checkout.sessions.retrieve(session.stripe_session_id);
      if (stripeSession.payment_status === "paid") {
        session.paid = true;
        if (store.type === "supabase") {
          await store.client.from("sessions").update({ paid: true }).eq("id", session_id).eq("app", "baddiemagnet");
        } else {
          store.data[session_id].paid = true;
        }
      }
    } catch (e) {
      console.error("Stripe check error:", e.message);
    }
  }

  if (!session.paid) {
    return {
      props: { error: "Payment not completed. Please complete checkout first.", result: null, premium: null },
    };
  }

  const result = getResults(session.answers || {});

  if (!session.score) {
    if (store.type === "supabase") {
      await store.client
        .from("sessions")
        .update({ score: result.score })
        .eq("id", session_id)
        .eq("app", "baddiemagnet");
    } else {
      store.data[session_id].score = result.score;
    }
  }

  const names = session.names || {};
  const premium = generatePremiumContent({
    breakupScore: result.score,
    sectionScores: result.sectionScores,
    userDob: names.userDob || null,
    partnerDob: names.partnerDob || null,
    userName: names.user || null,
    partnerName: names.partner || null,
  });

  return { props: { result, premium, error: null } };
}
