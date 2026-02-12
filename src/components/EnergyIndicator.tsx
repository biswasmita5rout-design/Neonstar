import { motion } from "framer-motion";
import { Battery, BatteryCharging, BatteryLow, BatteryMedium } from "lucide-react";

interface EnergyIndicatorProps {
  level: "high" | "medium" | "low" | "rest";
  label?: string;
}

const config = {
  high: { icon: BatteryCharging, color: "bg-energy-high", text: "Peak Energy", emoji: "⚡" },
  medium: { icon: BatteryMedium, color: "bg-energy-medium", text: "Steady", emoji: "🌤️" },
  low: { icon: BatteryLow, color: "bg-energy-low", text: "Winding Down", emoji: "🌅" },
  rest: { icon: Battery, color: "bg-energy-rest", text: "Rest Mode", emoji: "🌙" },
};

export function EnergyIndicator({ level, label }: EnergyIndicatorProps) {
  const { icon: Icon, color, text, emoji } = config[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card border border-border"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-primary-foreground`}>
        <span className="text-xl">{emoji}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label || "Current Energy"}</p>
        <p className="text-lg font-heading font-semibold text-foreground">{text}</p>
      </div>
    </motion.div>
  );
}
