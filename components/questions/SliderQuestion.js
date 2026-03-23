import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

function rawToValue(raw) {
  if (raw <= 1) return 1;
  if (raw <= 3) return 2;
  if (raw <= 5) return 3;
  if (raw <= 7) return 4;
  return 5;
}

export default function SliderQuestion({ question, selected, onSelect }) {
  const [raw, setRaw] = useState(selected?.raw ?? 5);
  const prevRaw = useRef(raw);
  const [dir, setDir] = useState(0); // -1 shrink, +1 grow

  useEffect(() => {
    setRaw(selected?.raw ?? 5);
    prevRaw.current = selected?.raw ?? 5;
  }, [question.id, selected]);

  const handleChange = (e) => {
    const next = Number(e.target.value);
    setDir(next > prevRaw.current ? 1 : next < prevRaw.current ? -1 : 0);
    prevRaw.current = next;
    setRaw(next);
  };

  const handleConfirm = () => {
    onSelect({
      questionId: question.id,
      label: `${raw}/10`,
      value: rawToValue(raw),
      raw,
    });
  };

  return (
    <div className="space-y-8 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <motion.div
        className="pt-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.span
          key={raw}
          className="text-4xl font-bold text-gradient block mb-6"
          initial={{ scale: dir >= 0 ? 1.35 : 0.75, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          {raw}
        </motion.span>

        <input
          type="range"
          min="0"
          max="10"
          step="1"
          value={raw}
          onChange={handleChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-xs mt-2" style={{ color: "var(--text-40)" }}>
          <span>{question.sliderLeft}</span>
          <span>{question.sliderRight}</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleConfirm}
        className="w-full py-4 rounded-xl font-semibold btn-gradient text-white transition-colors"
      >
        Confirm
      </motion.button>
    </div>
  );
}
