import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ArrowRight, Sparkles, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

interface GuidedTaskViewProps {
  taskTitle: string;
  taskEmoji: string;
  subtasks: SubTask[];
  onCompleteStep: (subtaskId: string) => void;
  onNovaSpeak: (text: string) => void;
  novaMuted: boolean;
}

export function GuidedTaskView({
  taskTitle,
  taskEmoji,
  subtasks,
  onCompleteStep,
  onNovaSpeak,
  novaMuted,
}: GuidedTaskViewProps) {
  // Find the first incomplete step
  const currentStepIndex = subtasks.findIndex((s) => !s.done);
  const currentStep = currentStepIndex >= 0 ? subtasks[currentStepIndex] : null;
  const allDone = subtasks.every((s) => s.done);
  const doneCount = subtasks.filter((s) => s.done).length;

  // Speak the current step instruction when it changes
  useEffect(() => {
    if (currentStep && !novaMuted) {
      const stepNum = currentStepIndex + 1;
      const cleanText = currentStep.text.replace(/[^\w\s.,!?'-]/g, "");
      onNovaSpeak(
        `Step ${stepNum} of ${subtasks.length}. ${cleanText}. Take your time, click completed when you are done.`
      );
    }
  }, [currentStepIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleComplete = () => {
    if (!currentStep) return;
    onCompleteStep(currentStep.id);

    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= subtasks.length) {
      if (!novaMuted) {
        onNovaSpeak(`Well done! You finished "${taskTitle}". You are amazing!`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border shadow-card p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{taskEmoji}</span>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-foreground text-sm">{taskTitle}</h3>
          <p className="text-[10px] text-muted-foreground">
            Step {allDone ? subtasks.length : currentStepIndex + 1} of {subtasks.length}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-4">
        {subtasks.map((s, i) => (
          <div
            key={s.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s.done
                ? "bg-primary"
                : i === currentStepIndex
                ? "bg-primary/40 animate-pulse"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Current step display */}
      <AnimatePresence mode="wait">
        {allDone ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
            <p className="font-heading font-semibold text-foreground">All steps completed!</p>
            <p className="text-xs text-muted-foreground mt-1">Great job, you did it! 🎉</p>
          </motion.div>
        ) : currentStep ? (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* Instruction card */}
            <div className="rounded-xl bg-muted/30 border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{currentStepIndex + 1}</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{currentStep.text}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                variant="calm"
                className="flex-1"
                onClick={handleComplete}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </Button>
              {!novaMuted && (
                <Button
                  variant="soft"
                  size="icon"
                  onClick={() => {
                    const cleanText = currentStep.text.replace(/[^\w\s.,!?'-]/g, "");
                    onNovaSpeak(`Step ${currentStepIndex + 1}. ${cleanText}`);
                  }}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Completed steps list */}
      {doneCount > 0 && !allDone && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground mb-2">Completed steps</p>
          <div className="space-y-1">
            {subtasks.filter((s) => s.done).map((s) => (
              <div key={s.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="line-through">{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
