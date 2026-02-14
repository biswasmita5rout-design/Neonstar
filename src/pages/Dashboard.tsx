import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNova } from "@/hooks/useNova";
import { useNovaSmartSpeaker, useAdaptiveProfile } from "@/hooks/useNovaSmartSpeaker";
import { supabase } from "@/integrations/supabase/client";
import { AITaskInput } from "@/components/dashboard/AITaskInput";
import { TaskBreakdown } from "@/components/TaskBreakdown";
import { GuidedTaskView } from "@/components/dashboard/GuidedTaskView";
import { FocusTimer } from "@/components/FocusTimer";
import { EnergyScheduler } from "@/components/EnergyScheduler";
import { AchievementBadges } from "@/components/AchievementBadges";
import { MoodChecker } from "@/components/dashboard/MoodChecker";
import { RewardCelebration } from "@/components/dashboard/RewardCelebration";
import { NovaCompanion } from "@/components/dashboard/NovaCompanion";
import { NovaHoverZone } from "@/components/dashboard/NovaHoverZone";
import { ProfileDropdown } from "@/components/dashboard/ProfileDropdown";
import { TaskNotification } from "@/components/dashboard/TaskNotification";
import { AdaptiveProfilePanel } from "@/components/dashboard/AdaptiveProfilePanel";
import { XPBar } from "@/components/XPBar";
import { EnergyIndicator } from "@/components/EnergyIndicator";
import { CalmModeToggle } from "@/components/CalmModeToggle";
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
  const nova = useNova();
  const cursorIdle = useNovaSmartSpeaker(3000);
  const { profile: adaptiveProfile, updateProfile: updateAdaptiveProfile } = useAdaptiveProfile();
  const [novaMuted, setNovaMuted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [guidedTaskId, setGuidedTaskId] = useState<string | null>(null);
  const [calmMode, setCalmMode] = useState(false);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [profileName, setProfileName] = useState("");
  const [reward, setReward] = useState<{ show: boolean; xp: number; message: string }>({
    show: false, xp: 0, message: "",
  });
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "info" | "timer-prompt";
  }>({ show: false, message: "", type: "info" });

  const focusTimerRef = useRef<{ start: () => void } | null>(null);

  // Smart speaking: only speak hints when cursor is idle
  const handleNovaHover = useCallback((id: string) => {
    if (!novaMuted && cursorIdle && adaptiveProfile.speakFrequency !== "minimal") {
      nova.speakHint(id);
    }
  }, [nova, novaMuted, cursorIdle, adaptiveProfile.speakFrequency]);

  const handleMoodHover = useCallback((moodId: string) => {
    if (!novaMuted && cursorIdle) {
      nova.speakMoodHint(moodId);
    }
  }, [nova, novaMuted, cursorIdle]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login", { replace: true });
  }, [user, loading, navigate]);

  // Greet user on load - calm and short
  useEffect(() => {
    if (user && profileName && !novaMuted) {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
      nova.speak(`${greeting}, ${profileName}. Let us make today a good day.`);
    }
  }, [profileName]); // eslint-disable-line react-hooks/exhaustive-deps

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

    const newTask: Task = {
      id: data.id,
      title: task.title,
      emoji: task.emoji,
      xpReward: task.xpReward,
      subtasks: task.subtasks,
    };

    setTasks((prev) => [newTask, ...prev]);
    // Auto-enter guided mode for the new task
    setGuidedTaskId(data.id);

    toast.success(`✨ New task: "${task.title}" with ${task.subtasks.length} steps!`);

    // Nova reads just the first step calmly - guided view handles this
    if (!novaMuted) {
      nova.speak(
        `I have broken "${task.title}" into ${task.subtasks.length} small steps. Let us start with the first one.`
      );
    }

    // Prompt to start timer
    setTimeout(() => {
      setNotification({
        show: true,
        message: `Ready to work on "${task.title}"? Want me to start a focus timer?`,
        type: "timer-prompt",
      });
    }, 3000);
  }, [user, nova, novaMuted]);

  const handleStartTimerFromNotification = useCallback(() => {
    setNotification({ show: false, message: "", type: "info" });
    focusTimerRef.current?.start();
    if (!novaMuted) {
      nova.speak("Focus timer started. You can do this.");
    }
    toast.success("⏱️ Focus timer started!");
  }, [nova, novaMuted]);

  const handleToggleSubtask = useCallback(async (taskId: string, subtaskId: string) => {
    if (!user) return;

    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id !== taskId) return task;
        const newSubtasks = task.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, done: !s.done } : s
        );
        supabase.from("tasks").update({ subtasks: newSubtasks as any } as any).eq("id", taskId).then();
        
        const justCompleted = newSubtasks.find((s) => s.id === subtaskId)?.done;
        if (justCompleted) {
          const allDone = newSubtasks.every((s) => s.done);
          const xpGain = allDone ? task.xpReward : 10;
          
          setReward({
            show: true,
            xp: xpGain,
            message: allDone ? `You completed "${task.title}"! 🎉` : "Step done! Keep going!",
          });

          if (allDone) {
            toast.success(`🎉 Task "${task.title}" completed! +${xpGain} XP`);
            if (!novaMuted) {
              nova.speak(`Amazing! You finished "${task.title}". You earned ${xpGain} XP. Well done!`);
            }
          } else {
            const remaining = newSubtasks.filter(s => !s.done).length;
            toast.info(`✅ Step done! ${remaining} steps left. +10 XP`);
          }

          const newXp = xp + xpGain;
          const newLevel = Math.floor(newXp / 500) + 1;
          setXp(newXp);
          setLevel(newLevel);
          supabase.from("profiles").update({ xp: newXp, level: newLevel } as any).eq("user_id", user.id).then();

          if (allDone) {
            supabase.from("tasks").update({ completed: true } as any).eq("id", taskId).then();
            setGuidedTaskId(null);
          }
        }

        return { ...task, subtasks: newSubtasks };
      });
      return updated;
    });
  }, [user, xp, nova, novaMuted]);

  const handleFocusComplete = useCallback(() => {
    const xpGain = 25;
    setReward({ show: true, xp: xpGain, message: "Focus session complete! Great work! 🧠" });
    const newXp = xp + xpGain;
    setXp(newXp);
    toast.success("🧠 Focus session complete! +25 XP");
    if (user) {
      supabase.from("profiles").update({ xp: newXp } as any).eq("user_id", user.id).then();
    }
    if (!novaMuted) {
      nova.speak("Focus session done. You earned 25 XP. Take a moment to rest.");
    }
  }, [xp, user, nova, novaMuted]);

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
  const guidedTask = guidedTaskId ? tasks.find((t) => t.id === guidedTaskId) : null;

  return (
    <div className={`min-h-screen gradient-hero ${calmMode ? "transition-all duration-500" : ""}`}>
      <RewardCelebration
        show={reward.show}
        xp={reward.xp}
        message={reward.message}
        onComplete={() => setReward({ show: false, xp: 0, message: "" })}
      />

      <TaskNotification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onStartTimer={handleStartTimerFromNotification}
        onDismiss={() => setNotification({ show: false, message: "", type: "info" })}
      />

      <NovaCompanion
        isSpeaking={nova.isSpeaking}
        lastMessage={nova.lastMessage}
        onToggleMute={() => {
          const next = !novaMuted;
          setNovaMuted(next);
          if (next) nova.stop();
          else nova.speak("I am here. How can I help?");
        }}
        muted={novaMuted}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-heading font-bold text-lg text-foreground">NeonStar</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/profile")}
              className="rounded-full p-2 hover:bg-muted/50 transition-colors"
              title="Your Profile"
            >
              <User className="h-4 w-4 text-muted-foreground" />
            </button>
            <NovaHoverZone id="calm-mode" onHover={handleNovaHover}>
              <CalmModeToggle enabled={calmMode} onToggle={() => setCalmMode(!calmMode)} />
            </NovaHoverZone>
            <NovaHoverZone id="profile-button" onHover={handleNovaHover}>
              <ProfileDropdown
                displayName={profileName}
                email={user.email || ""}
                level={level}
                xp={xp}
                onSignOut={signOut}
              />
            </NovaHoverZone>
          </div>
        </div>

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground">
            {greeting}, {profileName || "friend"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            One small step at a time. No rush.
          </p>
        </motion.div>

        {/* XP Bar */}
        <NovaHoverZone id="xp-bar" onHover={handleNovaHover} className="mb-6">
          <XPBar currentXP={xp % maxXP} maxXP={maxXP} level={level} streak={streak} />
        </NovaHoverZone>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left — AI Input + Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <NovaHoverZone id="ai-task-input" onHover={handleNovaHover}>
              <AITaskInput onTaskCreated={handleTaskCreated} />
            </NovaHoverZone>

            {/* Guided Task View - one step at a time */}
            {guidedTask && !guidedTask.subtasks.every((s) => s.done) && (
              <GuidedTaskView
                taskTitle={guidedTask.title}
                taskEmoji={guidedTask.emoji}
                subtasks={guidedTask.subtasks}
                onCompleteStep={(subtaskId) => handleToggleSubtask(guidedTask.id, subtaskId)}
                onNovaSpeak={nova.speak}
                novaMuted={novaMuted}
              />
            )}

            {tasks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-heading font-semibold text-lg text-foreground">Your Tasks</h2>
                  {guidedTaskId && (
                    <button
                      onClick={() => setGuidedTaskId(null)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Exit guided mode
                    </button>
                  )}
                </div>
                <TaskBreakdown
                  tasks={tasks}
                  onToggleSubtask={handleToggleSubtask}
                  onStartGuided={(taskId) => setGuidedTaskId(taskId)}
                  guidedTaskId={guidedTaskId}
                />
              </div>
            )}

            {tasks.length === 0 && (
              <div className="rounded-2xl bg-card border border-border shadow-card p-8 text-center">
                <span className="text-4xl block mb-3">✨</span>
                <h3 className="font-heading font-semibold text-foreground mb-1">No tasks yet</h3>
                <p className="text-sm text-muted-foreground">Type a task above and I will break it into easy steps for you!</p>
              </div>
            )}

            {!calmMode && (
              <NovaHoverZone id="energy-schedule" onHover={handleNovaHover}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Energy Schedule</h2>
                  <EnergyScheduler blocks={defaultSchedule} />
                </motion.div>
              </NovaHoverZone>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <EnergyIndicator level="high" />
            <NovaHoverZone id="focus-timer" onHover={handleNovaHover}>
              <FocusTimer ref={focusTimerRef} onComplete={handleFocusComplete} />
            </NovaHoverZone>
            <NovaHoverZone id="mood-checker" onHover={handleNovaHover}>
              <MoodChecker userId={user.id} onMoodHover={handleMoodHover} />
            </NovaHoverZone>
            {!calmMode && (
              <>
                <NovaHoverZone id="achievement-badges" onHover={handleNovaHover}>
                  <AchievementBadges badges={badges} />
                </NovaHoverZone>
                <NovaHoverZone id="adaptive-profile" onHover={handleNovaHover}>
                  <AdaptiveProfilePanel profile={adaptiveProfile} onUpdate={updateAdaptiveProfile} />
                </NovaHoverZone>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
