import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, PauseCircle, Clock, Trophy, Zap, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface TaskRecord {
  id: string;
  title: string;
  emoji: string;
  completed: boolean;
  xp_reward: number;
  subtasks: { id: string; text: string; done: boolean }[];
  created_at: string;
}

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [allTasks, setAllTasks] = useState<TaskRecord[]>([]);
  const [tab, setTab] = useState<"completed" | "in-progress" | "all">("all");

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single() as any;
      if (p) setProfile(p);

      const { data: t } = await supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }) as any;
      if (t) setAllTasks(t);
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedTasks = allTasks.filter((t) => t.completed);
  const inProgressTasks = allTasks.filter((t) => !t.completed);
  const totalXP = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const displayName = profile?.display_name || user.email?.split("@")[0] || "User";

  const filteredTasks = tab === "completed" ? completedTasks : tab === "in-progress" ? inProgressTasks : allTasks;

  const totalSteps = allTasks.reduce((acc, t) => acc + (t.subtasks?.length || 0), 0);
  const doneSteps = allTasks.reduce((acc, t) => acc + (t.subtasks?.filter((s) => s.done).length || 0), 0);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/dashboard")} className="rounded-xl p-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading font-bold text-xl text-foreground">Your Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border shadow-card p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground">{displayName}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Trophy className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{level}</p>
              <p className="text-[10px] text-muted-foreground">Level</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Zap className="h-5 w-5 text-secondary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{totalXP}</p>
              <p className="text-[10px] text-muted-foreground">Total XP</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Target className="h-5 w-5 text-accent mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{completedTasks.length}</p>
              <p className="text-[10px] text-muted-foreground">Tasks Done</p>
            </div>
            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <Clock className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{streak}</p>
              <p className="text-[10px] text-muted-foreground">Day Streak</p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-4 rounded-xl bg-muted/30 p-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Steps completed</span>
              <span>{doneSteps}/{totalSteps}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: totalSteps > 0 ? `${(doneSteps / totalSteps) * 100}%` : "0%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Task History */}
        <div className="mb-4">
          <h2 className="font-heading font-semibold text-lg text-foreground mb-3">Task History</h2>
          <div className="flex gap-2 mb-4">
            {(["all", "completed", "in-progress"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {t === "all" ? `All (${allTasks.length})` : t === "completed" ? `Done (${completedTasks.length})` : `Active (${inProgressTasks.length})`}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredTasks.length === 0 && (
              <div className="rounded-2xl bg-card border border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">No tasks here yet.</p>
              </div>
            )}
            {filteredTasks.map((task) => {
              const done = task.subtasks?.filter((s) => s.done).length || 0;
              const total = task.subtasks?.length || 0;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl bg-card border border-border p-4 flex items-center gap-3"
                >
                  <span className="text-xl">{task.emoji || "📝"}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {done}/{total} steps · +{task.xp_reward} XP
                    </p>
                  </div>
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <PauseCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
