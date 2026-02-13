import { motion, AnimatePresence } from "framer-motion";
import { Timer, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskNotificationProps {
  show: boolean;
  message: string;
  type: "info" | "timer-prompt";
  onStartTimer?: () => void;
  onDismiss: () => void;
}

export function TaskNotification({ show, message, type, onStartTimer, onDismiss }: TaskNotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 left-1/2 z-[60] w-[90%] max-w-md rounded-2xl bg-card border border-border shadow-glow-primary p-4"
        >
          <div className="flex items-start gap-3">
            {type === "timer-prompt" ? (
              <Timer className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{message}</p>
              {type === "timer-prompt" && (
                <div className="flex gap-2 mt-3">
                  <Button variant="calm" size="sm" onClick={onStartTimer}>
                    <Timer className="h-3.5 w-3.5 mr-1.5" />
                    Yes, start timer!
                  </Button>
                  <Button variant="soft" size="sm" onClick={onDismiss}>
                    Not now
                  </Button>
                </div>
              )}
            </div>
            <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
