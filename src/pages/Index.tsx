import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { WelcomeHeader } from "@/components/WelcomeHeader";
import { EnergyIndicator } from "@/components/EnergyIndicator";
import { XPBar } from "@/components/XPBar";
import { TaskBreakdown } from "@/components/TaskBreakdown";
import { EnergyScheduler } from "@/components/EnergyScheduler";
import { FocusTimer } from "@/components/FocusTimer";
import { AchievementBadges } from "@/components/AchievementBadges";
import { CalmModeToggle } from "@/components/CalmModeToggle";

const initialTasks = [
  {
    id: "1",
    title: "Morning Study Session",
    emoji: "📚",
    xpReward: 50,
    subtasks: [
      { id: "1a", text: "Review yesterday's notes for 5 min", done: true },
      { id: "1b", text: "Read Chapter 3 summary", done: false },
      { id: "1c", text: "Write 3 key takeaways", done: false },
      { id: "1d", text: "Practice 5 quiz questions", done: false },
    ],
  },
  {
    id: "2",
    title: "Organize Workspace",
    emoji: "🧹",
    xpReward: 25,
    subtasks: [
      { id: "2a", text: "Clear desk surface", done: true },
      { id: "2b", text: "Sort papers into folders", done: true },
      { id: "2c", text: "Charge devices", done: false },
    ],
  },
  {
    id: "3",
    title: "Exercise Break",
    emoji: "🏃",
    xpReward: 30,
    subtasks: [
      { id: "3a", text: "5 min warm-up stretches", done: false },
      { id: "3b", text: "15 min walk or jog", done: false },
      { id: "3c", text: "Cool down & hydrate", done: false },
    ],
  },
];

const scheduleBlocks = [
  { hour: "8:00 AM", energy: "medium" as const, task: "Light reading" },
  { hour: "9:00 AM", energy: "high" as const, task: "📚 Morning Study Session", current: true },
  { hour: "10:00 AM", energy: "high" as const, task: "Deep work — Math problems" },
  { hour: "11:00 AM", energy: "medium" as const, task: "🧹 Organize Workspace" },
  { hour: "12:00 PM", energy: "low" as const, task: "Lunch & rest" },
  { hour: "1:00 PM", energy: "rest" as const },
  { hour: "2:00 PM", energy: "medium" as const, task: "🏃 Exercise Break" },
  { hour: "3:00 PM", energy: "high" as const, task: "Creative project time" },
  { hour: "4:00 PM", energy: "medium" as const },
  { hour: "5:00 PM", energy: "low" as const, task: "Review & plan tomorrow" },
];

const badges = [
  { id: "1", emoji: "🔥", title: "On Fire", description: "3-day streak", unlocked: true },
  { id: "2", emoji: "🎯", title: "Bullseye", description: "Complete all daily tasks", unlocked: true },
  { id: "3", emoji: "🧘", title: "Zen Master", description: "Use calm mode 5x", unlocked: false },
  { id: "4", emoji: "⚡", title: "Power Hour", description: "4 focus sessions in a day", unlocked: false },
  { id: "5", emoji: "🌟", title: "Rising Star", description: "Reach level 5", unlocked: true },
  { id: "6", emoji: "🏆", title: "Champion", description: "Reach level 10", unlocked: false },
];

const tips = [
  "Your peak energy is between 9–11 AM today. Let's tackle the hard stuff first! 💪",
  "You completed 80% of yesterday's tasks. Amazing consistency! 🌟",
  "Try a 5-minute breathing break before your next focus session. 🧘",
];

const Index = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [calmMode, setCalmMode] = useState(false);
  const [xp, setXp] = useState(320);

  const handleToggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, done: !s.done } : s
              ),
            }
          : task
      )
    );
    setXp((prev) => prev + 10);
  }, []);

  const handleFocusComplete = useCallback(() => {
    setXp((prev) => prev + 25);
  }, []);

  return (
    <div className={`min-h-screen gradient-hero ${calmMode ? "transition-all duration-500" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <span className="font-heading font-bold text-lg text-foreground">NeuroFlow</span>
          </div>
          <CalmModeToggle enabled={calmMode} onToggle={() => setCalmMode(!calmMode)} />
        </div>

        <WelcomeHeader
          name="Alex"
          greeting="Good morning"
          tip={tips[0]}
        />

        {/* XP Bar */}
        <div className="mb-6">
          <XPBar currentXP={xp} maxXP={500} level={4} streak={7} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Today's Tasks</h2>
              <TaskBreakdown tasks={tasks} onToggleSubtask={handleToggleSubtask} />
            </div>

            {!calmMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Energy Schedule</h2>
                <EnergyScheduler blocks={scheduleBlocks} />
              </motion.div>
            )}
          </div>

          {/* Right column — Timer, Energy, Achievements */}
          <div className="space-y-6">
            <EnergyIndicator level="high" />
            <FocusTimer onComplete={handleFocusComplete} />
            {!calmMode && <AchievementBadges badges={badges} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
