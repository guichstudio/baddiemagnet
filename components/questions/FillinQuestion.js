import { motion } from "framer-motion";
import { optionClass } from "@/lib/styles";

export default function FillinQuestion({ question, selected, onSelect }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <motion.p
        className="text-lg italic" style={{ color: "var(--text-70)" }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        &ldquo;{question.stem.replace("___", "______")}&rdquo;
      </motion.p>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        {question.options.map((opt, i) => (
          <motion.button
            key={opt.value}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.25 }}
            whileHover={{ scale: 1.05, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onSelect({ questionId: question.id, label: opt.label, value: opt.value })}
            className={`px-5 py-3 rounded-full text-sm ${optionClass(selected?.value === opt.value)}`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
