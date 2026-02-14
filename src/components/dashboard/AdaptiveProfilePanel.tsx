import { motion } from "framer-motion";
import { Brain, Volume2, Coffee, Layers } from "lucide-react";
import type { AdaptiveProfile } from "@/hooks/useNovaSmartSpeaker";

interface AdaptiveProfilePanelProps {
  profile: AdaptiveProfile;
  onUpdate: (partial: Partial<AdaptiveProfile>) => void;
}

const stepOptions = [
  { value: "tiny" as const, label: "Tiny", desc: "Very small steps" },
  { value: "small" as const, label: "Small", desc: "Short steps" },
  { value: "medium" as const, label: "Medium", desc: "Normal steps" },
];

const speakOptions = [
  { value: "minimal" as const, label: "Minimal", desc: "Only when needed" },
  { value: "moderate" as const, label: "Moderate", desc: "Balanced" },
  { value: "frequent" as const, label: "Frequent", desc: "More guidance" },
];

const breakOptions = [
  { value: "often" as const, label: "Often", desc: "Frequent breaks" },
  { value: "normal" as const, label: "Normal", desc: "Standard breaks" },
  { value: "rare" as const, label: "Rare", desc: "Fewer breaks" },
];

export function AdaptiveProfilePanel({ profile, onUpdate }: AdaptiveProfilePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Your Profile Mode</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Nova adapts to how you work. Adjust these to match your comfort level.
      </p>

      {/* Step Size */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Step Size</span>
        </div>
        <div className="flex gap-2">
          {stepOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ preferredStepSize: opt.value })}
              className={`flex-1 rounded-xl p-2 text-center transition-all ${
                profile.preferredStepSize === opt.value
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <span className="text-xs font-medium text-foreground block">{opt.label}</span>
              <span className="text-[9px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speak Frequency */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Nova's Voice</span>
        </div>
        <div className="flex gap-2">
          {speakOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ speakFrequency: opt.value })}
              className={`flex-1 rounded-xl p-2 text-center transition-all ${
                profile.speakFrequency === opt.value
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <span className="text-xs font-medium text-foreground block">{opt.label}</span>
              <span className="text-[9px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Break Frequency */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Coffee className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Break Frequency</span>
        </div>
        <div className="flex gap-2">
          {breakOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate({ breakFrequency: opt.value })}
              className={`flex-1 rounded-xl p-2 text-center transition-all ${
                profile.breakFrequency === opt.value
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : "bg-muted/30 hover:bg-muted/50"
              }`}
            >
              <span className="text-xs font-medium text-foreground block">{opt.label}</span>
              <span className="text-[9px] text-muted-foreground">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overwhelm Threshold */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground">Overwhelm Limit</span>
          <span className="text-xs text-primary font-semibold">{profile.overwhelmThreshold} steps</span>
        </div>
        <input
          type="range"
          min={2}
          max={10}
          value={profile.overwhelmThreshold}
          onChange={(e) => onUpdate({ overwhelmThreshold: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
          <span>Fewer at once</span>
          <span>More at once</span>
        </div>
      </div>
    </motion.div>
  );
}
