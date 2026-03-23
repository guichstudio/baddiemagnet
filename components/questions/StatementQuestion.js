import { motion } from "framer-motion";
import { optionClass } from "@/lib/styles";

export default function StatementQuestion({ question, selected, onSelect }) {
  const isPositive = question.direction === "positive";

  const options = [
    { label: "Yes", value: isPositive ? 5 : 1 },
    { label: "Sometimes", value: 3 },
    { label: "No", value: isPositive ? 1 : 5 },
  ];

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <motion.blockquote
        className="border-l-4 border-pink-500/40 pl-4 py-2 italic text-lg text-left" style={{ color: "var(--text-70)" }}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        &ldquo;{question.statement}&rdquo;
      </motion.blockquote>

      <div className="flex gap-3 pt-2">
        {options.map((opt, i) => (
          <motion.button
            key={opt.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.25 }}
            whileHover={{ scale: 1.04, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect({ questionId: question.id, label: opt.label, value: opt.value })}
            className={`flex-1 py-4 rounded-xl text-center font-medium ${optionClass(selected?.label === opt.label)}`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
