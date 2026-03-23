import { motion } from "framer-motion";
import { optionClass } from "@/lib/styles";

export default function McqQuestion({ question, selected, onSelect }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>
      <div className="space-y-3 pt-2">
        {question.options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.25 }}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect({ questionId: question.id, label: opt.label, value: opt.value })}
            className={`w-full text-left px-5 py-4 rounded-xl ${optionClass(selected?.value === opt.value)}`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
