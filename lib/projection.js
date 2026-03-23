/**
 * Deterministic projection: "Time to reach baddie-ready level" estimate.
 */

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

export function stableRandom(seed) {
  let t = hashCode(String(seed)) + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function getRiskWindow(score) {
  // score = breakupScore (0-100, high = more work needed)
  // Return null = already baddie-ready, no projection needed
  if (score <= 14) return null;
  if (score <= 30) return { minDays: 7, maxDays: 30, label: "You're almost there — minor tweaks" };
  if (score <= 45) return { minDays: 30, maxDays: 90, label: "A few months of focused work" };
  if (score <= 55) return { minDays: 90, maxDays: 180, label: "3 to 6 months with consistent effort" };
  if (score <= 65) return { minDays: 180, maxDays: 365, label: "6 to 12 months of serious self-improvement" };
  if (score <= 80) return { minDays: 365, maxDays: 730, label: "1 to 2 years of dedicated growth" };
  return { minDays: 730, maxDays: 1095, label: "A full transformation — but 100% doable" };
}

export function formatDuration(days) {
  if (days <= 7) return `~${days} day${days !== 1 ? "s" : ""}`;
  if (days <= 56) {
    const weeks = Math.round(days / 7);
    return `~${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  if (days <= 730) {
    const months = Math.round(days / 30);
    return `~${months} month${months !== 1 ? "s" : ""}`;
  }
  const years = Math.round(days / 365);
  return `~${years} year${years !== 1 ? "s" : ""}`;
}

export function buildSeed({ userName }) {
  const parts = [
    (userName || "u").toLowerCase().trim(),
  ];
  return parts.join("|");
}

export function getBreakupEstimate(score, seed) {
  const window = getRiskWindow(score);
  if (!window) return null;
  const { minDays, maxDays } = window;
  const r = stableRandom(seed);
  const days = Math.round(minDays + r * (maxDays - minDays));
  const label = formatDuration(days);
  return { days, label, minDays, maxDays };
}

export function get7DayPlan(topTwoKeys) {
  const missionPool = {
    confidence: [
      "Stand in front of a mirror for 2 minutes maintaining eye contact with yourself. No phone.",
      "Walk into a public space and hold eye contact with 3 strangers today. Just a nod, nothing more.",
      "Record yourself talking about something you're passionate about. Watch it back.",
    ],
    style: [
      "Take a photo of your outfit before leaving the house. Would you swipe right on yourself?",
      "Go to a store and try on a style you'd never normally wear. Step out of your comfort zone.",
      "Clean out your closet — remove anything that doesn't make you feel confident.",
    ],
    social: [
      "Start a conversation with someone new today — barista, coworker, stranger. No agenda.",
      "Plan something this weekend and invite people. Be the one who creates the plans.",
      "Go to an event alone. Practice being comfortable solo in social settings.",
    ],
    communication: [
      "Next conversation with a woman, focus on asking questions and actually listening. No performing.",
      "Practice telling a story to a friend — keep it under 2 minutes, make them laugh.",
      "Send a text to someone you've been meaning to reach out to. Be direct, not needy.",
    ],
    mentality: [
      "Write down 3 things you're genuinely proud of. Not for anyone else — for you.",
      "Identify one limiting belief you hold about dating. Write it down, then write the opposite.",
      "Spend 30 minutes on something that grows you — reading, working out, building a skill.",
    ],
    value: [
      "Spend 1 hour today on your most important goal. No distractions.",
      "Write down where you want to be in 1 year. What's the one thing you can do today to move toward it?",
      "Track your screen time today. Replace 30 minutes of scrolling with something productive.",
    ],
    sexuality: [
      "Work out today with intention — feel your body, build physical confidence.",
      "Practice maintaining relaxed, comfortable body language in your next interaction with a woman.",
      "Read or watch something about sexual confidence — understand what creates real tension vs. trying too hard.",
    ],
  };

  const generic = [
    "Go for a 20-minute walk with no headphones. Just think.",
    "Hit the gym or do a bodyweight workout. No excuses.",
    "Delete one dating app distraction and focus on real-life interactions today.",
    "Dress sharp today — even if you're not going anywhere special.",
    "Compliment someone genuinely today. Not to get something — just to practice expressing.",
    "Reflect: what's one thing you did this week that a baddie would find attractive?",
    "End the week by writing down one win and one thing to improve.",
  ];

  const pool = [];
  for (const key of topTwoKeys) {
    if (missionPool[key]) pool.push(...missionPool[key]);
  }
  while (pool.length < 7) {
    const next = generic[pool.length % generic.length];
    if (!pool.includes(next)) pool.push(next);
    else pool.push(generic[(pool.length + 1) % generic.length]);
  }

  return pool.slice(0, 7).map((mission, i) => ({
    day: i + 1,
    mission,
  }));
}
