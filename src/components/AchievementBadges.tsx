import { motion } from "framer-motion";

interface Badge {
  id: string;
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
}

interface AchievementBadgesProps {
  badges: Badge[];
}

export function AchievementBadges({ badges }: AchievementBadgesProps) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Achievements</h3>
      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className={`flex flex-col items-center rounded-xl p-3 text-center transition-all ${
              badge.unlocked
                ? "bg-muted"
                : "bg-muted/30 opacity-40 grayscale"
            }`}
          >
            <span className={`text-2xl mb-1 ${badge.unlocked ? "animate-float" : ""}`}>{badge.emoji}</span>
            <p className="text-xs font-semibold text-foreground leading-tight">{badge.title}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{badge.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
