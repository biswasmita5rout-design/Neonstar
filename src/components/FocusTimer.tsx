import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FocusTimerProps {
  onComplete?: () => void;
}

export const FocusTimer = forwardRef<{ start: () => void }, FocusTimerProps>(({ onComplete }, ref) => {
  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  useImperativeHandle(ref, () => ({
    start: () => setIsRunning(true),
  }));
  const totalTime = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsRunning(false);
          if (!isBreak) {
            setSessions((s) => s + 1);
            onComplete?.();
          }
          setIsBreak(!isBreak);
          return isBreak ? FOCUS_TIME : BREAK_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, isBreak, onComplete]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(FOCUS_TIME);
  }, []);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center rounded-2xl bg-card border border-border shadow-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        {isBreak ? (
          <Coffee className="h-5 w-5 text-accent" />
        ) : (
          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-gentle" />
        )}
        <h3 className="font-heading font-semibold text-foreground">
          {isBreak ? "Break Time" : "Focus Mode"}
        </h3>
      </div>

      <div className="relative mb-6">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            className="stroke-muted"
            strokeWidth="6"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            className={isBreak ? "stroke-accent" : "stroke-primary"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={timeLeft}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-heading font-bold tabular-nums text-foreground"
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-muted-foreground mt-1">{isBreak ? "relax" : "stay focused"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="soft" size="icon" onClick={reset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant={isBreak ? "soft" : "calm"}
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          className="min-w-[120px]"
        >
          {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
      </div>

      <div className="flex items-center gap-1.5 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-colors ${
              i < sessions ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">{sessions}/4 sessions</span>
      </div>
    </motion.div>
  );
});

FocusTimer.displayName = "FocusTimer";
