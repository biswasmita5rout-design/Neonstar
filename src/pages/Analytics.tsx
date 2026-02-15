import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Smile, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Analytics() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [moodLogs, setMoodLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: t }, { data: m }] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("mood_logs").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      ]);
      if (t) setTasks(t);
      if (m) setMoodLogs(m);
    })();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completed = tasks.filter((t) => t.completed);
  const active = tasks.filter((t) => !t.completed);
  const totalXP = tasks.reduce((acc, t) => acc + (t.completed ? t.xp_reward : 0), 0);

  // Tasks per day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en", { weekday: "short" });
    const count = completed.filter((t) => t.created_at?.startsWith(key)).length;
    return { label, count };
  });

  // Mood distribution
  const moodCounts: Record<string, number> = {};
  moodLogs.forEach((m) => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
  const moodData = Object.entries(moodCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ["hsl(160,50%,45%)", "hsl(200,50%,50%)", "hsl(45,80%,55%)", "hsl(25,70%,55%)", "hsl(0,60%,50%)"];

  return (
    <div className="min-h-screen gradient-hero">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/dashboard")} className="rounded-xl p-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <BarChart3 className="h-5 w-5 text-primary" />
          <h1 className="font-heading font-bold text-xl text-foreground">Analytics</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Tasks", value: tasks.length, icon: "📋" },
            { label: "Completed", value: completed.length, icon: "✅" },
            { label: "Active", value: active.length, icon: "🔄" },
            { label: "XP Earned", value: totalXP, icon: "⚡" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border shadow-card p-4 text-center">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tasks per day chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card border border-border shadow-card p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Tasks Completed (Last 7 Days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Mood distribution */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Mood Distribution</h3>
            </div>
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={moodData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name }) => name}>
                    {moodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No mood data yet</p>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-card border border-border shadow-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Completion Rate</h3>
            </div>
            <div className="flex flex-col items-center justify-center h-[180px]">
              <p className="text-5xl font-bold text-primary">
                {tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {completed.length} of {tasks.length} tasks completed
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
