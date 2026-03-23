import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProgressBar from "@/components/ProgressBar";
import QuizQuestion from "@/components/QuizQuestion";
import Onboarding from "@/components/Onboarding";
import questions from "@/lib/questions";

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

const slideTransition = {
  x: { type: "tween", duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  opacity: { duration: 0.25 },
};

export default function Quiz() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1);
  const [onboardingDone, setOnboardingDone] = useState(false);

  const answersRef = useRef(answers);
  const indexRef = useRef(currentIndex);
  answersRef.current = answers;
  indexRef.current = currentIndex;

  useEffect(() => {
    const stored = localStorage.getItem("bm_session");
    if (stored) {
      const data = JSON.parse(stored);
      // Expire sessions older than 24 hours
      if (data.createdAt && Date.now() - data.createdAt > 24 * 60 * 60 * 1000) {
        localStorage.removeItem("bm_session");
      } else {
        const idx = data.currentIndex || 0;
        if (idx >= questions.length) {
          router.push("/analyzing");
          return;
        }
        setSessionId(data.sessionId);
        setAnswers(data.answers || {});
        setCurrentIndex(idx);
        setOnboardingDone(!!data.onboardingDone);
        setLoading(false);
        return;
      }
    }

    fetch("/api/create-session", { method: "POST" })
      .then((r) => r.json())
      .then(({ sessionId: id }) => {
        setSessionId(id);
        localStorage.setItem(
          "bm_session",
          JSON.stringify({ sessionId: id, answers: {}, currentIndex: 0, createdAt: Date.now() })
        );
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    (newAnswers, newIndex) => {
      const stored = localStorage.getItem("bm_session");
      const existing = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "bm_session",
        JSON.stringify({ ...existing, sessionId, answers: newAnswers, currentIndex: newIndex })
      );
      if (sessionId) {
        const names = existing.names || null;
        fetch("/api/save-answers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, answers: newAnswers, names }),
        });
      }
    },
    [sessionId]
  );

  const handleSelect = useCallback(
    (selection) => {
      const prev = answersRef.current;
      const idx = indexRef.current;

      const newAnswers = {
        ...prev,
        [selection.questionId]: {
          label: selection.label,
          value: selection.value,
          ...(selection.raw !== undefined && { raw: selection.raw }),
          ...(selection.ranking && { ranking: selection.ranking }),
        },
      };
      setAnswers(newAnswers);
      setDirection(1);

      const nextIndex = idx + 1;
      if (nextIndex >= questions.length) {
        persist(newAnswers, nextIndex);
        router.push("/analyzing");
        return;
      }

      setCurrentIndex(nextIndex);
      persist(newAnswers, nextIndex);
    },
    [persist, router]
  );

  const handleBack = useCallback(() => {
    if (indexRef.current > 0) {
      setDirection(-1);
      const newIndex = indexRef.current - 1;
      setCurrentIndex(newIndex);
      const stored = localStorage.getItem("bm_session");
      const existing = stored ? JSON.parse(stored) : {};
      localStorage.setItem(
        "bm_session",
        JSON.stringify({
          ...existing,
          sessionId,
          answers: answersRef.current,
          currentIndex: newIndex,
        })
      );
    }
  }, [sessionId]);

  const handleOnboardingComplete = useCallback((names) => {
    setOnboardingDone(true);
  }, []);

  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            className="h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </Layout>
    );
  }

  if (!onboardingDone) {
    return (
      <Layout title="Welcome | BaddieMagnet">
        <Onboarding onComplete={handleOnboardingComplete} />
      </Layout>
    );
  }

  const question = questions[currentIndex];

  return (
    <Layout title={`Question ${currentIndex + 1} | BaddieMagnet`}>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        <ProgressBar current={currentIndex + 1} total={questions.length} />

        <div className="flex-1 flex flex-col items-center justify-start pt-8 relative overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              style={{ willChange: "transform, opacity" }}
              className="w-full max-w-full overflow-hidden"
            >
              <QuizQuestion
                question={question}
                selected={answers[question.id]}
                onSelect={handleSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {currentIndex > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onClick={handleBack}
              className="py-4 text-sm transition-colors text-center" style={{ color: "var(--text-40)" }}
            >
              &larr; Back
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
