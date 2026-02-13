import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

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
        className="relative h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow-primary flex items-center justify-center hover:scale-105 transition-transform"
      >
        {/* Pulsing ring when speaking */}
        {isSpeaking && !muted && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <span className="text-lg font-bold">N</span>
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
