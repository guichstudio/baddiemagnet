import { motion } from "framer-motion";

export default function ScaleQuestion({ question, selected, onSelect }) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>

      <div className="flex justify-between items-start gap-1 pt-4 overflow-hidden">
        {question.scaleLabels.map((label, i) => {
          const value = i + 1;
          const isSelected = selected?.value === value;
          return (
            <motion.button
              key={value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.25 }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect({ questionId: question.id, label, value })}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <motion.div
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                    : "border-white/[0.12] bg-white/[0.04] text-white/40 hover:border-white/25 hover:text-white/60"
                }`}
                animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
              >
                {value}
              </motion.div>
              <span className="text-[10px] text-center leading-tight max-w-[60px]" style={{ color: isSelected ? "var(--text-70)" : "var(--text-40)" }}>
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
