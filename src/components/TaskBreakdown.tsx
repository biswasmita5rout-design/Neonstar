import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Sparkles, Play } from "lucide-react";

interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

interface Task {
  id: string;
  title: string;
  emoji: string;
  subtasks: SubTask[];
  xpReward: number;
}

interface TaskBreakdownProps {
  tasks: Task[];
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onStartGuided?: (taskId: string) => void;
  guidedTaskId?: string | null;
}

export function TaskBreakdown({ tasks, onToggleSubtask, onStartGuided, guidedTaskId }: TaskBreakdownProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(tasks[0]?.id || null);

  return (
    <div className="space-y-3">
      {tasks.map((task, i) => {
        const completed = task.subtasks.filter((s) => s.done).length;
        const total = task.subtasks.length;
        const isExpanded = expandedTask === task.id;
        const allDone = completed === total;
        const isGuided = guidedTaskId === task.id;

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl border bg-card shadow-card overflow-hidden transition-colors ${
              isGuided ? "border-primary/50 ring-1 ring-primary/20" : allDone ? "border-primary/30" : "border-border"
            }`}
          >
            <button
              onClick={() => setExpandedTask(isExpanded ? null : task.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{task.emoji}</span>
                <div>
                  <p className={`font-heading font-semibold ${allDone ? "text-primary line-through" : "text-foreground"}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {completed}/{total} steps · +{task.xpReward} XP
                    {isGuided && <span className="text-primary ml-1">· Guided</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!allDone && onStartGuided && !isGuided && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartGuided(task.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors"
                    title="Start guided mode"
                  >
                    <Play className="h-3.5 w-3.5 text-primary" />
                  </button>
                )}
                {allDone && <Sparkles className="h-4 w-4 text-primary animate-pulse-gentle" />}
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {/* Progress bar */}
                    <div className="h-1.5 w-full rounded-full bg-muted mb-3">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completed / total) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    {task.subtasks.map((sub) => (
                      <motion.button
                        key={sub.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onToggleSubtask(task.id, sub.id)}
                        className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50 text-left"
                      >
                        {sub.done ? (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm ${sub.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {sub.text}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
