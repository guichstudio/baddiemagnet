// Question types:
// "mcq"       — 4-5 choices, pick one
// "slider"    — 0-10 draggable slider
// "statement" — agree statement: Yes / Sometimes / No
// "ranking"   — drag/reorder 4 items
// "visual"    — emoji/icon grid picker
// "fillin"    — complete the sentence (chip options)
// "binary"    — 2 big buttons with icons
// "scale"     — horizontal 1-5 dots with labels
//
// Every question produces { value: 1-5 } for scoring.
// 7 dimensions: CON, STY, SOC, COM, MEN, VAL, SEX — 6 questions each = 42
// + 2 context questions (not scored) = 44 total

const sections = {
  CON: "confidence",
  STY: "style",
  SOC: "social",
  COM: "communication",
  MEN: "mentality",
  VAL: "value",
  SEX: "sexuality",
};

const questions = [
  // ──────────────── CONTEXT (2) ────────────────

  // 1 — mcq (context)
  {
    id: 1,
    type: "mcq",
    text: "How old are you?",
    section: "context",
    weight: 0,
    direction: "positive",
    options: [
      { label: "18-21", value: 1 },
      { label: "22-25", value: 2 },
      { label: "26-30", value: 3 },
      { label: "30-45", value: 4 },
      { label: "45+", value: 5 },
    ],
    frameworks: [],
    breakup_risk: 0,
    tags: ["context", "age"],
    cross: {},
  },

  // 2 — mcq (context)
  {
    id: 2,
    type: "mcq",
    text: "What's your current situation?",
    section: "context",
    weight: 0,
    direction: "positive",
    options: [
      { label: "Single, never had a girlfriend", value: 1 },
      { label: "Single, post-breakup", value: 2 },
      { label: "It's complicated", value: 3 },
      { label: "In a relationship but unsatisfied", value: 4 },
    ],
    frameworks: [],
    breakup_risk: 0,
    tags: ["context", "situation"],
    cross: {},
  },

  // ──────────────── CONFIDENCE (6) ────────────────

  // 3 — mcq
  {
    id: 3,
    type: "mcq",
    text: "You walk into a party where you don't know a single person. What do you do?",
    section: sections.CON,
    weight: 3,
    direction: "positive",
    options: [
      { label: "Walk up to the most attractive group and introduce myself", value: 1 },
      { label: "Find someone standing alone and start a conversation", value: 2 },
      { label: "Grab a drink and wait for someone to approach me", value: 3 },
      { label: "Stay on my phone until someone I know shows up", value: 4 },
      { label: "Honestly? I probably wouldn't go in the first place", value: 5 },
    ],
    frameworks: ["confidence_theory", "social_psychology"],
    breakup_risk: 0.8,
    tags: ["social_initiative", "boldness"],
    cross: { social: 0.4 },
  },

  // 4 — scale
  {
    id: 4,
    type: "scale",
    text: "How comfortable are you holding eye contact with a beautiful woman who's looking right at you?",
    section: sections.CON,
    weight: 3,
    direction: "negative",
    scaleLabels: ["I look away instantly", "Uncomfortable", "Depends on the day", "Pretty comfortable", "I lock in and smile"],
    frameworks: ["confidence_theory", "attraction_science"],
    breakup_risk: 0.7,
    tags: ["eye_contact", "presence"],
    cross: { sexuality: 0.3 },
  },

  // 5 — statement
  {
    id: 5,
    type: "statement",
    text: "Do you recognize yourself in this statement?",
    statement: "I sometimes feel like I'm not good enough for the women I'm actually attracted to.",
    section: sections.CON,
    weight: 3,
    direction: "positive",
    frameworks: ["confidence_theory", "attraction_science"],
    breakup_risk: 0.9,
    tags: ["self_worth", "limiting_beliefs"],
    cross: { mentality: 0.4 },
  },

  // 6 — slider
  {
    id: 6,
    type: "slider",
    text: "How often do you second-guess yourself after making a decision?",
    section: sections.CON,
    weight: 2,
    direction: "positive",
    sliderLeft: "Never",
    sliderRight: "Every single time",
    frameworks: ["confidence_theory", "masculinity"],
    breakup_risk: 0.5,
    tags: ["decisiveness", "self_trust"],
    cross: { mentality: 0.3 },
  },

  // 7 — visual
  {
    id: 7,
    type: "visual",
    text: "A girl you're into starts talking to another guy at the bar. What's your energy?",
    section: sections.CON,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Unbothered king", emoji: "👑", value: 1 },
      { label: "Slightly annoyed", emoji: "😒", value: 2 },
      { label: "Watching closely", emoji: "👀", value: 3 },
      { label: "Jealous spiral", emoji: "😤", value: 4 },
      { label: "I already left", emoji: "🚪", value: 5 },
    ],
    frameworks: ["confidence_theory", "attraction_science"],
    breakup_risk: 0.6,
    tags: ["jealousy", "security"],
    cross: { mentality: 0.3, social: 0.2 },
  },

  // 8 — binary
  {
    id: 8,
    type: "binary",
    text: "Could you walk up to a stranger and start a conversation with zero hesitation?",
    section: sections.CON,
    weight: 2,
    direction: "negative",
    options: [
      { label: "Without thinking twice", icon: "💯", value: 1 },
      { label: "Nah, I'd overthink it", icon: "😬", value: 5 },
    ],
    frameworks: ["confidence_theory", "social_psychology"],
    breakup_risk: 0.6,
    tags: ["approach", "initiative"],
    cross: { communication: 0.3 },
  },

  // ──────────────── STYLE (6) ────────────────

  // 9 — mcq
  {
    id: 9,
    type: "mcq",
    text: "How would your friends honestly describe your style?",
    section: sections.STY,
    weight: 2,
    direction: "positive",
    options: [
      { label: "He always looks put together, like effortlessly clean", value: 1 },
      { label: "He's got his own thing going, it works", value: 2 },
      { label: "Average, nothing special but nothing terrible", value: 3 },
      { label: "He doesn't really try, just throws stuff on", value: 4 },
      { label: "They'd probably roast me honestly", value: 5 },
    ],
    frameworks: ["lifestyle_design", "attraction_science"],
    breakup_risk: 0.4,
    tags: ["fashion", "self_presentation"],
    cross: { confidence: 0.3 },
  },

  // 10 — slider
  {
    id: 10,
    type: "slider",
    text: "How often do you get unsolicited compliments on your appearance or outfit?",
    section: sections.STY,
    weight: 2,
    direction: "negative",
    sliderLeft: "Literally never",
    sliderRight: "All the time",
    frameworks: ["attraction_science", "lifestyle_design"],
    breakup_risk: 0.3,
    tags: ["compliments", "external_validation"],
    cross: { confidence: 0.2 },
  },

  // 11 — visual
  {
    id: 11,
    type: "visual",
    text: "Pick the vibe that best represents your daily style.",
    section: sections.STY,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Clean & sharp", emoji: "🔥", value: 1 },
      { label: "Streetwear drip", emoji: "🧢", value: 2 },
      { label: "Casual comfort", emoji: "👟", value: 3 },
      { label: "Whatever's clean", emoji: "🤷", value: 4 },
      { label: "Gym clothes 24/7", emoji: "🩳", value: 5 },
    ],
    frameworks: ["lifestyle_design", "attraction_science"],
    breakup_risk: 0.3,
    tags: ["aesthetic", "identity"],
    cross: {},
  },

  // 12 — scale
  {
    id: 12,
    type: "scale",
    text: "How much attention do you pay to grooming (skincare, haircut, nails, fragrance)?",
    section: sections.STY,
    weight: 3,
    direction: "negative",
    scaleLabels: ["Zero effort", "Basic hygiene only", "Some effort", "Solid routine", "Dialed in completely"],
    frameworks: ["lifestyle_design", "attraction_science"],
    breakup_risk: 0.5,
    tags: ["grooming", "self_care"],
    cross: { value: 0.2 },
  },

  // 13 — fillin
  {
    id: 13,
    type: "fillin",
    text: "Complete this sentence:",
    stem: "When I look in the mirror before going out, I think ___",
    section: sections.STY,
    weight: 2,
    direction: "positive",
    options: [
      { label: "damn, I look good", value: 1 },
      { label: "yeah, this works", value: 2 },
      { label: "it's fine I guess", value: 3 },
      { label: "I should probably try harder", value: 4 },
      { label: "I avoid mirrors honestly", value: 5 },
    ],
    frameworks: ["confidence_theory", "lifestyle_design"],
    breakup_risk: 0.4,
    tags: ["self_image", "mirror_test"],
    cross: { confidence: 0.4 },
  },

  // 14 — ranking
  {
    id: 14,
    type: "ranking",
    text: "Rank these from most to least important in your daily routine:",
    section: sections.STY,
    weight: 2,
    direction: "positive",
    items: [
      { id: "outfit", label: "Picking the right outfit", signal: 1 },
      { id: "hair", label: "Hair and grooming", signal: 2 },
      { id: "fragrance", label: "Wearing a good fragrance", signal: 3 },
      { id: "none", label: "I don't think about any of this", signal: 5 },
    ],
    frameworks: ["lifestyle_design"],
    breakup_risk: 0.3,
    tags: ["routine", "priorities"],
    cross: { value: 0.2 },
  },

  // ──────────────── SOCIAL (6) ────────────────

  // 15 — mcq
  {
    id: 15,
    type: "mcq",
    text: "It's Friday night. Where are you most likely?",
    section: sections.SOC,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Out with my crew, we always have plans", value: 1 },
      { label: "At an event, networking or meeting new people", value: 1 },
      { label: "Chilling at a friend's place, small group", value: 2 },
      { label: "Home gaming or watching something alone", value: 4 },
      { label: "Scrolling my phone in bed wishing I had plans", value: 5 },
    ],
    frameworks: ["social_psychology", "lifestyle_design"],
    breakup_risk: 0.5,
    tags: ["social_life", "weekends"],
    cross: { value: 0.2 },
  },

  // 16 — scale
  {
    id: 16,
    type: "scale",
    text: "How many close friends could you call at 2 AM if you needed them?",
    section: sections.SOC,
    weight: 2,
    direction: "negative",
    scaleLabels: ["Zero", "Maybe one", "Two or three", "A solid group", "I'm never without people"],
    frameworks: ["social_psychology", "lifestyle_design"],
    breakup_risk: 0.4,
    tags: ["inner_circle", "loyalty"],
    cross: { mentality: 0.2 },
  },

  // 17 — slider
  {
    id: 17,
    type: "slider",
    text: "When you're in a group, how naturally do you become the center of attention?",
    section: sections.SOC,
    weight: 2,
    direction: "negative",
    sliderLeft: "I fade into the background",
    sliderRight: "I naturally take over the room",
    frameworks: ["social_psychology", "confidence_theory"],
    breakup_risk: 0.5,
    tags: ["social_dominance", "charisma"],
    cross: { confidence: 0.4, communication: 0.2 },
  },

  // 18 — statement
  {
    id: 18,
    type: "statement",
    text: "Do you recognize yourself in this statement?",
    statement: "I often feel like I'm on the outside looking in when I'm in social situations.",
    section: sections.SOC,
    weight: 3,
    direction: "positive",
    frameworks: ["social_psychology", "confidence_theory"],
    breakup_risk: 0.7,
    tags: ["belonging", "isolation"],
    cross: { confidence: 0.3, mentality: 0.2 },
  },

  // 19 — visual
  {
    id: 19,
    type: "visual",
    text: "At a house party, which role do you naturally play?",
    section: sections.SOC,
    weight: 2,
    direction: "positive",
    options: [
      { label: "The host energy", emoji: "🎤", value: 1 },
      { label: "The connector", emoji: "🤝", value: 1 },
      { label: "The funny one", emoji: "😂", value: 2 },
      { label: "The quiet observer", emoji: "🧐", value: 4 },
      { label: "The phone zombie", emoji: "📱", value: 5 },
    ],
    frameworks: ["social_psychology", "attraction_science"],
    breakup_risk: 0.5,
    tags: ["social_role", "party_dynamic"],
    cross: { confidence: 0.2 },
  },

  // 20 — binary
  {
    id: 20,
    type: "binary",
    text: "Could you go to a bar alone and leave with new contacts in your phone?",
    section: sections.SOC,
    weight: 2,
    direction: "negative",
    options: [
      { label: "Easy, done it before", icon: "📲", value: 1 },
      { label: "No way, that's terrifying", icon: "😰", value: 5 },
    ],
    frameworks: ["social_psychology", "confidence_theory"],
    breakup_risk: 0.6,
    tags: ["solo_social", "approach_ability"],
    cross: { confidence: 0.4 },
  },

  // ──────────────── COMMUNICATION (6) ────────────────

  // 21 — mcq
  {
    id: 21,
    type: "mcq",
    text: "A girl you like leaves you on read. What's your move?",
    section: sections.COM,
    weight: 3,
    direction: "positive",
    options: [
      { label: "I move on, if she's interested she'll reply", value: 1 },
      { label: "I wait a few days then send something casual", value: 2 },
      { label: "I double text within 24 hours", value: 3 },
      { label: "I send multiple follow-ups trying to get her attention", value: 4 },
      { label: "I get anxious and check if she's been online", value: 5 },
    ],
    frameworks: ["communication_skills", "attraction_science"],
    breakup_risk: 0.7,
    tags: ["texting", "neediness"],
    cross: { confidence: 0.4, mentality: 0.3 },
  },

  // 22 — slider
  {
    id: 22,
    type: "slider",
    text: "How often do you make people genuinely laugh in conversation?",
    section: sections.COM,
    weight: 2,
    direction: "negative",
    sliderLeft: "Almost never",
    sliderRight: "I'm naturally hilarious",
    frameworks: ["communication_skills", "social_psychology"],
    breakup_risk: 0.4,
    tags: ["humor", "wit"],
    cross: { social: 0.3 },
  },

  // 23 — scale
  {
    id: 23,
    type: "scale",
    text: "How good are you at reading a woman's body language and knowing if she's interested?",
    section: sections.COM,
    weight: 3,
    direction: "negative",
    scaleLabels: ["Completely clueless", "Miss most signals", "Catch some", "Pretty sharp", "I read people like a book"],
    frameworks: ["communication_skills", "attraction_science"],
    breakup_risk: 0.6,
    tags: ["body_language", "social_awareness"],
    cross: { social: 0.2, sexuality: 0.3 },
  },

  // 24 — fillin
  {
    id: 24,
    type: "fillin",
    text: "Complete this sentence:",
    stem: "When I'm talking to a woman I find attractive, I usually ___",
    section: sections.COM,
    weight: 3,
    direction: "positive",
    options: [
      { label: "keep it smooth, playful, and natural", value: 1 },
      { label: "hold my own but it takes a minute to warm up", value: 2 },
      { label: "get a bit nervous but push through", value: 3 },
      { label: "overthink everything I'm about to say", value: 4 },
      { label: "freeze up or go completely blank", value: 5 },
    ],
    frameworks: ["communication_skills", "confidence_theory"],
    breakup_risk: 0.7,
    tags: ["conversation", "composure"],
    cross: { confidence: 0.4 },
  },

  // 25 — visual
  {
    id: 25,
    type: "visual",
    text: "How would you describe your texting game?",
    section: sections.COM,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Smooth operator", emoji: "😏", value: 1 },
      { label: "Solid but simple", emoji: "👍", value: 2 },
      { label: "Hit or miss", emoji: "🎲", value: 3 },
      { label: "Dry texter", emoji: "🏜️", value: 4 },
      { label: "Left on read specialist", emoji: "💀", value: 5 },
    ],
    frameworks: ["communication_skills", "attraction_science"],
    breakup_risk: 0.5,
    tags: ["texting_game", "digital_communication"],
    cross: {},
  },

  // 26 — ranking
  {
    id: 26,
    type: "ranking",
    text: "Rank what matters most in a conversation with a woman you're interested in:",
    section: sections.COM,
    weight: 2,
    direction: "positive",
    items: [
      { id: "listen", label: "Actually listening to what she says", signal: 1 },
      { id: "funny", label: "Making her laugh", signal: 2 },
      { id: "impress", label: "Impressing her with your achievements", signal: 4 },
      { id: "agree", label: "Agreeing with everything she says", signal: 5 },
    ],
    frameworks: ["communication_skills", "attraction_science"],
    breakup_risk: 0.5,
    tags: ["conversation_priorities", "game"],
    cross: { mentality: 0.2 },
  },

  // ──────────────── MENTALITY (6) ────────────────

  // 27 — mcq
  {
    id: 27,
    type: "mcq",
    text: "You get rejected hard by a girl you really liked. What happens next?",
    section: sections.MEN,
    weight: 3,
    direction: "positive",
    options: [
      { label: "I shrug it off, her loss, on to the next", value: 1 },
      { label: "Stings for a bit but I bounce back fast", value: 2 },
      { label: "I replay everything trying to figure out what went wrong", value: 3 },
      { label: "It wrecks my confidence for weeks", value: 4 },
      { label: "I stop trying altogether for a long time", value: 5 },
    ],
    frameworks: ["confidence_theory", "masculinity"],
    breakup_risk: 0.8,
    tags: ["resilience", "rejection"],
    cross: { confidence: 0.5 },
  },

  // 28 — statement
  {
    id: 28,
    type: "statement",
    text: "Do you recognize yourself in this statement?",
    statement: "I need to be in a relationship to feel like my life is complete.",
    section: sections.MEN,
    weight: 3,
    direction: "positive",
    frameworks: ["masculinity", "confidence_theory"],
    breakup_risk: 0.8,
    tags: ["codependency", "validation_seeking"],
    cross: { confidence: 0.3, value: 0.3 },
  },

  // 29 — scale
  {
    id: 29,
    type: "scale",
    text: "How much do you compare yourself to other men on social media?",
    section: sections.MEN,
    weight: 2,
    direction: "positive",
    scaleLabels: ["Never", "Rarely", "Sometimes", "Often", "It consumes me"],
    frameworks: ["confidence_theory", "social_psychology"],
    breakup_risk: 0.5,
    tags: ["comparison", "social_media"],
    cross: { confidence: 0.3 },
  },

  // 30 — binary
  {
    id: 30,
    type: "binary",
    text: "Do you change who you are to make a girl like you?",
    section: sections.MEN,
    weight: 3,
    direction: "positive",
    options: [
      { label: "Never, take me or leave me", icon: "🪨", value: 1 },
      { label: "Yeah, I adapt to what she wants", icon: "🎭", value: 5 },
    ],
    frameworks: ["masculinity", "confidence_theory"],
    breakup_risk: 0.7,
    tags: ["authenticity", "people_pleasing"],
    cross: { confidence: 0.4, value: 0.2 },
  },

  // 31 — slider
  {
    id: 31,
    type: "slider",
    text: "How much does a woman's opinion of you affect your mood for the rest of the day?",
    section: sections.MEN,
    weight: 2,
    direction: "positive",
    sliderLeft: "Not at all",
    sliderRight: "It controls my entire mood",
    frameworks: ["confidence_theory", "masculinity"],
    breakup_risk: 0.6,
    tags: ["emotional_dependency", "external_validation"],
    cross: { confidence: 0.3 },
  },

  // 32 — visual
  {
    id: 32,
    type: "visual",
    text: "Your ex posts a story with a new guy. What's your honest reaction?",
    section: sections.MEN,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Good for her", emoji: "😌", value: 1 },
      { label: "Slight sting", emoji: "😐", value: 2 },
      { label: "Stalking his profile", emoji: "🔍", value: 3 },
      { label: "Burning inside", emoji: "🔥", value: 4 },
      { label: "Emotional breakdown", emoji: "😭", value: 5 },
    ],
    frameworks: ["confidence_theory", "masculinity"],
    breakup_risk: 0.6,
    tags: ["moving_on", "emotional_control"],
    cross: { confidence: 0.2 },
  },

  // ──────────────── VALUE (6) ────────────────

  // 33 — mcq
  {
    id: 33,
    type: "mcq",
    text: "What are you most proud of in your life right now?",
    section: sections.VAL,
    weight: 3,
    direction: "positive",
    options: [
      { label: "My career/business is taking off", value: 1 },
      { label: "My fitness and discipline are on point", value: 1 },
      { label: "I'm actively building toward something big", value: 2 },
      { label: "I'm figuring things out, nothing concrete yet", value: 3 },
      { label: "Honestly, I don't have much going on", value: 5 },
    ],
    frameworks: ["lifestyle_design", "masculinity"],
    breakup_risk: 0.7,
    tags: ["purpose", "achievement"],
    cross: { confidence: 0.3, mentality: 0.2 },
  },

  // 34 — scale
  {
    id: 34,
    type: "scale",
    text: "How would you rate your current ambition level?",
    section: sections.VAL,
    weight: 3,
    direction: "negative",
    scaleLabels: ["Completely lost", "Coasting", "Moderate drive", "Hungry", "Obsessively driven"],
    frameworks: ["lifestyle_design", "masculinity"],
    breakup_risk: 0.6,
    tags: ["ambition", "drive"],
    cross: { mentality: 0.3 },
  },

  // 35 — slider
  {
    id: 35,
    type: "slider",
    text: "How consistently do you work on your physical fitness?",
    section: sections.VAL,
    weight: 2,
    direction: "negative",
    sliderLeft: "Haven't exercised in months",
    sliderRight: "I train religiously",
    frameworks: ["lifestyle_design", "attraction_science"],
    breakup_risk: 0.4,
    tags: ["fitness", "discipline"],
    cross: { style: 0.2, confidence: 0.2 },
  },

  // 36 — fillin
  {
    id: 36,
    type: "fillin",
    text: "Complete this sentence:",
    stem: "If a baddie asked me what I'm passionate about, I'd say ___",
    section: sections.VAL,
    weight: 2,
    direction: "positive",
    options: [
      { label: "I'd talk for hours, I have real passions", value: 1 },
      { label: "I've got a couple things I'm into", value: 2 },
      { label: "I'd probably mention something generic", value: 3 },
      { label: "I'd struggle to name something real", value: 4 },
      { label: "I'd go blank, I don't really have any", value: 5 },
    ],
    frameworks: ["lifestyle_design", "attraction_science"],
    breakup_risk: 0.6,
    tags: ["passion", "depth"],
    cross: { communication: 0.2 },
  },

  // 37 — visual
  {
    id: 37,
    type: "visual",
    text: "What does your current financial situation look like?",
    section: sections.VAL,
    weight: 2,
    direction: "positive",
    options: [
      { label: "Building wealth", emoji: "📈", value: 1 },
      { label: "Stable income", emoji: "💰", value: 2 },
      { label: "Getting by", emoji: "😐", value: 3 },
      { label: "Struggling", emoji: "😰", value: 4 },
      { label: "Broke and stuck", emoji: "📉", value: 5 },
    ],
    frameworks: ["lifestyle_design"],
    breakup_risk: 0.5,
    tags: ["finances", "stability"],
    cross: { mentality: 0.2 },
  },

  // 38 — statement
  {
    id: 38,
    type: "statement",
    text: "Do you recognize yourself in this statement?",
    statement: "I spend more time consuming content about success than actually working toward it.",
    section: sections.VAL,
    weight: 2,
    direction: "positive",
    frameworks: ["lifestyle_design", "masculinity"],
    breakup_risk: 0.5,
    tags: ["action_vs_consumption", "productivity"],
    cross: { mentality: 0.3 },
  },

  // ──────────────── SEXUALITY (6) ────────────────

  // 39 — scale
  {
    id: 39,
    type: "scale",
    text: "How comfortable are you initiating physical contact (touch on the arm, pulling her close)?",
    section: sections.SEX,
    weight: 3,
    direction: "negative",
    scaleLabels: ["Terrified to touch", "Very hesitant", "Depends on signals", "Fairly natural", "I escalate smoothly"],
    frameworks: ["sexual_polarity", "attraction_science"],
    breakup_risk: 0.7,
    tags: ["physical_escalation", "touch"],
    cross: { confidence: 0.4 },
  },

  // 40 — mcq
  {
    id: 40,
    type: "mcq",
    text: "How would you describe the sexual tension you create with women you're attracted to?",
    section: sections.SEX,
    weight: 3,
    direction: "positive",
    options: [
      { label: "It's thick, she can feel it without me saying a word", value: 1 },
      { label: "I can build it when I'm in the zone", value: 2 },
      { label: "Sometimes it's there, sometimes it's friend-zone energy", value: 3 },
      { label: "I default to being overly friendly and safe", value: 4 },
      { label: "What tension? I don't know how to create it", value: 5 },
    ],
    frameworks: ["sexual_polarity", "attraction_science"],
    breakup_risk: 0.8,
    tags: ["tension", "polarity"],
    cross: { confidence: 0.3, communication: 0.2 },
  },

  // 41 — slider
  {
    id: 41,
    type: "slider",
    text: "How confident are you in your ability to satisfy a woman sexually?",
    section: sections.SEX,
    weight: 2,
    direction: "negative",
    sliderLeft: "Not confident at all",
    sliderRight: "Extremely confident",
    frameworks: ["sexual_polarity", "confidence_theory"],
    breakup_risk: 0.6,
    tags: ["sexual_confidence", "performance"],
    cross: { confidence: 0.3 },
  },

  // 42 — visual
  {
    id: 42,
    type: "visual",
    text: "A woman gives you clear signals she's interested. What's your move?",
    section: sections.SEX,
    weight: 3,
    direction: "positive",
    options: [
      { label: "Escalate naturally", emoji: "😏", value: 1 },
      { label: "Flirt back verbally", emoji: "💬", value: 2 },
      { label: "Wait for more signals", emoji: "🤔", value: 3 },
      { label: "Freeze up inside", emoji: "🥶", value: 4 },
      { label: "Convince myself I misread it", emoji: "🙃", value: 5 },
    ],
    frameworks: ["sexual_polarity", "confidence_theory"],
    breakup_risk: 0.7,
    tags: ["signal_response", "escalation"],
    cross: { confidence: 0.3, communication: 0.2 },
  },

  // 43 — statement
  {
    id: 43,
    type: "statement",
    text: "Do you recognize yourself in this statement?",
    statement: "I tend to put women on a pedestal and treat attraction like something I need to earn rather than something mutual.",
    section: sections.SEX,
    weight: 3,
    direction: "positive",
    frameworks: ["sexual_polarity", "masculinity"],
    breakup_risk: 0.8,
    tags: ["pedestal", "power_dynamic"],
    cross: { mentality: 0.4, confidence: 0.3 },
  },

  // 44 — ranking
  {
    id: 44,
    type: "ranking",
    text: "Rank what you think creates the most attraction, strongest to weakest:",
    section: sections.SEX,
    weight: 2,
    direction: "positive",
    items: [
      { id: "tension", label: "Unspoken sexual tension and eye contact", signal: 1 },
      { id: "humor", label: "Making her laugh nonstop", signal: 2 },
      { id: "gifts", label: "Buying her things and being generous", signal: 4 },
      { id: "available", label: "Being available whenever she needs me", signal: 5 },
    ],
    frameworks: ["sexual_polarity", "attraction_science"],
    breakup_risk: 0.6,
    tags: ["attraction_beliefs", "polarity"],
    cross: { mentality: 0.3 },
  },
];

export { sections };
export default questions;
