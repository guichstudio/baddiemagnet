import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import questions from "@/lib/questions";

const DURATION = 12000;
const TICK = 50;

const phases = [
  { max: 12, text: "Analyzing your responses..." },
  { max: 25, text: "Scanning for weak spots..." },
  { max: 38, text: "Comparing with 10,000+ profiles..." },
  { max: 50, text: "Measuring your confidence level..." },
  { max: 62, text: "Detecting blind spots..." },
  { max: 75, text: "Calculating your potential..." },
  { max: 88, text: "Building your baddie-readiness profile..." },
  { max: 95, text: "Finalizing your results..." },
  { max: 100, text: "Analysis complete" },
];

function getPhaseText(pct) {
  for (const p of phases) {
    if (pct <= p.max) return p.text;
  }
  return phases[phases.length - 1].text;
}

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/* ── Confetti particle (burst from center) ── */
function ConfettiHeart({ delay, x, size, color, drift, targetY, rotation }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: "50%", fontSize: size }}
      initial={{ y: 0, x: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{
        y: [0, targetY],
        x: [0, drift],
        opacity: [1, 1, 0],
        scale: [0, 1.2, 0.8],
        rotate: [0, rotation],
      }}
      transition={{ duration: 1.8 + delay * 0.5, delay, ease: "easeOut" }}
    >
      <span style={{ color }}>{size > 20 ? "🔥" : "⚡"}</span>
    </motion.div>
  );
}

/* ── Falling particle (rain from top to bottom) ── */
function FallingHeart({ delay, x, size, targetY, rotation, dur }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{ left: `${x}%`, top: 0, fontSize: size }}
      initial={{ y: -40, opacity: 0, rotate: 0 }}
      animate={{
        y: [-40, targetY],
        opacity: [0, 1, 1, 1, 0],
        rotate: [0, rotation],
      }}
      transition={{ duration: dur, delay, ease: "linear" }}
    >
      <span>{size > 20 ? "🔥" : "⚡"}</span>
    </motion.div>
  );
}

const BUBBLES = [
  { cx: 7, r: 0.28, delay: 0, dur: 3.2 },
  { cx: 10, r: 0.32, delay: 0.8, dur: 2.8 },
  { cx: 14, r: 0.25, delay: 1.6, dur: 3.5 },
  { cx: 9, r: 0.3, delay: 2.2, dur: 3.0 },
  { cx: 15, r: 0.27, delay: 0.4, dur: 3.8 },
];

export default function Analyzing() {
  const router = useRouter();
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [fading, setFading] = useState(false);
  const startRef = useRef(null);
  const [waveOffset, setWaveOffset] = useState(0);

  // Guard: redirect if no completed session
  useEffect(() => {
    const stored = localStorage.getItem("bm_session");
    if (!stored) { router.replace("/"); return; }
    const data = JSON.parse(stored);
    if (Object.keys(data.answers || {}).length < questions.length) {
      router.replace("/quiz");
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progress counter
  useEffect(() => {
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const progress = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setPct(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setDone(true);
        setShowConfetti(true);
      }
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  // Wave animation via rAF
  useEffect(() => {
    let frame;
    const tick = () => {
      setWaveOffset(Date.now() / 600);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fade out then navigate
  useEffect(() => {
    if (done) {
      const fadeTimer = setTimeout(() => setFading(true), 2500);
      const navTimer = setTimeout(() => router.push("/checkout"), 3500);
      return () => { clearTimeout(fadeTimer); clearTimeout(navTimer); };
    }
  }, [done, router]);

  const phaseText = getPhaseText(pct);
  const fillY = 22 - (pct / 100) * 20;

  // Wave path at liquid surface
  const wAmp = done ? 0 : 0.5;
  const w1 = Math.sin(waveOffset) * wAmp;
  const w2 = Math.sin(waveOffset + 2) * wAmp;
  const w3 = Math.sin(waveOffset + 4) * wAmp;
  const wavePath = `M-1 ${fillY + w1} Q5 ${fillY + w2 - 0.4} 12 ${fillY + w1} T25 ${fillY + w3}`;

  // Pre-generate all confetti particles (stable random values)
  const confettiParticles = useMemo(() => {
    const particles = [];
    const colors = ["#9333EA", "#F97316", "#EF4444", "#7C3AED", "#E11D48"];

    for (let i = 0; i < 18; i++) {
      const drift = (Math.random() - 0.5) * 160;
      particles.push({
        type: "burst", id: `b${i}`,
        delay: Math.random() * 0.3,
        x: 35 + Math.random() * 30,
        size: 14 + Math.random() * 16,
        color: colors[i % colors.length],
        drift,
        targetY: -220 - Math.random() * 180,
        rotation: drift > 0 ? 120 : -120,
      });
    }

    for (let i = 0; i < 42; i++) {
      particles.push({
        type: "fall", id: `f${i}`,
        delay: Math.random() * 2.5,
        x: Math.random() * 100,
        size: 14 + Math.random() * 18,
        color: colors[i % colors.length],
        targetY: 900 + Math.random() * 200,
        rotation: (Math.random() - 0.5) * 180,
        dur: 3 + Math.random() * 1.5,
      });
    }

    return particles;
  }, []);

  return (
    <Layout title="Analyzing...">
      <style jsx global>{`
        @keyframes highlightPulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.22; }
        }
      `}</style>

      <div
        className="flex flex-col items-center justify-center text-center min-h-[80vh] py-12 relative overflow-hidden"
        style={{ opacity: fading ? 0 : 1, transition: "opacity 1s ease-out" }}
      >

        {/* Confetti layer */}
        <AnimatePresence>
          {showConfetti && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {confettiParticles.map((p) =>
                p.type === "burst" ? (
                  <ConfettiHeart key={p.id} delay={p.delay} x={p.x} size={p.size} color={p.color} drift={p.drift} targetY={p.targetY} rotation={p.rotation} />
                ) : (
                  <FallingHeart key={p.id} delay={p.delay} x={p.x} size={p.size} targetY={p.targetY} rotation={p.rotation} dur={p.dur} />
                )
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "120%",
            height: "120%",
            top: "-10%",
            left: "-10%",
            background: `radial-gradient(circle at 50% 45%, rgba(147,51,234,${done ? 0.15 : 0.06 + pct * 0.001}) 0%, transparent 60%)`,
            transition: "background 0.5s",
          }}
        />

        {/* Heart container */}
        <motion.div
          className="relative mb-8"
          style={{ width: "min(38vw, 196px)", height: "min(38vw, 196px)" }}
          animate={done ? { scale: [1, 1.12, 0.96, 1.06, 1] } : {}}
          transition={done ? { duration: 0.8, ease: "easeInOut" } : {}}
        >
          {/* Glow — grows with fill, pulses on done */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(147,51,234,${done ? 0.3 : 0.08 + pct * 0.002}) 0%, transparent 70%)`,
              transform: `scale(${1.3 + pct * 0.005})`,
            }}
            animate={done ? { opacity: [0.8, 1, 0.8], scale: [1.5, 1.7, 1.5] } : { opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: done ? 1 : 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <svg viewBox="0 0 24 24" className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="liquidGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="60%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
              <radialGradient id="glassGrad" cx="0.4" cy="0.3" r="0.7">
                <stop offset="0%" stopColor="rgba(40,20,50,0.6)" />
                <stop offset="100%" stopColor="rgba(15,8,25,0.9)" />
              </radialGradient>
              <linearGradient id="sheenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="doneGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="50%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#A855F7" />
              </linearGradient>
              <clipPath id="heartClip">
                <path d={HEART_PATH} />
              </clipPath>
            </defs>

            {/* Glass background */}
            <g clipPath="url(#heartClip)">
              <rect x="0" y="0" width="24" height="24" fill="url(#glassGrad)" />
            </g>

            {/* Liquid fill */}
            <g clipPath="url(#heartClip)">
              <rect
                x="0" width="24" height="24"
                fill={done ? "url(#doneGrad)" : "url(#liquidGrad)"}
                y={done ? 2 : fillY}
                style={{ transition: "y 0.12s ease-out" }}
              />
              {!done && (
                <>
                  <path d={`${wavePath} L25 24 L-1 24 Z`} fill="url(#liquidGrad)" />
                  <rect x="0" y={fillY - 0.3} width="24" height="0.6" fill="url(#sheenGrad)" style={{ transition: "y 0.12s ease-out" }} />
                </>
              )}
              {!done && pct > 5 && BUBBLES.map((b, i) => (
                <motion.circle
                  key={i}
                  cx={b.cx}
                  r={b.r}
                  fill="rgba(255,255,255,0.3)"
                  initial={{ cy: 20, opacity: 0 }}
                  animate={{ cy: [20, 6], opacity: [0, 0.4, 0.4, 0] }}
                  transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "linear" }}
                />
              ))}
            </g>

            {/* Glass reflection highlight */}
            <g clipPath="url(#heartClip)">
              <ellipse cx="8" cy="7" rx="3.5" ry="2.5" fill="rgba(255,255,255,0.12)" style={{ animation: "highlightPulse 4s ease-in-out infinite" }} />
            </g>

            {/* Heart outline */}
            <path d={HEART_PATH} fill="none" stroke={done ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.15)"} strokeWidth="0.3" />
          </svg>

          {/* Percentage text */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.span
              className="font-body tabular-nums"
              style={{
                fontSize: "clamp(2rem, 6.4vw, 3.2rem)",
                fontWeight: 800,
                letterSpacing: "-0.06em",
                color: "#FFFFFF",
                textShadow: `0 2px 12px rgba(147,51,234,${done ? 0.4 : 0.2})`,
                transition: "color 0.3s",
              }}
              animate={done ? { scale: [1, 1.15, 1] } : {}}
              transition={done ? { duration: 0.5 } : {}}
            >
              {pct}%
            </motion.span>
          </div>
        </motion.div>

        {/* Phase text */}
        <div className="h-12 flex items-center justify-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={phaseText}
              className={`text-lg ${done ? "font-semibold" : ""}`}
              style={{ color: done ? "var(--text-100)" : "var(--text-70)" }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {phaseText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
