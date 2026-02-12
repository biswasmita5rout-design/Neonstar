import { motion } from "framer-motion";
import { Star, Flame, Trophy } from "lucide-react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  level: number;
  streak: number;
}

export function XPBar({ currentXP, maxXP, level, streak }: XPBarProps) {
  const percentage = Math.min((currentXP / maxXP) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card p-5 shadow-card border border-border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-calm">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Level</p>
            <p className="text-xl font-heading font-bold text-foreground">{level}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
            <Flame className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-foreground">{streak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
            <Star className="h-4 w-4 text-energy-medium" />
            <span className="text-sm font-semibold text-foreground">{currentXP} XP</span>
          </div>
        </div>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="absolute inset-y-0 left-0 rounded-full bg-xp-bar"
          style={{ boxShadow: "0 0 12px hsl(var(--xp-bar-glow) / 0.4)" }}
        />
      </div>
      <p className="mt-2 text-xs text-muted-foreground text-right">{maxXP - currentXP} XP to next level</p>
    </motion.div>
  );
}
