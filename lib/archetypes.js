// Archetypes: narrative profiles matched on dimension scores.
// Celebration archetypes matched first (high scores), then growth/alert.

const archetypes = [
  // ── CELEBRATION ARCHETYPES (globalScore >= 80) ──

  {
    id: "baddie_magnet",
    name: "The Baddie Magnet",
    description: "You're the guy women notice before you even open your mouth. Confidence, style, conversation, presence — you've got it all dialed in. You don't chase. You attract. The rare combination of looking the part, being the part, and knowing when to shut up and let the tension build. Most men will never get here. You're already here.",

    match: (scores) => {
      const vals = Object.values(scores);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const spread = Math.max(...vals) - Math.min(...vals);
      return avg >= 85 && spread < 20;
    },
  },

  {
    id: "complete_package",
    name: "The Complete Package",
    description: "You're not just attractive — you're trustworthy, put-together, and genuinely interesting. Women feel safe around you AND excited by you. That's the combo most men can't crack. Your confidence is quiet, your style is intentional, and your value speaks for itself. You don't need tricks because you ARE the trick.",

    match: (scores) => {
      const vals = Object.values(scores);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return avg >= 80 && (scores.confidence || 0) >= 75 && (scores.value || 0) >= 75 && (scores.style || 0) >= 70;
    },
  },

  // ── GROWTH ARCHETYPES (50-79) ──

  {
    id: "ghost",
    name: "The Ghost",
    description: "You disappear before anything even starts. Not because you don't want it, but because the idea of walking up to her feels like defusing a bomb. Low confidence and weak communication mean you're invisible to the women you actually want. You've probably got more to offer than you think — but nobody will ever know if you keep haunting the sidelines.",

    match: (scores) => (scores.confidence || 0) <= 40 && (scores.communication || 0) <= 40,
  },

  {
    id: "friendzone_king",
    name: "The Friendzone King",
    description: "Women love talking to you. They love hanging out with you. They love telling you about the guy they're actually sleeping with. You've mastered social skills and communication but you radiate zero sexual energy. You're everyone's emotional support bro. Until you learn to create tension and lead with intent, you'll keep collecting friendships when you wanted something more.",

    match: (scores) => (scores.communication || 0) >= 60 && (scores.social || 0) >= 55 && (scores.sexuality || 0) <= 40 && (scores.confidence || 0) <= 45,
  },

  {
    id: "all_talk",
    name: "The All Talk",
    description: "You can talk a big game. Your mouth writes checks your life can't cash. You know all the right things to say, but when she looks at your lifestyle, your ambition, your follow-through — it doesn't match the marketing. Women see through this fast. The gap between what you say and what you are is where attraction goes to die.",

    match: (scores) => (scores.communication || 0) >= 60 && (scores.value || 0) <= 40 && (scores.mentality || 0) <= 45,
  },

  {
    id: "brute",
    name: "The Brute",
    description: "You've got balls, no question. You'll approach anyone, say what's on your mind, take up space. But you do it with the finesse of a wrecking ball. No style, no calibration, no reading the room. Confidence without communication is just aggression in a polo shirt. You need polish, not courage.",

    match: (scores) => (scores.confidence || 0) >= 60 && (scores.communication || 0) <= 40 && (scores.style || 0) <= 40,
  },

  {
    id: "diamond_in_the_rough",
    name: "The Diamond in the Rough",
    description: "You've got the substance. Strong values, solid mentality, real depth. But the packaging is letting you down. Your style is an afterthought and your social game is nonexistent. Women aren't giving you the chance to show what's underneath because the outside isn't inviting them in. This is the most fixable archetype — a few upgrades and you're dangerous.",

    match: (scores) => (scores.mentality || 0) >= 60 && (scores.value || 0) >= 55 && (scores.style || 0) <= 40 && (scores.social || 0) <= 45,
  },

  {
    id: "pretty_boy",
    name: "The Pretty Boy",
    description: "You look great. Genuinely. But that's where it ends. You've invested everything in the mirror and nothing in the mind. When women get past the surface — and they always do — there's not enough there to hold them. No depth, no edge, no backbone. You're a trailer for a movie that doesn't exist yet.",

    match: (scores) => (scores.style || 0) >= 60 && (scores.mentality || 0) <= 40 && (scores.confidence || 0) <= 45,
  },

  {
    id: "lone_wolf",
    name: "The Lone Wolf",
    description: "You've built real value. Career, finances, mindset — you're handling your business. But you're doing it alone. Your social skills are underdeveloped and you mistake isolation for independence. High-value women exist in social ecosystems. If you're never in the room, it doesn't matter how impressive you are on paper.",

    match: (scores) => (scores.value || 0) >= 60 && (scores.mentality || 0) >= 55 && (scores.social || 0) <= 40,
  },

  {
    id: "nice_guy",
    name: "The Nice Guy",
    description: "You're polite. You're respectful. You're safe. And you're completely forgettable. High communication but zero edge. You've been taught that being 'nice' is enough and it's left you without the confidence or sexual energy to create real attraction. Nice is a baseline, not a strategy. Women want to feel desired, not just respected.",

    match: (scores) => (scores.communication || 0) >= 55 && (scores.confidence || 0) <= 40 && (scores.sexuality || 0) <= 40,
  },

  // ── ALERT ARCHETYPES (below 50) ──

  {
    id: "invisible_man",
    name: "The Invisible Man",
    description: "Most of your dimensions are below 40. You're not on anyone's radar right now. Not because you're a bad person — but because nothing about your current presentation signals 'worth knowing.' This is a full reset situation. The upside? When you're starting from the bottom, every improvement is visible and dramatic. The transformation starts today.",

    match: (scores) => {
      const vals = Object.values(scores);
      return vals.filter(v => v <= 40).length >= 5;
    },
  },

  {
    id: "rebuild",
    name: "The Rebuild",
    description: "Your scores are low, but not uniformly low. There's a spark in one or two areas that suggests you've got raw material to work with. The problem is everything around it is undeveloped. Think of it like having a good engine in a car with no wheels. You need a structured, ground-up rebuild — but at least there's something to build on.",

    match: (scores) => {
      const vals = Object.values(scores);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      const maxDim = Math.max(...vals);
      return avg <= 45 && maxDim >= 50;
    },
  },
];

const fallback = {
  id: "work_in_progress",
  name: "The Work In Progress",
  description: "You don't fit a single archetype cleanly. Some areas are decent, others need serious work. The lack of a clear pattern means your game is inconsistent — strong in one situation, invisible in the next. The good news: you've got options. The bad news: scattered potential is just wasted potential until you focus it.",
};

export function getArchetype(sectionScores) {
  for (const archetype of archetypes) {
    try {
      if (archetype.match(sectionScores)) {
        const { match, ...rest } = archetype;
        return rest;
      }
    } catch (e) {
      continue;
    }
  }
  return fallback;
}
