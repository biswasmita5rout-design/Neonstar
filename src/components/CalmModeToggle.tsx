import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

interface CalmModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function CalmModeToggle({ enabled, onToggle }: CalmModeToggleProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className="flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2.5 shadow-card transition-colors hover:bg-muted/50"
    >
      {enabled ? (
        <EyeOff className="h-4 w-4 text-accent" />
      ) : (
        <Eye className="h-4 w-4 text-muted-foreground" />
      )}
      <span className="text-sm font-medium text-foreground">
        {enabled ? "Calm Mode On" : "Calm Mode"}
      </span>
    </motion.button>
  );
}
