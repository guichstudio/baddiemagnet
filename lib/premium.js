import { getArchetype } from "./archetypes";
import { getBreakupEstimate, buildSeed, get7DayPlan } from "./projection";
import { getTier, getGlobalScore } from "./scoring";

// score is now positive: high = healthy
function getLevel(score) {
  if (score >= 80) return "OK";
  if (score >= 60) return "Watch";
  if (score >= 40) return "Serious";
  return "Critical";
}

function getRiskLabel(score) {
  if (score <= 10) return "Very Low";
  if (score <= 30) return "Low";
  if (score <= 50) return "Moderate";
  if (score <= 70) return "High";
  if (score <= 90) return "Very High";
  return "Critical";
}

const categoryKeys = ["confidence", "style", "social", "communication", "mentality", "value", "sexuality"];
const categoryLabels = {
  confidence: "Confidence",
  style: "Style & Appearance",
  social: "Social Game",
  communication: "Communication",
  mentality: "Mentality",
  value: "Value",
  sexuality: "Sexual Energy",
};

function getTopTwo(sectionScores) {
  const entries = categoryKeys.map((k) => ({ key: k, score: sectionScores[k] || 0 }));
  const forceMentality = (sectionScores.mentality || 0) < 25;
  const sorted = [...entries].sort((a, b) => a.score - b.score);
  if (forceMentality) {
    const top = sorted.filter((e) => e.key !== "mentality").slice(0, 1);
    const mentalityEntry = entries.find((e) => e.key === "mentality");
    return [mentalityEntry, ...top].slice(0, 2);
  }
  return sorted.slice(0, 2);
}

// For celebration mode, get top 2 strongest dimensions instead
function getTopTwoStrengths(sectionScores) {
  const entries = categoryKeys.map((k) => ({ key: k, score: sectionScores[k] || 0 }));
  return [...entries].sort((a, b) => b.score - a.score).slice(0, 2);
}

const categoryContent = {
  confidence: {
    shortTips: {
      OK: "Your confidence is solid. You walk into a room and own it.",
      Watch: "Your confidence wavers in key moments. Time to sharpen it.",
      Serious: "Low confidence is holding you back from the women you want.",
      Critical: "You're invisible because you don't believe you deserve to be seen.",
    },
    impactHints: {
      OK: "This natural self-assurance is magnetic. Women feel safe around confident men.",
      Watch: "Inconsistent confidence sends mixed signals and kills attraction.",
      Serious: "Without confidence, even great qualities go unnoticed.",
      Critical: "This is the root of everything. Nothing else matters until you fix this.",
    },
    why: "Confidence is the foundation of attraction. Without it, nothing else you do will land.",
    bestAction: "Start doing one uncomfortable thing every day. Confidence is built through action, not affirmation.",
    actions: [
      "Maintain eye contact during conversations — don't be the first to look away.",
      "Stand tall, shoulders back, take up space. Your body language speaks before you do.",
      "Set one small goal each day and accomplish it. Stack wins.",
    ],
    avoids: [
      "Seeking validation from others before trusting your own judgment.",
      "Comparing yourself to other men on social media.",
      "Apologizing for taking up space or having an opinion.",
    ],
    copyScript: "I am enough. I don't need permission to show up fully.",
  },
  style: {
    shortTips: {
      OK: "Your style is on point. You understand the power of presentation.",
      Watch: "Your look is decent but forgettable. Time to level up.",
      Serious: "Your appearance is sending the wrong message. Baddies notice.",
      Critical: "Your style is actively working against you. A complete reset is needed.",
    },
    impactHints: {
      OK: "Looking sharp gives you a silent advantage before you even speak.",
      Watch: "A mediocre look makes you blend in when you should be standing out.",
      Serious: "Poor style signals low self-awareness — a dealbreaker for high-value women.",
      Critical: "This is one of the easiest fixes with the biggest immediate impact.",
    },
    why: "Style is your silent introduction. It tells women what you think of yourself before you say a word.",
    bestAction: "Get one outfit that makes you feel like a 10. Wear it this week.",
    actions: [
      "Find 3 style references that match your vibe. Screenshot them and reverse-engineer the look.",
      "Upgrade your grooming routine — haircut, skincare, nails. Details matter.",
      "Make sure your clothes fit properly. Baggy or too tight both kill your look.",
    ],
    avoids: [
      "Wearing the same rotation of worn-out basics every day.",
      "Ignoring grooming — unkempt hair, patchy beard, dry skin.",
      "Dressing to blend in when you should be expressing yourself.",
    ],
    copyScript: "How I present myself is a reflection of how I value myself.",
  },
  social: {
    shortTips: {
      OK: "You're socially sharp. You can work a room and people gravitate toward you.",
      Watch: "Your social skills are okay but not magnetic. You need more initiative.",
      Serious: "You're socially passive. Baddies don't chase — they choose men who lead.",
      Critical: "You're socially isolated. Building a social life is step one.",
    },
    impactHints: {
      OK: "Strong social skills make you the connector — the man everyone wants around.",
      Watch: "Being average socially means you're missing opportunities constantly.",
      Serious: "Social passivity signals low status. Women pick up on this immediately.",
      Critical: "Without a social life, you have no stage to demonstrate your value.",
    },
    why: "Your social world is your ecosystem. Women want a man who is wanted by others.",
    bestAction: "This week, be the one who organizes. Plan something and invite people.",
    actions: [
      "Talk to one new person every day. Build the muscle.",
      "Join a group, class, or community that aligns with your interests.",
      "Practice being the energy in the room — introduce people, keep conversations alive.",
    ],
    avoids: [
      "Waiting for others to include you instead of creating your own plans.",
      "Only socializing through screens and dating apps.",
      "Being the quiet guy in the corner hoping someone notices you.",
    ],
    copyScript: "I create my social world. I don't wait for invitations — I make them.",
  },
  communication: {
    shortTips: {
      OK: "You communicate with clarity and intention. That's rare and attractive.",
      Watch: "You can talk, but you're not connecting. Depth is missing.",
      Serious: "Your conversations are flat. Women lose interest quickly.",
      Critical: "You struggle to express yourself. This blocks all connection.",
    },
    impactHints: {
      OK: "Great communicators create emotional experiences. That's what women remember.",
      Watch: "Surface-level communication keeps relationships surface-level too.",
      Serious: "Poor communication means even interested women will drift away.",
      Critical: "Without the ability to express and connect verbally, attraction has no fuel.",
    },
    why: "Communication is how attraction is built and sustained. Words create worlds.",
    bestAction: "In your next conversation, ask one genuinely curious question and listen fully to the answer.",
    actions: [
      "Practice storytelling — learn to make even mundane experiences interesting.",
      "Ask open-ended questions that invite real answers, not yes/no responses.",
      "Express your opinions without hedging. Baddies respect directness.",
    ],
    avoids: [
      "Rambling or over-explaining to fill silence.",
      "Performing instead of connecting — trying to impress rather than relate.",
      "Texting paragraphs when a clear, direct message works better.",
    ],
    copyScript: "I speak with purpose. I listen to understand, not to respond.",
  },
  mentality: {
    shortTips: {
      OK: "Your mindset is strong. You handle setbacks with resilience.",
      Watch: "Your mentality wobbles under pressure. That bleeds into dating.",
      Serious: "Limiting beliefs are running your life. Time to reprogram.",
      Critical: "Your mindset is your biggest obstacle. Everything starts here.",
    },
    impactHints: {
      OK: "A strong mentality is quietly magnetic. Women sense inner stability.",
      Watch: "Mental inconsistency creates an emotional rollercoaster no one wants to ride.",
      Serious: "A weak mentality makes you reactive, needy, and unpredictable.",
      Critical: "Until your mindset shifts, every other improvement will be temporary.",
    },
    why: "Your mentality is the operating system. If it's broken, nothing you install on top will work properly.",
    bestAction: "Write down your #1 limiting belief about dating. Then write the opposite and act on it today.",
    actions: [
      "Start a daily journaling habit — 5 minutes on wins, lessons, and gratitude.",
      "Cut one source of negativity from your life this week — a habit, a person, a feed.",
      "Read or listen to something that challenges your current thinking every day.",
    ],
    avoids: [
      "Dwelling on past rejections and letting them define your future.",
      "Consuming content that reinforces a victim mentality.",
      "Expecting results without putting in the internal work first.",
    ],
    copyScript: "My mindset is my superpower. I choose growth over comfort.",
  },
  value: {
    shortTips: {
      OK: "You bring real value to the table. Your life has direction and substance.",
      Watch: "You have potential but you're coasting. Baddies want driven men.",
      Serious: "You're not building anything. That's a problem for high-value women.",
      Critical: "You have no clear direction. Fix this before chasing anyone.",
    },
    impactHints: {
      OK: "A man with purpose is inherently attractive. You don't have to chase — you attract.",
      Watch: "Unfulfilled potential is frustrating to watch — for you and for the women around you.",
      Serious: "Low value signals that you're not a serious option for long-term attraction.",
      Critical: "Without purpose and progress, you have nothing sustainable to offer.",
    },
    why: "Value is what you bring beyond your presence. It's your ambition, your growth, your direction.",
    bestAction: "Spend 1 hour today working on your most important personal goal. No distractions.",
    actions: [
      "Define your top 3 goals for the next 12 months. Write them down and review weekly.",
      "Invest in one skill that will increase your income or personal growth.",
      "Replace 1 hour of daily screen time with something that builds your future.",
    ],
    avoids: [
      "Spending all your free time on entertainment with nothing to show for it.",
      "Talking about what you're going to do instead of doing it.",
      "Neglecting your career, finances, or health while chasing women.",
    ],
    copyScript: "I build my value every day. My life is the offer.",
  },
  sexuality: {
    shortTips: {
      OK: "Your sexual energy is natural and well-calibrated. Women feel it.",
      Watch: "Your sexual presence is muted. You're not creating enough tension.",
      Serious: "You lack sexual confidence. It shows in how you carry yourself.",
      Critical: "Sexual energy is completely absent. This dimension needs real work.",
    },
    impactHints: {
      OK: "Calibrated sexual energy creates the tension that turns interest into desire.",
      Watch: "Without enough tension, you end up in the friend zone every time.",
      Serious: "Lacking sexual confidence makes physical escalation feel impossible.",
      Critical: "Without any sexual polarity, romantic attraction cannot develop.",
    },
    why: "Sexual energy is the unspoken current that separates a friend from a potential lover.",
    bestAction: "Work on your physicality today — train your body and practice relaxed, grounded body language.",
    actions: [
      "Build a consistent workout routine. Physical confidence feeds sexual confidence.",
      "Practice holding comfortable eye contact with women a beat longer than usual.",
      "Learn to be comfortable with silence and tension — don't rush to fill every gap.",
    ],
    avoids: [
      "Being overly sexual too early — it repels instead of attracting.",
      "Suppressing all sexual energy to seem 'safe' — it reads as weak.",
      "Consuming content that distorts your understanding of real intimacy.",
    ],
    copyScript: "I embrace my masculine energy. I create tension without forcing it.",
  },
};

function getMissions(topTwo, sectionScores) {
  const missionBank = {
    confidence: [
      {
        title: "The Mirror Test",
        level: "Easy",
        durationMinutes: 10,
        goal: "Build raw self-comfort and unshakable presence.",
        howTo: ["Stand in front of a mirror for 2 minutes, maintaining eye contact with yourself.", "Notice the urge to look away. Stay with it.", "Repeat a statement you believe about yourself out loud."],
        exampleLine: "I am here. I am solid. I don't need to prove anything.",
        whyItHelps: "Mirror exposure builds the comfort with yourself that others instinctively sense as confidence.",
      },
      {
        title: "The Eye Contact Challenge",
        level: "Medium",
        durationMinutes: 15,
        goal: "Develop the ability to hold presence in social situations.",
        howTo: ["Go to a public space — coffee shop, gym, street.", "Hold eye contact with 3 strangers until they look away first.", "Give a slight nod or smile. No words needed."],
        exampleLine: "Lock eyes, hold, nod. That's the whole mission.",
        whyItHelps: "Eye contact is the most primal signal of confidence. Mastering it changes how people perceive you instantly.",
      },
    ],
    style: [
      {
        title: "The Outfit Audit",
        level: "Easy",
        durationMinutes: 15,
        goal: "See your style through the eyes of someone meeting you for the first time.",
        howTo: ["Take a full-body photo of your outfit before leaving the house.", "Ask yourself: would I swipe right on this person?", "Identify one thing to upgrade — shoes, fit, colors."],
        exampleLine: "If the answer is 'meh,' that's your sign to change before you walk out.",
        whyItHelps: "Self-awareness about your appearance is the first step. You can't fix what you don't see.",
      },
      {
        title: "The Comfort Zone Fit",
        level: "Medium",
        durationMinutes: 30,
        goal: "Expand your style range and discover what makes you feel powerful.",
        howTo: ["Go to a store and try on 3 items you would never normally pick.", "Take photos. Notice how different clothes change how you carry yourself.", "Buy one piece that surprised you."],
        exampleLine: "That jacket felt weird at first. Then I saw myself in it and thought — yeah, this is it.",
        whyItHelps: "Style breakthroughs happen outside your comfort zone. The best looks are often the ones you'd never have guessed.",
      },
    ],
    social: [
      {
        title: "The Cold Open",
        level: "Easy",
        durationMinutes: 10,
        goal: "Build the habit of initiating conversations with zero stakes.",
        howTo: ["Start a conversation with someone new today — barista, person in line, coworker.", "No agenda. Just be human and curious.", "Notice how it feels to initiate without needing anything."],
        exampleLine: "Hey, I like your coffee order — what is that? Simple. Human. Done.",
        whyItHelps: "Social muscles grow through use. Every low-stakes conversation makes the high-stakes ones easier.",
      },
      {
        title: "The Plan Maker",
        level: "Medium",
        durationMinutes: 20,
        goal: "Become the person who creates experiences, not the one who waits for invitations.",
        howTo: ["Plan an activity for this weekend — dinner, hike, game night, anything.", "Invite at least 2 people. Be specific about time and place.", "Show up and be the host energy."],
        exampleLine: "Saturday, 7pm, that new spot downtown. You in? That's all it takes.",
        whyItHelps: "Leaders create plans. Followers wait. Women are naturally drawn to men who create momentum.",
      },
    ],
    communication: [
      {
        title: "The Curious Listener",
        level: "Easy",
        durationMinutes: 15,
        goal: "Shift from performing to connecting in conversation.",
        howTo: ["In your next conversation with a woman, focus entirely on asking questions.", "Listen to understand, not to formulate your next line.", "Ask one follow-up question that shows you actually heard her."],
        exampleLine: "Wait — you said you almost moved to Barcelona. What stopped you?",
        whyItHelps: "Most men talk to impress. Listening to understand is rare and deeply attractive.",
      },
      {
        title: "The 2-Minute Story",
        level: "Medium",
        durationMinutes: 15,
        goal: "Learn to tell engaging stories that create emotional connection.",
        howTo: ["Pick a recent experience — funny, awkward, surprising.", "Tell it to a friend in under 2 minutes. Hit the punchline.", "Watch their reaction. Adjust and try again."],
        exampleLine: "So I'm standing in the rain, locked out, in a towel — and my neighbor walks by with her dog...",
        whyItHelps: "Storytelling is how humans bond. A man who can tell a great story is a man people want around.",
      },
    ],
    mentality: [
      {
        title: "The Pride List",
        level: "Easy",
        durationMinutes: 10,
        goal: "Reconnect with your own value and quiet the inner critic.",
        howTo: ["Write down 3 things you are genuinely proud of.", "Not for social media, not for anyone else. For you.", "Read them out loud. Let them land."],
        exampleLine: "I'm proud that I kept going when it would have been easier to quit.",
        whyItHelps: "Self-worth is the antidote to neediness. When you know your value, you stop seeking it from others.",
      },
      {
        title: "The Belief Flip",
        level: "Deep",
        durationMinutes: 20,
        goal: "Identify and dismantle one limiting belief that's running your dating life.",
        howTo: ["Write down one belief you hold about dating that holds you back.", "Example: 'Women like me don't attract baddies.'", "Write the exact opposite. Find one piece of evidence that supports the new belief."],
        exampleLine: "Old: 'I'm not the type women chase.' New: 'I haven't given them a reason to — yet.'",
        whyItHelps: "Beliefs drive behavior. Change the belief, and the behavior follows automatically.",
      },
    ],
    value: [
      {
        title: "The Deep Work Hour",
        level: "Medium",
        durationMinutes: 60,
        goal: "Prove to yourself that you can focus and build something that matters.",
        howTo: ["Block 1 hour today. Phone on airplane mode.", "Work on your most important personal or professional goal.", "When the hour is done, notice how you feel."],
        exampleLine: "One hour. No notifications. Just you and the work. That's it.",
        whyItHelps: "Purpose is the ultimate attractor. A man building something meaningful doesn't need to chase — he draws people in.",
      },
      {
        title: "The Screen Time Swap",
        level: "Easy",
        durationMinutes: 30,
        goal: "Reclaim wasted time and redirect it toward growth.",
        howTo: ["Check your screen time right now.", "Identify 30 minutes of mindless scrolling.", "Replace it today with reading, working out, or building a skill."],
        exampleLine: "Yesterday: 2 hours on Instagram. Today: 1 hour 30 and a chapter of that book.",
        whyItHelps: "Small daily swaps compound into a completely different life in 6 months.",
      },
    ],
    sexuality: [
      {
        title: "The Physical Edge",
        level: "Medium",
        durationMinutes: 45,
        goal: "Build the physical confidence that fuels sexual presence.",
        howTo: ["Work out today with full intention — feel every rep, every movement.", "Focus on exercises that build posture and presence: deadlifts, rows, shoulder press.", "After the workout, stand tall and notice how your body feels."],
        exampleLine: "Train like the version of you that a baddie would double-take for.",
        whyItHelps: "Physical training builds embodied confidence that women sense before you say a word.",
      },
      {
        title: "The Tension Practice",
        level: "Deep",
        durationMinutes: 15,
        goal: "Learn to create and hold romantic tension without forcing it.",
        howTo: ["In your next interaction with a woman, practice relaxed body language.", "Slow down your movements. Speak a touch slower. Hold pauses.", "Don't rush to fill silence — let the tension exist."],
        exampleLine: "She said something funny. Instead of laughing immediately, hold the eye contact for one extra beat. Then smile.",
        whyItHelps: "Sexual tension is not about what you do — it's about what you don't do. Comfort with the pause is everything.",
      },
    ],
  };

  const missions = [];
  for (const { key } of topTwo) {
    const bank = missionBank[key] || [];
    missions.push(...bank);
  }
  if (missions.length < 3) {
    for (const k of categoryKeys) {
      if (missions.length >= 5) break;
      if (topTwo.some((t) => t.key === k)) continue;
      const bank = missionBank[k] || [];
      if (bank[0]) missions.push(bank[0]);
    }
  }
  return missions.slice(0, 5);
}

// ── Tier-aware hero and diagnosis ──

function getHeroForTier(tier, globalScore, topTwo) {
  const top1 = categoryLabels[topTwo[0]?.key] || "Your profile";
  const top2 = categoryLabels[topTwo[1]?.key] || "overall readiness";

  if (tier.mode === "celebration") {
    return {
      title: tier.title,
      riskLabel: null,
      oneLineDiagnosis: `You're already a magnet. ${top1} and ${top2} are your superpowers.`,
    };
  }

  if (tier.mode === "growth") {
    return {
      title: tier.title,
      riskLabel: getRiskLabel(100 - globalScore),
      oneLineDiagnosis: `${top1} and ${top2} are the two areas to focus on for the biggest upgrade.`,
    };
  }

  // alert or critical
  return {
    title: tier.title,
    riskLabel: getRiskLabel(100 - globalScore),
    oneLineDiagnosis: `${top1} and ${top2} need urgent attention. Time to get serious.`,
  };
}

function getNextStepsForTier(tier) {
  if (tier.mode === "celebration") {
    return {
      primaryCTA: "Share your results",
      secondaryCTA: "Unlock full Baddie Magnet DNA report",
      recheckSuggestion: "Come back in 3 months to track your evolution.",
    };
  }
  if (tier.mode === "growth") {
    return {
      primaryCTA: "Start your first mission tonight",
      secondaryCTA: "Get your full analysis and action plan",
      recheckSuggestion: "Take the quiz again in 4 to 6 weeks after trying the missions.",
    };
  }
  if (tier.mode === "alert") {
    return {
      primaryCTA: "Get your personalized upgrade plan",
      secondaryCTA: "Start with one small step today",
      recheckSuggestion: "Take the quiz again in 3 to 4 weeks. Every small change counts.",
    };
  }
  // critical
  return {
    primaryCTA: "Commit to the 7-day challenge",
    secondaryCTA: "Every legend started at zero",
    recheckSuggestion: "Take the quiz again in 2 weeks. Momentum is everything.",
  };
}

export function generatePremiumContent({ breakupScore, sectionScores, userDob, partnerDob, userName, partnerName }) {
  const globalScore = getGlobalScore(sectionScores);
  const tier = getTier(globalScore);

  // In celebration mode, show strengths. In growth/alert, show weaknesses.
  const topTwo = tier.mode === "celebration"
    ? getTopTwoStrengths(sectionScores)
    : getTopTwo(sectionScores);

  const hero = getHeroForTier(tier, globalScore, topTwo);

  const topCategory = topTwo[0];
  const topContent = categoryContent[topCategory.key];
  const topLever = tier.mode === "celebration"
    ? {
        leverName: categoryLabels[topCategory.key],
        why: `${categoryLabels[topCategory.key]} is one of your greatest strengths. This is what makes you magnetic.`,
        bestAction: "Keep investing in what's working. Small daily habits protect a strong foundation.",
      }
    : {
        leverName: categoryLabels[topCategory.key],
        why: topContent.why,
        bestAction: topContent.bestAction,
      };

  const cardsEnhancements = {};
  for (const key of categoryKeys) {
    const level = getLevel(sectionScores[key] || 0);
    const content = categoryContent[key];
    cardsEnhancements[key] = {
      shortTip: content.shortTips[level],
      impactHint: content.impactHints[level],
      level,
    };
  }

  const actionPlan = topTwo.map(({ key }) => {
    const content = categoryContent[key];
    return {
      category: categoryLabels[key],
      categoryKey: key,
      do: content.actions,
      avoid: content.avoids,
      copyScript: content.copyScript,
    };
  });

  const missions = getMissions(topTwo, sectionScores);
  const archetype = getArchetype(sectionScores);

  // No astro compatibility for BaddieMagnet
  const astro = null;

  // Projection: always compute
  const seed = buildSeed({ userName });
  const projection = getBreakupEstimate(breakupScore, seed);

  const weekPlan = get7DayPlan(topTwo.map((t) => t.key));
  const nextSteps = getNextStepsForTier(tier);

  return {
    hero,
    topLever,
    cardsEnhancements,
    actionPlan,
    missions,
    projection,
    weekPlan,
    archetype,
    astro,
    nextSteps,
    tier: {
      id: tier.id,
      mode: tier.mode,
      color: tier.color,
      tone: tier.tone,
      funnelStrategy: tier.funnelStrategy,
    },
  };
}
