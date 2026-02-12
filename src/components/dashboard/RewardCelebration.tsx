import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RewardCelebrationProps {
  show: boolean;
  xp: number;
  message: string;
  onComplete: () => void;
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  emoji: ["⭐", "🎉", "✨", "🔥", "💎", "🏆", "🌟", "💫"][i % 8],
  x: Math.random() * 100,
  delay: Math.random() * 0.5,
}));

export function RewardCelebration({ show, xp, message, onComplete }: RewardCelebrationProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          onClick={onComplete}
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-2xl pointer-events-none"
              initial={{ x: "50vw", y: "50vh", scale: 0, opacity: 1 }}
              animate={{
                x: `${p.x}vw`,
                y: `${10 + Math.random() * 80}vh`,
                scale: [0, 1.5, 0.8],
                opacity: [0, 1, 0],
                rotate: [0, 360],
              }}
              transition={{ duration: 2, delay: p.delay, ease: "easeOut" }}
            >
              {p.emoji}
            </motion.span>
          ))}

          {/* Central card */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="rounded-3xl bg-card border-2 border-primary/30 shadow-glow-primary p-8 text-center max-w-sm mx-4"
          >
            <motion.span
              className="text-6xl block mb-4"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              🏆
            </motion.span>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Amazing Work!
            </h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center gap-2 rounded-full gradient-calm px-6 py-2"
            >
              <span className="text-lg font-bold text-primary-foreground">+{xp} XP</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
