import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MoodCheckerProps {
  userId: string;
  onMoodHover?: (moodId: string) => void;
}

const moods = [
  { emoji: "😊", label: "Great", value: "great", hoverColor: "hover:bg-green-50 dark:hover:bg-green-950/30" },
  { emoji: "🙂", label: "Good", value: "good", hoverColor: "hover:bg-blue-50 dark:hover:bg-blue-950/30" },
  { emoji: "😐", label: "Okay", value: "okay", hoverColor: "hover:bg-yellow-50 dark:hover:bg-yellow-950/30" },
  { emoji: "😔", label: "Low", value: "low", hoverColor: "hover:bg-orange-50 dark:hover:bg-orange-950/30" },
  { emoji: "😫", label: "Struggling", value: "struggling", hoverColor: "hover:bg-red-50 dark:hover:bg-red-950/30" },
];

const energyLevels = [
  { emoji: "⚡", label: "High", value: "high", hoverId: "energy-high" },
  { emoji: "🔋", label: "Medium", value: "medium", hoverId: "energy-medium" },
  { emoji: "🪫", label: "Low", value: "low", hoverId: "energy-low" },
];

export function MoodChecker({ userId, onMoodHover }: MoodCheckerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

  const handleMoodHover = (value: string) => {
    setHoveredMood(value);
    onMoodHover?.(value);
  };

  const handleEnergyHover = (hoverId: string) => {
    onMoodHover?.(hoverId);
  };

  const handleLog = async () => {
    if (!selectedMood || !selectedEnergy) return;

    const { error } = await supabase.from("mood_logs").insert({
      user_id: userId,
      mood: selectedMood,
      energy_level: selectedEnergy,
    } as any);

    if (error) {
      toast.error("Failed to log mood");
    } else {
      setLogged(true);
      toast.success("Mood logged! Take care of yourself 💛");
    }
  };

  if (logged) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl bg-card border border-border shadow-card p-5 text-center"
      >
        <span className="text-3xl">✅</span>
        <p className="text-sm font-medium text-foreground mt-2">Mood logged!</p>
        <button onClick={() => setLogged(false)} className="text-xs text-primary mt-1">
          Log again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border shadow-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-3">How are you feeling?</h3>

      <div className="flex gap-2 mb-2">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setSelectedMood(m.value)}
            onMouseEnter={() => handleMoodHover(m.value)}
            onMouseLeave={() => setHoveredMood(null)}
            className={`flex-1 flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
              selectedMood === m.value
                ? "bg-primary/10 ring-2 ring-primary/30 scale-105"
                : m.hoverColor
            }`}
          >
            <motion.span
              className="text-xl"
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {m.emoji}
            </motion.span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Mood hover tooltip */}
      <AnimatePresence>
        {hoveredMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-[11px] text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 mb-2 leading-relaxed">
              {hoveredMood === "great" && "😊 You feel happy and energetic. A wonderful place to be!"}
              {hoveredMood === "good" && "🙂 You feel steady and calm. A nice balanced state."}
              {hoveredMood === "okay" && "😐 Things are alright. Not too high, not too low."}
              {hoveredMood === "low" && "😔 You may feel tired or slow today. Be gentle with yourself."}
              {hoveredMood === "struggling" && "😫 Things feel hard right now. That is okay. One tiny step at a time."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground mb-2">Energy level</p>
      <div className="flex gap-2 mb-4">
        {energyLevels.map((e) => (
          <button
            key={e.value}
            onClick={() => setSelectedEnergy(e.value)}
            onMouseEnter={() => handleEnergyHover(e.hoverId)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl p-2 transition-all ${
              selectedEnergy === e.value ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/50"
            }`}
          >
            <motion.span whileHover={{ scale: 1.2 }}>{e.emoji}</motion.span>
            <span className="text-xs">{e.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleLog}
        disabled={!selectedMood || !selectedEnergy}
        className="w-full rounded-xl bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-40 transition-opacity"
      >
        Log Mood
      </button>
    </div>
  );
}
