import { motion } from "framer-motion";

interface TimeBlock {
  hour: string;
  energy: "high" | "medium" | "low" | "rest";
  task?: string;
  current?: boolean;
}

interface EnergySchedulerProps {
  blocks: TimeBlock[];
}

const energyColors = {
  high: "bg-energy-high",
  medium: "bg-energy-medium",
  low: "bg-energy-low",
  rest: "bg-energy-rest",
};

const energyLabels = {
  high: "Peak",
  medium: "Steady",
  low: "Wind down",
  rest: "Rest",
};

export function EnergyScheduler({ blocks }: EnergySchedulerProps) {
  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold text-foreground">Energy Schedule</h3>
          <p className="text-xs text-muted-foreground">Aligned to your natural rhythm</p>
        </div>
        <div className="flex gap-2">
          {(["high", "medium", "low", "rest"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1">
              <div className={`h-2.5 w-2.5 rounded-full ${energyColors[level]}`} />
              <span className="text-[10px] text-muted-foreground">{energyLabels[level]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {blocks.map((block, i) => (
          <motion.div
            key={block.hour}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`flex items-center gap-3 rounded-xl p-3 transition-all ${
              block.current ? "bg-muted ring-2 ring-primary/30" : "hover:bg-muted/40"
            }`}
          >
            <span className="w-14 text-xs font-medium text-muted-foreground tabular-nums">{block.hour}</span>
            <div className={`h-8 w-1.5 rounded-full ${energyColors[block.energy]}`} />
            <div className="flex-1">
              {block.task ? (
                <p className="text-sm font-medium text-foreground">{block.task}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">Available</p>
              )}
            </div>
            {block.current && (
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Now</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
