import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CTA_GRADIENT = "linear-gradient(135deg, #EC4899 0%, #F9A857 100%)";
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const slideTransition = {
  x: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  opacity: { duration: 0.25 },
};

/* ───── SVG animated curve for Frame 1 ───── */
function ClarityChart() {
  const path = "M 0 120 C 30 110, 50 95, 80 85 S 130 70, 160 55 S 210 35, 250 30 S 310 18, 350 10";
  const dashPath = "M 0 65 L 350 65";

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
      <div className="flex justify-between text-xs mb-3">
        <span style={{ color: "var(--text-40)" }}>Your readiness level</span>
        <span className="font-medium text-gradient">Projection</span>
      </div>
      <svg viewBox="0 0 350 130" className="w-full h-auto" fill="none">
        <motion.path d={dashPath} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
        <defs>
          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EC4899" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={path + " L 350 130 L 0 130 Z"} fill="url(#curveGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.path d={path} stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} />
        <motion.circle cx="350" cy="10" r="4" fill="#EC4899" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1.4, duration: 0.3 }} />
      </svg>
      <div className="flex justify-between text-[11px] mt-2" style={{ color: "var(--text-40)" }}>
        <span>1D</span><span>7D</span><span>15D</span><span>30D</span><span>66D</span>
      </div>
    </div>
  );
}

/* ───── Frame 1: Intro impact ───── */
function Frame1({ onNext }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-center">
      <div>
        <h1 className="font-heading text-[32px] font-bold leading-tight mb-8" style={{ color: "var(--text-100)" }}>
          After this test, you&apos;ll know exactly where your game stands.
        </h1>
        <ClarityChart />
        <p className="text-base leading-relaxed mt-8" style={{ color: "var(--text-40)" }}>
          Men who take this test gain{" "}
          <span className="font-semibold text-gradient">87% more clarity</span>{" "}
          about their dating potential.
        </p>
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-xl text-white font-semibold text-lg mt-8 btn-gradient">
        Next
      </button>
    </div>
  );
}

/* ───── Frame 2: Key benefits ───── */
const benefits = [
  { icon: "🔥", label: "Overall baddie readiness", value: "87%" },
  { icon: "⚡", label: "Weak spots", value: "Identified" },
  { icon: "📈", label: "Improvement timeline", value: "Estimated" },
  { icon: "🎯", label: "Action steps", value: "Personalized" },
];

function Frame2({ onNext }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-center">
      <div>
        <h1 className="font-heading text-[32px] font-bold leading-tight mb-2" style={{ color: "var(--text-100)" }}>
          This analysis reveals
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--text-40)" }}>
          A complete assessment of your game in just a few minutes.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <motion.div
              key={b.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
            >
              <span className="text-2xl block mb-2">{b.icon}</span>
              <p className="text-xl font-bold text-gradient mb-1">{b.value}</p>
              <p className="text-xs leading-tight" style={{ color: "var(--text-40)" }}>{b.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-xl text-white font-semibold text-lg mt-8 btn-gradient">
        Next
      </button>
    </div>
  );
}

/* ───── Frame 3: Social proof ───── */
function Frame3({ onNext }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-center">
      <div>
        <h1 className="font-heading text-[32px] font-bold leading-tight mb-2" style={{ color: "var(--text-100)" }}>
          Based on thousands of men&apos;s self-assessments
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--text-40)" }}>
          Grounded in attraction psychology research.
        </p>
        <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}>
          <h3 className="font-semibold mb-3" style={{ color: "var(--text-100)" }}>Scientific research</h3>
          <div className="space-y-2.5">
            {[
              { title: "Social psychology & attraction patterns...", source: "socialpsychology.org" },
              { title: "Confidence theory in dating...", source: "psychologytoday.com" },
              { title: "Communication & attraction research...", source: "pubmed.ncbi.nlm.nih.gov" },
            ].map((ref) => (
              <div key={ref.source} className="flex items-center justify-between text-sm">
                <span className="truncate mr-3" style={{ color: "var(--text-70)" }}>{ref.title}</span>
                <span className="text-xs shrink-0" style={{ color: "var(--text-40)" }}>{ref.source}</span>
              </div>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--text-100)" }}>Marc, 24</p>
          <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-40)" }}>
            &ldquo;This test was a reality check. I thought my game was solid but I was blind to obvious weak spots. The action plan actually works.&rdquo;
          </p>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} className="text-amber-400 text-base">★</span>
            ))}
          </div>
        </motion.div>
      </div>
      <button onClick={onNext} className="w-full py-4 rounded-xl text-white font-semibold text-lg mt-8 btn-gradient">
        Got it ➔
      </button>
    </div>
  );
}

/* ───── DOB Picker (DD/MM/YYYY dropdowns) ───── */
function DobPicker({ value, onChange, label }) {
  const selectClass =
    "h-[44px] px-2 rounded-xl text-sm text-center appearance-none transition-colors focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/20";
  const selectStyle = { background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-100)" };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div>
      <p className="text-xs mb-2" style={{ color: "var(--text-40)" }}>{label}</p>
      <div className="flex gap-2">
        <select className={selectClass + " w-[70px]"} style={selectStyle} value={value.day || ""} onChange={(e) => onChange({ ...value, day: e.target.value })}>
          <option value="">DD</option>
          {days.map((d) => (<option key={d} value={d}>{String(d).padStart(2, "0")}</option>))}
        </select>
        <select className={selectClass + " w-[80px]"} style={selectStyle} value={value.month || ""} onChange={(e) => onChange({ ...value, month: e.target.value })}>
          <option value="">MM</option>
          {months.map((m, i) => (<option key={m} value={i + 1}>{m}</option>))}
        </select>
        <select className={selectClass + " w-[90px]"} style={selectStyle} value={value.year || ""} onChange={(e) => onChange({ ...value, year: e.target.value })}>
          <option value="">YYYY</option>
          {years.map((y) => (<option key={y} value={y}>{y}</option>))}
        </select>
      </div>
    </div>
  );
}

/* ───── Frame 4: Name + DOB ───── */
function Frame4({ onNext, names, setNames }) {
  const dobComplete = (dob) => dob.day && dob.month && dob.year;
  const dobAge = (dob) => {
    if (!dobComplete(dob)) return null;
    const now = new Date();
    const birth = new Date(dob.year, dob.month - 1, dob.day);
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const userAge = dobAge(names.userDob);
  const valid =
    names.user.trim().length >= 2 &&
    userAge !== null && userAge >= 0 && userAge <= 99;

  const inputClass =
    "w-full h-[52px] px-4 rounded-xl text-base transition-colors focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/20";
  const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border-subtle)", color: "var(--text-100)" };

  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-center">
      <div>
        <h1 className="font-heading text-[32px] font-bold leading-tight mb-2" style={{ color: "var(--text-100)" }}>
          To personalize your analysis
        </h1>
        <p className="text-base mb-8" style={{ color: "var(--text-40)" }}>
          This information will be used in your results.
        </p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-70)" }}>Your first name</label>
            <input type="text" placeholder="ex. Marcus" value={names.user} onChange={(e) => setNames({ ...names, user: e.target.value })} className={inputClass} style={inputStyle} />
            <div className="mt-3">
              <DobPicker label="Your date of birth" value={names.userDob} onChange={(dob) => setNames({ ...names, userDob: dob })} />
            </div>
          </div>
        </div>
      </div>
      <button onClick={onNext} disabled={!valid} className="w-full py-4 rounded-xl text-white font-semibold text-lg mt-8 btn-gradient disabled:opacity-40">
        Continue
      </button>
    </div>
  );
}

/* ───── Frame 5: Final teaser ───── */
function Frame5({ onComplete }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-160px)] justify-center">
      <div className="flex flex-col items-center text-center pt-8">
        <motion.div className="text-6xl mb-8" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          🔥
        </motion.div>
        <h1 className="font-heading text-[32px] font-bold leading-tight mb-4" style={{ color: "var(--text-100)" }}>
          Ready to find out the truth?
        </h1>
        <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-40)" }}>
          The next 42 questions will reveal your real baddie-readiness level.
        </p>
        <div className="space-y-2 text-sm" style={{ color: "var(--text-40)" }}>
          <p>Be honest — this is for you.</p>
          <p>About 8 to 12 minutes</p>
        </div>
      </div>
      <div className="space-y-3 mt-8">
        <button onClick={onComplete} className="w-full py-4 rounded-xl text-white font-semibold text-lg btn-gradient">
          Let&apos;s go
        </button>
        <button onClick={() => window.history.back()} className="w-full py-3 text-sm transition-colors" style={{ color: "var(--text-40)" }}>
          Not now
        </button>
      </div>
    </div>
  );
}

/* ───── Progress bar for onboarding ───── */
function OnboardingProgress({ step }) {
  const pct = step * 5;
  return (
    <div className="w-full mb-6">
      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="h-full rounded-full progress-gradient"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

/* ───── Main Onboarding wrapper ───── */
export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [names, setNames] = useState({ user: "", userDob: { day: "", month: "", year: "" } });

  const next = () => { setDirection(1); setStep((s) => s + 1); };

  const handleComplete = () => {
    const stored = localStorage.getItem("bm_session");
    if (stored) {
      const data = JSON.parse(stored);
      data.names = names;
      data.onboardingDone = true;
      localStorage.setItem("bm_session", JSON.stringify(data));
    }
    onComplete(names);
  };

  const frames = [
    <Frame1 key="f1" onNext={next} />,
    <Frame2 key="f2" onNext={next} />,
    <Frame3 key="f3" onNext={next} />,
    <Frame4 key="f4" onNext={next} names={names} setNames={setNames} />,
    <Frame5 key="f5" onComplete={handleComplete} />,
  ];

  return (
    <div>
      <OnboardingProgress step={step + 1} />
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={slideTransition} style={{ willChange: "transform, opacity" }}>
            {frames[step]}
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {step > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => { setDirection(-1); setStep((s) => s - 1); }}
            className="mt-4 text-sm transition-colors w-full text-center"
            style={{ color: "var(--text-40)" }}
          >
            &larr; Back
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
