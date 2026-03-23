import Results from "./results";

export default function ResultsPreview(props) {
  return <Results {...props} />;
}

// Map tier index (0-19) to a globalScore in that tier's range
const TIER_SCORES = [
  98, 93, 89, 85, 81,           // celebration: legendary, exceptional, thriving, strong_foundation, solid
  77, 72, 67, 62, 57, 52,       // growth: good_with_potential, connected_but_watch, imbalanced, yellow_flags, crossroads, under_construction
  47, 42, 37, 32,               // alert: serious_concerns, red_flags, crisis, toxic_patterns
  27, 22, 17, 10, 2,            // critical: breaking_point, deep_distress, survival_mode, time_to_choose, already_gone
];

function buildMockSectionScores(globalScore) {
  // Create slightly varied dimension scores centered on globalScore
  const spread = Math.min(globalScore, 100 - globalScore, 10);
  return {
    confidence: Math.max(0, Math.min(100, globalScore + 3)),
    style: Math.max(0, Math.min(100, globalScore - 2)),
    social: Math.max(0, Math.min(100, globalScore + 1)),
    communication: Math.max(0, Math.min(100, globalScore - spread)),
    mentality: Math.max(0, Math.min(100, globalScore + 2)),
    value: Math.max(0, Math.min(100, globalScore - 1)),
    sexuality: Math.max(0, Math.min(100, globalScore + spread - 3)),
  };
}

export async function getServerSideProps({ query }) {
  const { getTier, getGlobalScore } = await import("@/lib/scoring");
  const { generatePremiumContent } = await import("@/lib/premium");

  // tier param: 0-19 index, or tier id like "legendary"
  const tierParam = query.tier ?? "0";
  let targetScore;

  const tierIndex = parseInt(tierParam, 10);
  if (!isNaN(tierIndex) && tierIndex >= 0 && tierIndex < TIER_SCORES.length) {
    targetScore = TIER_SCORES[tierIndex];
  } else {
    // Try matching by tier id
    const allTiers = TIER_SCORES.map((s) => ({ score: s, tier: getTier(s) }));
    const found = allTiers.find((t) => t.tier.id === tierParam);
    targetScore = found ? found.score : TIER_SCORES[0];
  }

  const sectionScores = buildMockSectionScores(targetScore);
  const globalScore = getGlobalScore(sectionScores);
  const tier = getTier(globalScore);
  const breakupRisk = Math.max(0, Math.min(100, 100 - globalScore + 5));

  const result = {
    globalScore,
    tier,
    breakupRisk,
    score: breakupRisk ?? 0,
    bracket: tier.id,
    title: tier.title,
    emoji: tier.emoji,
    summary: tier.summary,
    advice: tier.advice,
    sectionScores,
    insights: Object.entries(sectionScores).map(([section, score]) => ({
      section,
      score,
      bracket: score >= 75 ? "strong" : score >= 50 ? "developing" : score >= 30 ? "fragile" : "critical",
      insight: `${section} scores ${score}% for this tier preview.`,
    })),
    profile: "Preview",
  };

  const premium = generatePremiumContent({
    breakupScore: result.score,
    sectionScores,
    userDob: { day: "4", month: "3", year: "1996" },
    partnerDob: { day: "2", month: "9", year: "1998" },
    userName: "Marcus",
    partnerName: null,
  });

  return { props: { result, premium, error: null } };
}
