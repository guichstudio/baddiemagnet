import questions, { sections } from "./questions";

const dimensionKeys = Object.values(sections);

// ── Step A: 7-dimension scores (0-100, high = strong) with cross-dimension ──

export function getSectionScores(answers) {
  const sectionMap = {};
  for (const key of dimensionKeys) {
    sectionMap[key] = { weightedSum: 0, maxPossible: 0 };
  }

  // Primary dimension scoring (skip context questions)
  for (const q of questions) {
    if (q.section === "context") continue;
    const answer = answers[q.id];
    if (answer === undefined) continue;
    sectionMap[q.section].weightedSum += answer.value * q.weight;
    sectionMap[q.section].maxPossible += 5 * q.weight;

    // Cross-dimension contributions
    if (q.cross) {
      for (const [dim, weight] of Object.entries(q.cross)) {
        if (sectionMap[dim]) {
          sectionMap[dim].weightedSum += answer.value * q.weight * weight;
          sectionMap[dim].maxPossible += 5 * q.weight * weight;
        }
      }
    }
  }

  const result = {};
  for (const [key, val] of Object.entries(sectionMap)) {
    const rawRisk = val.maxPossible
      ? Math.round((val.weightedSum / val.maxPossible) * 100)
      : 0;
    result[key] = 100 - rawRisk; // invert: high = strong
  }
  return result;
}

// ── Global score (average of all dimensions, 0-100, high = strong) ──

export function getGlobalScore(sectionScores) {
  const vals = Object.values(sectionScores);
  if (vals.length === 0) return 50;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

// ── Step B: Framework analyzers ──

const frameworkWeights = {
  social_psychology: 0.15,
  confidence_theory: 0.20,
  attraction_science: 0.15,
  lifestyle_design: 0.10,
  communication_skills: 0.15,
  masculinity: 0.15,
  sexual_polarity: 0.10,
};

export function getFrameworkScores(answers) {
  const fw = {};
  for (const key of Object.keys(frameworkWeights)) {
    fw[key] = { weightedSum: 0, maxPossible: 0 };
  }

  for (const q of questions) {
    if (q.section === "context") continue;
    const answer = answers[q.id];
    if (answer === undefined || !q.frameworks) continue;
    for (const f of q.frameworks) {
      if (fw[f]) {
        fw[f].weightedSum += answer.value * q.weight;
        fw[f].maxPossible += 5 * q.weight;
      }
    }
  }

  const scores = {};
  for (const [key, val] of Object.entries(fw)) {
    const rawRisk = val.maxPossible
      ? (val.weightedSum / val.maxPossible) * 100
      : 0;
    scores[key] = Math.round(100 - rawRisk);
  }
  return scores;
}

// ── Step C: Baddie Score (5-source weighted, high = NOT ready) ──
// Kept as calculateBreakupScore for backward compatibility

export function calculateBreakupScore(sectionScores, answers) {
  // Source 1: Dimension average (40%)
  const dimValues = Object.values(sectionScores);
  if (dimValues.length === 0) return 50;
  const dimAvg = dimValues.reduce((a, b) => a + b, 0) / dimValues.length;
  const dimRisk = 100 - dimAvg;

  // Source 2: Framework composite (20%)
  const fwScores = answers ? getFrameworkScores(answers) : {};
  const fwValues = Object.entries(fwScores);
  let fwRisk = dimRisk; // fallback
  if (fwValues.length > 0) {
    let wSum = 0, wTotal = 0;
    for (const [key, score] of fwValues) {
      const w = frameworkWeights[key] || 0.1;
      wSum += (100 - score) * w;
      wTotal += w;
    }
    fwRisk = wTotal > 0 ? wSum / wTotal : dimRisk;
  }

  // Source 3: Critical flags (15%) — questions with breakup_risk >= 0.9 and answer >= 4
  let criticalCount = 0;
  let criticalTotal = 0;
  if (answers) {
    for (const q of questions) {
      if (q.section === "context") continue;
      if ((q.breakup_risk || 0) >= 0.9) {
        criticalTotal++;
        const a = answers[q.id];
        if (a && a.value >= 4) criticalCount++;
      }
    }
  }
  const criticalRisk = criticalTotal > 0 ? (criticalCount / criticalTotal) * 100 : dimRisk;

  // Source 4: Weakest dimension (15%)
  const weakest = dimValues.length > 0 ? Math.min(...dimValues) : 50;
  const weakestRisk = 100 - weakest;

  // Source 5: Gut check (10%) — last scored question (self-assessment)
  const gutAnswer = answers ? answers[44] : null;
  const gutRisk = gutAnswer ? ((gutAnswer.value - 1) / 4) * 100 : dimRisk;

  let score = Math.round(
    dimRisk * 0.40 +
    fwRisk * 0.20 +
    criticalRisk * 0.15 +
    weakestRisk * 0.15 +
    gutRisk * 0.10
  );

  // ── Age range context modifiers ──
  if (answers) {
    const ageAnswer = answers[1];
    const age = ageAnswer ? ageAnswer.value : 0;

    // Older age + low scores = amplified "not ready" score
    // (more time has passed, less excuse for weak fundamentals)
    if (age >= 4 && score >= 40) {
      score = Math.round(score + (age - 3) * 2);
    }

    // Younger age + high scores = slight boost (ahead of the curve)
    if (age <= 2 && score <= 30) {
      score = Math.round(score - 3);
    }
  }

  return Math.max(0, Math.min(100, score));
}

// ── 20 Tiers (globalScore based, high = strong) ──

const TIERS = [
  // ══ LEGEND MODE (80-100) ══
  {
    range: [96, 100],
    id: "certified_baddie_magnet",
    mode: "celebration",
    title: "Certified Baddie Magnet",
    emoji: "👑",
    color: "#10B981",
    summary: "Top 1%. You've mastered every dimension of the game. Confidence, style, communication, sexual energy — you're operating at a level most men will never reach. You don't attract women by trying. You attract them by being.",
    advice: "Stay sharp. The only threat to a man at your level is complacency. Keep evolving, keep challenging yourself, and never stop being curious about what makes people tick.",
    tone: "awe",
    funnelStrategy: "celebrate_and_share",
    reference: { name: "James Bond", source: "007 Franchise", emoji: "👑", type: "fiction" },
  },
  {
    range: [92, 95],
    id: "top_tier_player",
    mode: "celebration",
    title: "Top Tier Player",
    emoji: "🔥",
    color: "#10B981",
    summary: "You're in rare air. Your game is polished, your fundamentals are locked in, and women pick up on your energy immediately. You've put in the work and it shows in every interaction.",
    advice: "You're operating at an elite level. Focus on the 1-2 dimensions that aren't quite maxed out. That's the difference between great and legendary.",
    tone: "warm_pride",
    funnelStrategy: "celebrate_and_share",
    reference: { name: "Harvey Specter", source: "Suits", emoji: "🔥", type: "fiction" },
  },
  {
    range: [88, 91],
    id: "natural_charmer",
    mode: "celebration",
    title: "Natural Charmer",
    emoji: "✨",
    color: "#10B981",
    summary: "You've got that effortless magnetism. Women feel comfortable around you AND attracted to you — that's the hardest combination to pull off. Your social intelligence is sharp and your presence commands attention without demanding it.",
    advice: "You're in a great spot. Stay sharp on your weakest dimension. The difference between charming and magnetic is consistency across every area.",
    tone: "encouraging",
    funnelStrategy: "maintain_and_share",
    reference: { name: "Ryan Gosling", source: "Crazy Stupid Love (2011)", emoji: "✨", type: "fiction" },
  },
  {
    range: [84, 87],
    id: "smooth_operator",
    mode: "celebration",
    title: "Smooth Operator",
    emoji: "😎",
    color: "#22C55E",
    summary: "You move through social situations with confidence and calibration. You know when to speak, when to listen, and when to escalate. A few rough edges remain, but the overall package is strong and getting stronger.",
    advice: "You're close to the top tier. Identify your one weakest link and dedicate focused energy there. Small upgrades at your level create outsized results.",
    tone: "confident",
    funnelStrategy: "maintain_and_polish",
    reference: { name: "Tony Stark", source: "Iron Man (2008)", emoji: "😎", type: "fiction" },
  },
  {
    range: [80, 83],
    id: "solid_game",
    mode: "celebration",
    title: "Solid Game",
    emoji: "💪",
    color: "#22C55E",
    summary: "Your fundamentals are locked in. You're not perfect, but you're consistently above average across the board. Women notice you, conversations flow, and you carry yourself with real confidence. The foundation is strong.",
    advice: "You've built a solid base. Now it's about refinement. Focus on the gap between your strongest and weakest dimensions — closing that gap is what separates solid from elite.",
    tone: "reassuring",
    funnelStrategy: "maintain_and_polish",
    reference: { name: "Mike Ross", source: "Suits", emoji: "💪", type: "fiction" },
  },

  // ══ GROWTH MODE (50-79) ══
  {
    range: [75, 79],
    id: "almost_there",
    mode: "growth",
    title: "Almost There",
    emoji: "📈",
    color: "#EAB308",
    summary: "You're genuinely close. The raw ingredients are there but a few key areas are holding you back from the next level. The frustrating part? You can probably feel how close you are. One or two targeted upgrades and everything clicks.",
    advice: "Don't try to fix everything at once. Pick your single weakest dimension and go all-in on it for 30 days. That's your bottleneck.",
    tone: "optimistic",
    funnelStrategy: "gentle_growth",
    reference: { name: "Neville Longbottom", source: "Harry Potter (glow-up arc)", emoji: "📈", type: "fiction" },
  },
  {
    range: [70, 74],
    id: "on_the_rise",
    mode: "growth",
    title: "On The Rise",
    emoji: "⬆️",
    color: "#EAB308",
    summary: "You're trending in the right direction. Some areas are legitimately strong, but the weak spots are visible and they're costing you opportunities. Women can sense inconsistency — strong in one moment, uncertain in the next.",
    advice: "Consistency is your biggest lever right now. The gap between your best and worst dimensions is where attraction leaks out. Address it directly.",
    tone: "candid",
    funnelStrategy: "gentle_growth",
    reference: { name: "Peter Parker", source: "Spider-Man (2002)", emoji: "⬆️", type: "fiction" },
  },
  {
    range: [65, 69],
    id: "raw_potential",
    mode: "growth",
    title: "Raw Potential",
    emoji: "💎",
    color: "#F97316",
    summary: "There's something here. You've got strengths that most men don't, but they're buried under underdeveloped areas. It's like having a sports car with bald tires — the engine is there, but you can't use it. Time to balance the build.",
    advice: "Stop relying on your strengths to compensate for your weaknesses. Identify the two dimensions dragging you down and commit to real change there.",
    tone: "lucid",
    funnelStrategy: "targeted_action",
    reference: { name: "Rocky Balboa", source: "Rocky (1976)", emoji: "💎", type: "fiction" },
  },
  {
    range: [60, 64],
    id: "work_to_do",
    mode: "growth",
    title: "Work To Do",
    emoji: "🔧",
    color: "#F97316",
    summary: "Let's be honest: you're average. Not terrible, not great. You blend into the background in most social situations. Women aren't repelled by you, but they're not drawn to you either. The good news? Average is fixable. It just requires admitting it first.",
    advice: "Stop telling yourself 'it's fine.' It's mediocre, and mediocre doesn't attract the women you actually want. Start with confidence and style — they create the fastest visible change.",
    tone: "firm_but_hopeful",
    funnelStrategy: "targeted_action",
    reference: { name: "Andy Sachs", source: "The Devil Wears Prada (2006) — pre-transformation", emoji: "🔧", type: "fiction" },
  },
  {
    range: [55, 59],
    id: "reality_check",
    mode: "growth",
    title: "Reality Check",
    emoji: "🪞",
    color: "#F97316",
    summary: "This score is a mirror. You're below average in the areas that matter most for attraction. Not hopeless — but definitely not where you want to be. The patterns you've built won't change on their own. This is the moment where you either decide to level up or keep getting the same results.",
    advice: "Stop doing what you've been doing. It clearly isn't working. Pick up the action plan, follow it step by step, and give it 60 days before you judge anything.",
    tone: "serious_but_empowering",
    funnelStrategy: "urgency_with_hope",
    reference: { name: "Will Smith", source: "The Pursuit of Happyness (2006)", emoji: "🪞", type: "fiction" },
  },
  {
    range: [50, 54],
    id: "under_construction",
    mode: "growth",
    title: "Under Construction",
    emoji: "🏗️",
    color: "#F97316",
    summary: "You're a construction site. The blueprint exists somewhere in there, but right now it's scaffolding and exposed wiring. Multiple dimensions need serious work. The question isn't whether you can improve — it's whether you're willing to do the uncomfortable work required.",
    advice: "Accept where you are without shame. Then build systematically: mentality first, then confidence, then everything else. The order matters.",
    tone: "honest",
    funnelStrategy: "urgency_with_hope",
    reference: { name: "Steve Rogers", source: "Captain America — pre-serum", emoji: "🏗️", type: "fiction" },
  },

  // ══ WAKE-UP MODE (25-49) ══
  {
    range: [45, 49],
    id: "serious_gap",
    mode: "alert",
    title: "Serious Gap",
    emoji: "⚠️",
    color: "#EF4444",
    summary: "There's a serious gap between where you are and where you need to be. Most of your dimensions are underperforming and the compound effect is brutal. Women aren't seeing what you want them to see. But recognizing this is genuinely the hardest step, and you just took it.",
    advice: "Don't try to become a different person overnight. Start with the absolute basics: how you present yourself, how you carry yourself, how you speak. Master those before anything else.",
    tone: "compassionate_urgency",
    funnelStrategy: "professional_help",
    reference: { name: "Jesse Pinkman", source: "Breaking Bad — early seasons", emoji: "⚠️", type: "fiction" },
  },
  {
    range: [40, 44],
    id: "major_upgrade_needed",
    mode: "alert",
    title: "Major Upgrade Needed",
    emoji: "🚩",
    color: "#EF4444",
    summary: "Multiple core dimensions are critically low. The patterns you've described are well-documented attraction killers. But here's what matters: these are behaviors and habits, not permanent traits. Every single one can be changed with the right approach.",
    advice: "This is a rebuild, not a tweak. Consider working with a coach or mentor who can give you honest, structured feedback. Self-improvement books alone won't cut it at this level.",
    tone: "direct_compassion",
    funnelStrategy: "professional_help",
    reference: { name: "Jaime Lannister", source: "Game of Thrones — redemption arc", emoji: "🚩", type: "fiction" },
  },
  {
    range: [35, 39],
    id: "emergency_mode",
    mode: "alert",
    title: "Emergency Mode",
    emoji: "🚨",
    color: "#DC2626",
    summary: "Your scores indicate fundamental issues across nearly every dimension. This isn't about dating tactics — it's about rebuilding your relationship with yourself first. Confidence, self-worth, purpose. The women come after you fix the foundation.",
    advice: "Focus on yourself before focusing on women. Hit the gym, develop a skill, build a routine. Attraction is a byproduct of a life well-lived. Start building that life.",
    tone: "serious",
    funnelStrategy: "professional_help_urgent",
    reference: { name: "Zuko", source: "Avatar: The Last Airbender — redemption arc", emoji: "🚨", type: "fiction" },
  },
  {
    range: [30, 34],
    id: "ground_zero",
    mode: "alert",
    title: "Ground Zero",
    emoji: "🔻",
    color: "#DC2626",
    summary: "You're at ground zero. Nearly every dimension is in critical territory. But ground zero is also where the strongest comebacks start. You don't need to fix everything today. You need to fix one thing. Then another. Then another. That's how transformations happen.",
    advice: "Start with your mental health and physical fitness. Everything else — confidence, style, social skills — is built on that foundation. One step at a time.",
    tone: "firm_compassion",
    funnelStrategy: "professional_help_urgent",
    reference: { name: "Rocky Balboa", source: "Rocky Balboa (2006) — the comeback", emoji: "🔻", type: "fiction" },
  },

  // ══ CRITICAL MODE (0-29) ══
  {
    range: [25, 29],
    id: "starting_from_scratch",
    mode: "critical",
    title: "Starting From Scratch",
    emoji: "🔄",
    color: "#991B1B",
    summary: "You're starting from scratch, and that takes guts to admit. Most men at this level either don't take the quiz or lie to themselves about the results. You didn't. That honesty is actually your first real strength. Use it.",
    advice: "Forget about dating for now. Seriously. Spend 90 days building yourself: body, mind, wardrobe, social circle. The dating comes naturally once you become someone worth dating.",
    tone: "gentle_truth",
    funnelStrategy: "self_care_first",
    reference: { name: "The Count of Monte Cristo", source: "Alexandre Dumas — the transformation", emoji: "🔄", type: "fiction" },
  },
  {
    range: [20, 24],
    id: "deep_rebuild",
    mode: "critical",
    title: "Deep Rebuild",
    emoji: "🆘",
    color: "#991B1B",
    summary: "Your scores indicate you need a deep, fundamental rebuild. Not surface-level changes — a complete overhaul of how you see yourself and show up in the world. This is hard to hear, but it's also the most honest thing anyone has told you. And honesty is where change starts.",
    advice: "Seek professional support — a therapist, a coach, a mentor. You need someone in your corner who can guide the rebuild with structure and accountability.",
    tone: "empathetic",
    funnelStrategy: "self_care_first",
    reference: { name: "Tony Montana", source: "Scarface — before the rise", emoji: "🆘", type: "fiction" },
  },
  {
    range: [15, 19],
    id: "survival_mode",
    mode: "critical",
    title: "Survival Mode",
    emoji: "🛟",
    color: "#7F1D1D",
    summary: "You're in survival mode. Not just in dating — probably in life. The scores here suggest deeper issues with self-worth, direction, and confidence that go beyond attracting women. Fix the man first. The magnetism follows.",
    advice: "Your wellbeing comes first. Talk to a professional. Build a daily routine that includes exercise, purpose, and human connection. Everything else is secondary.",
    tone: "compassionate",
    funnelStrategy: "self_care_first",
    reference: { name: "Jordan Belfort", source: "The Wolf of Wall Street — the fall", emoji: "🛟", type: "fiction" },
  },
  {
    range: [5, 14],
    id: "level_zero",
    mode: "critical",
    title: "Level Zero",
    emoji: "⬛",
    color: "#7F1D1D",
    summary: "Level zero. Every dimension needs attention. But here's the thing about being at the bottom — the only direction is up, and every single improvement will be noticeable. Men who've been where you are have completely transformed. It starts with one decision.",
    advice: "One decision. One change. Today. Not tomorrow, not next week. Start with something physical — a walk, a workout, a haircut. Movement creates momentum.",
    tone: "empowering",
    funnelStrategy: "exit_support",
    reference: { name: "Bruce Wayne", source: "Batman Begins — the pit", emoji: "⬛", type: "fiction" },
  },
  {
    range: [0, 4],
    id: "ghost_mode",
    mode: "critical",
    title: "Ghost Mode",
    emoji: "👻",
    color: "#7F1D1D",
    summary: "You're invisible to the dating world right now. Completely off the radar. But ghosts can come back to life. The fact that you took this quiz means something inside you wants more. That spark — however small — is enough to start.",
    advice: "This isn't about dating right now. It's about deciding you deserve better and taking the first step. Talk to someone you trust. Get moving. The rest will follow.",
    tone: "liberating",
    funnelStrategy: "exit_support",
    reference: { name: "V", source: "V for Vendetta — rebirth from nothing", emoji: "👻", type: "fiction" },
  },
];

export function getTier(globalScore) {
  for (const tier of TIERS) {
    if (globalScore >= tier.range[0] && globalScore <= tier.range[1]) {
      return tier;
    }
  }
  // fallback to reality_check tier
  return TIERS.find(t => t.id === "reality_check") || TIERS[9];
}

export function getHealthBracket(score) {
  if (score >= 75) return "strong";
  if (score >= 50) return "developing";
  if (score >= 30) return "fragile";
  return "critical";
}

// ── Profile classification ──

const profiles = [
  { name: "The Alpha", match: (s) => Object.values(s).every(v => v >= 75) },
  { name: "The Ghost", match: (s) => s.confidence <= 40 && s.communication <= 40 && s.social <= 50 },
  { name: "The Showoff", match: (s) => s.style >= 60 && s.mentality <= 40 && s.value <= 40 },
  { name: "The Friendzone Veteran", match: (s) => s.social >= 60 && s.communication >= 55 && s.sexuality <= 35 },
  { name: "The Lone Wolf", match: (s) => s.value >= 60 && s.mentality >= 55 && s.social <= 35 },
  { name: "The Overcompensator", match: (s) => s.confidence >= 65 && s.style <= 35 && s.communication <= 40 },
  { name: "The Untapped Potential", match: (s) => s.mentality >= 55 && s.value >= 50 && s.style <= 40 && s.social <= 40 },
  { name: "The Average Joe", match: (s) => Object.values(s).every(v => v >= 40 && v <= 65) },
  { name: "The Comeback Kid", match: (s) => { const avg = Object.values(s).reduce((a,b)=>a+b,0)/7; return avg >= 40 && avg <= 60 && s.mentality >= 55; } },
  { name: "The Flatline", match: (s) => Object.values(s).filter(v => v <= 30).length >= 3 },
];

export function getProfile(sectionScores) {
  for (const p of profiles) {
    if (p.match(sectionScores)) return p.name;
  }
  return "The Work In Progress";
}

// ── Section insights ──

const sectionInsights = {
  confidence: {
    strong: "You carry yourself with genuine self-assurance. You're not afraid to take up space, make eye contact, or go after what you want. Women pick up on this energy immediately.",
    developing: "Your confidence is inconsistent. Some situations bring out your best self, others make you shrink. Working on your inner game will unlock everything else.",
    fragile: "Confidence is a real struggle for you. Self-doubt is running the show and it's visible in how you interact with women. This is the single most important area to address.",
    critical: "Your confidence is essentially nonexistent right now. You're operating from fear and insecurity in nearly every interaction. This must be the first thing you fix — nothing else works without it.",
  },
  style: {
    strong: "Your presentation is on point. You understand that how you look signals who you are before you say a word. Your grooming, wardrobe, and overall aesthetic are working for you.",
    developing: "Your style is passable but unremarkable. You're not turning heads, but you're not repelling anyone either. A few intentional upgrades would make a noticeable difference.",
    fragile: "Your style is holding you back. First impressions are formed in seconds and yours aren't working in your favor. Time to invest in your appearance with intention.",
    critical: "Your presentation needs a complete overhaul. Grooming, wardrobe, overall aesthetic — all of it needs attention. This is one of the fastest areas to improve with the right guidance.",
  },
  social: {
    strong: "You thrive in social environments. You read rooms well, navigate group dynamics naturally, and create connections easily. Women see you as socially intelligent and fun to be around.",
    developing: "Your social skills are adequate but not magnetic. You can hold your own in a group but you rarely stand out. Building your social confidence will open more doors than you realize.",
    fragile: "Social situations stress you out. You struggle to navigate group dynamics, introduce yourself to new people, or maintain engaging conversations. This isolation is limiting your opportunities.",
    critical: "You're socially withdrawn to the point where meeting women organically is nearly impossible. Building a social life from the ground up is essential before anything else can improve.",
  },
  communication: {
    strong: "You know how to talk to women. Your conversations are engaging, your humor lands, and you can hold tension without making things awkward. This is a major asset.",
    developing: "Your communication works on the surface but lacks depth or edge. Conversations are pleasant but forgettable. Learning to create emotional spikes and genuine connection will change your results.",
    fragile: "Your communication skills are weak. Conversations fizzle out, you struggle to keep women engaged, or you come across as either too intense or too passive. This needs focused work.",
    critical: "Communication has broken down. You either can't start conversations, can't sustain them, or actively push women away with how you communicate. Start with the fundamentals.",
  },
  mentality: {
    strong: "Your mental game is strong. You have a growth mindset, handle rejection well, and don't let setbacks define you. This resilience is the backbone of everything else you've built.",
    developing: "Your mentality is okay but fragile under pressure. Rejection stings more than it should and setbacks knock you off course. Building mental toughness will accelerate every other improvement.",
    fragile: "Your mindset is sabotaging you. Limiting beliefs, fear of rejection, and a fixed view of yourself are keeping you stuck. Rewiring your mental game is non-negotiable.",
    critical: "Your mental state is in crisis. Negative self-talk, hopelessness, and deeply held limiting beliefs are running the show. Consider working with a therapist or coach before tackling anything else.",
  },
  value: {
    strong: "You bring real value to the table — career, ambition, financial stability, purpose. Women aren't just attracted to you, they respect you. You've built a life worth sharing.",
    developing: "You're building value but you're not there yet. Your career, finances, or life direction could use more focus. Women are attracted to men with clear purpose and momentum.",
    fragile: "Your perceived value is low. You lack clear direction, financial stability, or demonstrable ambition. Women want to be with someone who's going somewhere. Figure out where you're going.",
    critical: "You're not bringing tangible value to a potential relationship. No clear career path, no financial foundation, no visible ambition. This isn't about money — it's about having a life that inspires.",
  },
  sexuality: {
    strong: "You understand sexual polarity and tension. You can escalate naturally without being creepy, you're comfortable with desire, and women feel your masculine energy. This is a rare and powerful skill.",
    developing: "Your sexual energy exists but it's inconsistent or poorly calibrated. Sometimes you come on too strong, other times you're too passive. Learning to read and create tension is the next step.",
    fragile: "You're uncomfortable with your own sexuality or struggle to express it appropriately. Women sense this awkwardness and it kills attraction. Getting comfortable with desire and escalation is essential.",
    critical: "Sexual confidence and expression are essentially absent. You either avoid anything sexual entirely or express it in ways that push women away. This dimension needs serious attention and possibly professional guidance.",
  },
};

// ── Main results function ──

export function getResults(answers) {
  const sectionScores = getSectionScores(answers);
  const globalScore = getGlobalScore(sectionScores);
  const breakupRisk = calculateBreakupScore(sectionScores, answers);
  const tier = getTier(globalScore);
  const profile = getProfile(sectionScores);

  const insights = Object.entries(sectionScores).map(([section, sScore]) => ({
    section,
    score: sScore,
    bracket: getHealthBracket(sScore),
    insight: sectionInsights[section]?.[getHealthBracket(sScore)] || "",
  }));

  return {
    // v6 primary
    globalScore,
    tier,
    breakupRisk,

    // backward compat (result.score is stored in DB, used by premium)
    score: breakupRisk,
    bracket: tier.id,
    title: tier.title,
    emoji: tier.emoji,
    summary: tier.summary,
    advice: tier.advice,

    sectionScores,
    insights,
    profile,
  };
}
