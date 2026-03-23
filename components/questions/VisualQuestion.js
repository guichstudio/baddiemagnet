import { motion } from "framer-motion";
import { optionClass } from "@/lib/styles";

export default function VisualQuestion({ question, selected, onSelect }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <div className="grid grid-cols-3 gap-3 pt-2">
        {question.options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            whileHover={{ scale: 1.07, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onSelect({ questionId: question.id, label: opt.label, value: opt.value })}
            className={`flex flex-col items-center gap-2 py-5 px-2 rounded-xl ${optionClass(selected?.value === opt.value)}`}
          >
            <span className="text-4xl">{opt.emoji}</span>
            <span className="text-xs text-center leading-tight">{opt.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
