import { useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";

function computeScore(orderedItems) {
  const weights = [0.4, 0.3, 0.2, 0.1];
  let score = 0;
  for (let i = 0; i < orderedItems.length; i++) {
    score += orderedItems[i].signal * weights[i];
  }
  return Math.max(1, Math.min(5, Math.round(score)));
}

export default function RankingQuestion({ question, selected, onSelect }) {
  const [items, setItems] = useState(
    selected?.ranking
      ? selected.ranking.map((id) => question.items.find((it) => it.id === id)).filter(Boolean) // FIX: filter undefined from stale IDs
      : [...question.items]
  );

  useEffect(() => {
    if (selected?.ranking) {
      setItems(selected.ranking.map((id) => question.items.find((it) => it.id === id)).filter(Boolean));
    } else {
      setItems([...question.items]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const swap = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
  };

  const handleConfirm = () => {
    onSelect({
      questionId: question.id,
      label: items.map((it) => it.label).join(" > "),
      value: computeScore(items),
      ranking: items.map((it) => it.id),
    });
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-100)" }}>{question.text}</h2>
      <p className="text-xs" style={{ color: "var(--text-40)" }}>Drag to reorder or use arrows</p>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2 pt-2 list-none"
      >
        {items.map((item, i) => (
          <Reorder.Item
            key={item.id}
            value={item}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileDrag={{
              scale: 1.04,
              boxShadow: "0 8px 32px rgba(236,72,153,0.25), 0 2px 8px rgba(0,0,0,0.3)",
              background: "rgba(236,72,153,0.15)",
              borderColor: "rgba(236,72,153,0.35)",
              cursor: "grabbing",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex items-center gap-2 rounded-xl px-4 py-4 select-none ranking-card min-w-0"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              cursor: "grab",
              touchAction: "none",
            }}
          >
            {/* Drag handle */}
            <span className="text-xs mr-1 shrink-0" style={{ color: "var(--text-40)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="3.5" cy="2.5" r="1.2" />
                <circle cx="8.5" cy="2.5" r="1.2" />
                <circle cx="3.5" cy="6" r="1.2" />
                <circle cx="8.5" cy="6" r="1.2" />
                <circle cx="3.5" cy="9.5" r="1.2" />
                <circle cx="8.5" cy="9.5" r="1.2" />
              </svg>
            </span>

            <motion.span
              className="text-pink-400 font-bold text-sm w-5"
              key={`${item.id}-${i}`}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {i + 1}
            </motion.span>
            <span className="flex-1 text-left text-sm min-w-0" style={{ color: "var(--text-70)" }}>{item.label}</span>
            <div className="flex flex-col gap-0.5">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => swap(i, -1)}
                disabled={i === 0}
                className="hover:text-white disabled:opacity-20 text-xs px-1"
                style={{ color: "var(--text-40)" }}
                aria-label="Move up"
              >
                ▲
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => swap(i, 1)}
                disabled={i === items.length - 1}
                className="hover:text-white disabled:opacity-20 text-xs px-1"
                style={{ color: "var(--text-40)" }}
                aria-label="Move down"
              >
                ▼
              </motion.button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleConfirm}
        className="w-full py-4 rounded-xl font-semibold btn-gradient text-white transition-colors"
      >
        Confirm Ranking
      </motion.button>
    </div>
  );
}
