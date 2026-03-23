import { motion } from "framer-motion";

export default function BinaryQuestion({ question, selected, onSelect }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <div className="grid grid-cols-2 gap-4 pt-2">
        {question.options.map((opt, i) => {
          const isSelected = selected?.value === opt.value;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.93 }}
              onClick={() => onSelect({ questionId: question.id, label: opt.label, value: opt.value })}
              className={`flex flex-col items-center gap-3 py-8 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-pink-500/70 bg-pink-500/15 text-white shadow-[0_0_16px_rgba(236,72,153,0.15)]"
                  : "border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-white/20"
              }`}
            >
              <motion.span
                className="text-5xl"
                animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {opt.icon}
              </motion.span>
              <span className="font-medium text-base">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
