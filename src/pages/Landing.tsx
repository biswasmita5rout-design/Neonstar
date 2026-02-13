import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Shield, Sparkles, Timer, BarChart3, Mic, Trophy, Zap, ChevronRight, Lock, Eye, Server, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Brain,
    title: "AI Task Breakdown",
    description: "Type any task and our AI breaks it into small, manageable steps designed for how your brain works best.",
  },
  {
    icon: Trophy,
    title: "Gamified Rewards",
    description: "Full-screen celebrations, XP points, streaks, and badges. Every step you complete feels like a win.",
  },
  {
    icon: Timer,
    title: "Focus Timer",
    description: "Pomodoro-style timer starts after AI gives you steps. Stay focused, earn rewards, take guilt-free breaks.",
  },
  {
    icon: BarChart3,
    title: "Energy Scheduler",
    description: "AI learns your peak hours and suggests tasks at the right time. Work with your biology, not against it.",
  },
  {
    icon: Mic,
    title: "AI Voice Companion",
    description: "A friendly voice guides every interaction — from adding tasks to celebrating wins. Never feel lost.",
  },
  {
    icon: Sparkles,
    title: "Mood Tracker",
    description: "Log how you're feeling after each task. Track patterns. Understand your productivity rhythms.",
  },
];

const securityFeatures = [
  { icon: Lock, text: "End-to-end encryption for all user data" },
  { icon: Eye, text: "Row-level security — your data is only yours" },
  { icon: Server, text: "SOC 2 compliant cloud infrastructure" },
  { icon: Shield, text: "Zero-knowledge architecture for sensitive info" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="font-heading font-bold text-xl text-foreground">NeonStar</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security</a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth?mode=login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="calm" size="sm">Sign up free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Built for neurodiverse minds</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight mb-6">
              You are a <span className="text-primary">neonstar</span> to shine brighter.
              <br />
              <span className="text-muted-foreground text-2xl md:text-3xl">Welcome to the journey of enjoyment to work.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              NeonStar transforms overwhelming tasks into manageable steps with AI, gamified rewards, 
              and an adaptive schedule that works with your unique biological rhythms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?mode=signup">
                <Button variant="calm" size="lg" className="text-base px-8">
                  Get started free <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-base px-8">
                  See how it works
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Floating badges */}
          <div className="hidden md:block">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-32 left-[10%] bg-card rounded-2xl shadow-card p-3 border border-border"
            >
              <span className="text-3xl">🎯</span>
              <p className="text-xs font-semibold text-foreground mt-1">+50 XP</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-48 right-[8%] bg-card rounded-2xl shadow-card p-3 border border-border"
            >
              <span className="text-3xl">🔥</span>
              <p className="text-xs font-semibold text-foreground mt-1">7-day streak!</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-20 left-[15%] bg-card rounded-2xl shadow-card p-3 border border-border"
            >
              <span className="text-3xl">🏆</span>
              <p className="text-xs font-semibold text-foreground mt-1">Level Up!</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Everything your brain needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Designed with neuroscience and empathy. Every feature helps you focus, celebrate progress, and stay in flow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-6 shadow-card hover:shadow-soft transition-shadow"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 gradient-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Why NeonStar works for ADHD & dyslexic minds
              </h2>
              <div className="space-y-4">
                {[
                  "Tasks broken into tiny steps — no more overwhelm",
                  "Instant dopamine hits with every completed step",
                  "Dyslexia-friendly fonts (Lexend & Nunito)",
                  "Energy-based scheduling adapts to YOUR rhythm",
                  "AI voice companion guides you step by step",
                  "Calm Mode reduces visual noise instantly",
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
              <Link to="/auth?mode=signup" className="inline-block mt-8">
                <Button variant="calm" size="lg">Start your journey</Button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-card border border-border p-8 shadow-card"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <span className="text-2xl">📚</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Study for exam</p>
                    <p className="text-xs text-muted-foreground">AI broke this into 4 simple steps</p>
                  </div>
                  <span className="text-xs font-bold text-primary">+50 XP</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 ring-2 ring-primary/20">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">Step 1: Read summary for 5 min</p>
                    <p className="text-xs text-muted-foreground">Easiest step first — build momentum!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span className="text-2xl">⏳</span>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Step 2: Write 3 key takeaways</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  <span className="text-2xl">⏳</span>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Step 3: Practice 5 quiz questions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Your data is safe with us
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-12">
              We take security seriously. Your personal data, tasks, and progress are protected with enterprise-grade security.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {securityFeatures.map((sf, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-card border border-border p-6 shadow-card"
                >
                  <sf.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">{sf.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Ready to work with your brain, not against it?
          </h2>
          <p className="text-muted-foreground mb-8">Join thousands of neurodiverse individuals who've transformed their productivity.</p>
          <Link to="/auth?mode=signup">
            <Button variant="calm" size="lg" className="text-base px-10">
              Get started for free <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="mx-auto max-w-7xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-heading font-semibold text-foreground">NeonStar</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 NeonStar. Built with ❤️ for neurodiverse minds.</p>
        </div>
      </footer>
    </div>
  );
}
