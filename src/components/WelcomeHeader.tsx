import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
  greeting: string;
  tip: string;
}

export function WelcomeHeader({ name, greeting, tip }: WelcomeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <h1 className="text-3xl font-heading font-bold text-foreground">
        {greeting}, {name} 👋
      </h1>
      <div className="flex items-start gap-2 mt-2 rounded-xl bg-muted/60 p-3">
        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">{tip}</p>
      </div>
    </motion.div>
  );
}
