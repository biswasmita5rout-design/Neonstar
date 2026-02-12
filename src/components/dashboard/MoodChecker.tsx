import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MoodCheckerProps {
  userId: string;
}

const moods = [
  { emoji: "😊", label: "Great", value: "great" },
  { emoji: "🙂", label: "Good", value: "good" },
  { emoji: "😐", label: "Okay", value: "okay" },
  { emoji: "😔", label: "Low", value: "low" },
  { emoji: "😫", label: "Struggling", value: "struggling" },
];

const energyLevels = [
  { emoji: "⚡", label: "High", value: "high" },
  { emoji: "🔋", label: "Medium", value: "medium" },
  { emoji: "🪫", label: "Low", value: "low" },
];

export function MoodChecker({ userId }: MoodCheckerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [logged, setLogged] = useState(false);

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
      toast.success("Mood logged! Keep going 💪");
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

      <div className="flex gap-2 mb-4">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setSelectedMood(m.value)}
            className={`flex-1 flex flex-col items-center gap-1 rounded-xl p-2 transition-all ${
              selectedMood === m.value ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/50"
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-2">Energy level</p>
      <div className="flex gap-2 mb-4">
        {energyLevels.map((e) => (
          <button
            key={e.value}
            onClick={() => setSelectedEnergy(e.value)}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl p-2 transition-all ${
              selectedEnergy === e.value ? "bg-primary/10 ring-2 ring-primary/30" : "hover:bg-muted/50"
            }`}
          >
            <span>{e.emoji}</span>
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
