import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface NovaCompanionProps {
  isSpeaking: boolean;
  lastMessage: string;
  onToggleMute: () => void;
  muted: boolean;
}

export function NovaCompanion({ isSpeaking, lastMessage, onToggleMute, muted }: NovaCompanionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
    >
      <AnimatePresence>
        {isSpeaking && lastMessage && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            className="max-w-[250px] rounded-2xl rounded-br-sm bg-card border border-border shadow-soft p-3"
          >
            <p className="text-xs text-foreground leading-relaxed">{lastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={onToggleMute}
        className="relative h-16 w-16 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {/* Pulsing glow ring when speaking */}
        {isSpeaking && !muted && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Star body */}
        <svg width="56" height="56" viewBox="0 0 56 56" className="drop-shadow-lg">
          {/* Outer glow */}
          <defs>
            <radialGradient id="novaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="novaBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(45, 100%, 60%)" />
            </linearGradient>
          </defs>
          <circle cx="28" cy="28" r="28" fill="url(#novaGlow)" />
          {/* Star shape */}
          <polygon
            points="28,6 33,20 48,20 36,29 40,44 28,35 16,44 20,29 8,20 23,20"
            fill="url(#novaBody)"
            stroke="hsl(45, 100%, 70%)"
            strokeWidth="0.5"
          />
          {/* Face */}
          {/* Left eye */}
          <motion.ellipse
            cx="23"
            cy="24"
            rx="2.5"
            ry="3"
            fill="hsl(var(--background))"
            animate={{ ry: [3, 0.5, 3] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5 }}
          />
          {/* Right eye */}
          <motion.ellipse
            cx="33"
            cy="24"
            rx="2.5"
            ry="3"
            fill="hsl(var(--background))"
            animate={{ ry: [3, 0.5, 3] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3.5, delay: 0.05 }}
          />
          {/* Pupils */}
          <motion.circle
            cx="23.5"
            cy="24"
            r="1.2"
            fill="hsl(var(--foreground))"
            animate={{ cy: [24, 23, 24] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.circle
            cx="33.5"
            cy="24"
            r="1.2"
            fill="hsl(var(--foreground))"
            animate={{ cy: [24, 23, 24] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          {/* Mouth - smile */}
          <motion.path
            d={isSpeaking ? "M24,30 Q28,35 32,30" : "M24,30 Q28,33 32,30"}
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="1.2"
            strokeLinecap="round"
            animate={isSpeaking ? { d: ["M24,30 Q28,35 32,30", "M24,29 Q28,33 32,29", "M24,30 Q28,35 32,30"] } : {}}
            transition={isSpeaking ? { duration: 0.4, repeat: Infinity } : {}}
          />
          {/* Blush */}
          <circle cx="19" cy="28" r="2.5" fill="hsl(0, 80%, 75%)" opacity="0.3" />
          <circle cx="37" cy="28" r="2.5" fill="hsl(0, 80%, 75%)" opacity="0.3" />
        </svg>

        {/* Mute indicator */}
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
          {muted ? (
            <VolumeX className="h-3 w-3 text-muted-foreground" />
          ) : (
            <Volume2 className="h-3 w-3 text-primary" />
          )}
        </div>
      </button>
    </motion.div>
  );
}
