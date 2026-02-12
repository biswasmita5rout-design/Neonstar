import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { AITaskInput } from "@/components/dashboard/AITaskInput";
import { TaskBreakdown } from "@/components/TaskBreakdown";
import { FocusTimer } from "@/components/FocusTimer";
import { EnergyScheduler } from "@/components/EnergyScheduler";
import { AchievementBadges } from "@/components/AchievementBadges";
import { MoodChecker } from "@/components/dashboard/MoodChecker";
import { RewardCelebration } from "@/components/dashboard/RewardCelebration";
import { XPBar } from "@/components/XPBar";
import { EnergyIndicator } from "@/components/EnergyIndicator";
import { CalmModeToggle } from "@/components/CalmModeToggle";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

const defaultSchedule = [
  { hour: "9:00 AM", energy: "high" as const, task: "Deep focus work" },
  { hour: "10:00 AM", energy: "high" as const, task: "Complex tasks" },
  { hour: "11:00 AM", energy: "medium" as const, task: "Creative work" },
  { hour: "12:00 PM", energy: "low" as const, task: "Lunch & rest" },
  { hour: "1:00 PM", energy: "rest" as const },
  { hour: "2:00 PM", energy: "medium" as const, task: "Light tasks" },
  { hour: "3:00 PM", energy: "high" as const, task: "Second peak" },
  { hour: "4:00 PM", energy: "medium" as const, task: "Wrap-up" },
  { hour: "5:00 PM", energy: "low" as const, task: "Review & plan" },
];

const badges = [
  { id: "1", emoji: "🔥", title: "On Fire", description: "3-day streak", unlocked: false },
  { id: "2", emoji: "🎯", title: "Bullseye", description: "Complete all tasks", unlocked: false },
  { id: "3", emoji: "🧘", title: "Zen Master", description: "Use calm mode 5x", unlocked: false },
  { id: "4", emoji: "⚡", title: "Power Hour", description: "4 focus sessions", unlocked: false },
  { id: "5", emoji: "🌟", title: "Rising Star", description: "Reach level 5", unlocked: false },
  { id: "6", emoji: "🏆", title: "Champion", description: "Reach level 10", unlocked: false },
];

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [calmMode, setCalmMode] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [reward, setReward] = useState<{ show: boolean; xp: number; message: string }>({
    show: false, xp: 0, message: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login", { replace: true });
  }, [user, loading, navigate]);

  // Load profile
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single() as any;
      if (data) {
        setXp(data.xp || 0);
        setLevel(data.level || 1);
        setStreak(data.streak || 0);
        setProfileName(data.display_name || "");
      }
    })();
  }, [user]);

  // Load tasks
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("tasks").select("*").eq("user_id", user.id).eq("completed", false).order("created_at", { ascending: false }) as any;
      if (data) {
        setTasks(data.map((t: any) => ({
          id: t.id,
          title: t.title,
          emoji: t.emoji || "📝",
          xpReward: t.xp_reward || 25,
          subtasks: (t.subtasks as SubTask[]) || [],
        })));
      }
    })();
  }, [user]);

  const handleTaskCreated = useCallback(async (task: { title: string; emoji: string; xpReward: number; subtasks: SubTask[] }) => {
    if (!user) return;
    const { data, error } = await supabase.from("tasks").insert({
      user_id: user.id,
      title: task.title,
      emoji: task.emoji,
      xp_reward: task.xpReward,
      subtasks: task.subtasks as any,
    } as any).select().single() as any;

    if (error) {
      toast.error("Failed to save task");
      return;
    }

    setTasks((prev) => [{
      id: data.id,
      title: task.title,
      emoji: task.emoji,
      xpReward: task.xpReward,
      subtasks: task.subtasks,
    }, ...prev]);
  }, [user]);

  const handleToggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!user) return;

    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id !== taskId) return task;
        const newSubtasks = task.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s
        );
        // Save to DB
        supabase.from("tasks").update({ subtasks: newSubtasks as any } as any).eq("id", taskId).then();
        
        const justCompleted = newSubtasks.find((s) => s.id === subtaskId)?.done;
        if (justCompleted) {
          const allDone = newSubtasks.every((s) => s.done);
          const xpGain = allDone ? task.xpReward : 10;
          
          // Show reward
          setReward({
            show: true,
            xp: xpGain,
            message: allDone ? `You completed "${task.title}"! 🎉` : "Step completed! Keep going!",
          });

          // Update XP
          const newXp = xp + xpGain;
          const newLevel = Math.floor(newXp / 500) + 1;
          setXp(newXp);
          setLevel(newLevel);
          supabase.from("profiles").update({ xp: newXp, level: newLevel } as any).eq("user_id", user.id).then();

          if (allDone) {
            supabase.from("tasks").update({ completed: true } as any).eq("id", taskId).then();
          }
        }

        return { ...task, subtasks: newSubtasks };
      });
      return updated;
    });
  }, [user, xp]);

  const handleFocusComplete = useCallback(() => {
    const xpGain = 25;
    setReward({ show: true, xp: xpGain, message: "Focus session complete! Great work! 🧠" });
    const newXp = xp + xpGain;
    setXp(newXp);
    if (user) {
      supabase.from("profiles").update({ xp: newXp } as any).eq("user_id", user.id).then();
    }
  }, [xp, user]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const maxXP = level * 500;
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className={`min-h-screen gradient-hero ${calmMode ? "transition-all duration-500" : ""}`}>
      <RewardCelebration
        show={reward.show}
        xp={reward.xp}
        message={reward.message}
        onComplete={() => setReward({ show: false, xp: 0, message: "" })}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-heading font-bold text-lg text-foreground">NeonStar</span>
          </div>
          <div className="flex items-center gap-3">
            <CalmModeToggle enabled={calmMode} onToggle={() => setCalmMode(!calmMode)} />
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {greeting}, {profileName || "friend"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Let's make today productive — one small step at a time.
          </p>
        </motion.div>

        {/* XP Bar */}
        <div className="mb-6">
          <XPBar currentXP={xp % maxXP} maxXP={maxXP} level={level} streak={streak} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — AI Input + Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <AITaskInput onTaskCreated={handleTaskCreated} />

            {tasks.length > 0 && (
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Your Tasks</h2>
                <TaskBreakdown tasks={tasks} onToggleSubtask={handleToggleSubtask} />
              </div>
            )}

            {tasks.length === 0 && (
              <div className="rounded-2xl bg-card border border-border shadow-card p-8 text-center">
                <span className="text-4xl block mb-3">✨</span>
                <h3 className="font-heading font-semibold text-foreground mb-1">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">Type a task above and AI will break it into steps for you!</p>
              </div>
            )}

            {!calmMode && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Energy Schedule</h2>
                <EnergyScheduler blocks={defaultSchedule} />
              </motion.div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <EnergyIndicator level="high" />
            <FocusTimer onComplete={handleFocusComplete} />
            <MoodChecker userId={user.id} />
            {!calmMode && <AchievementBadges badges={badges} />}
          </div>
        </div>
      </div>
    </div>
  );
}
