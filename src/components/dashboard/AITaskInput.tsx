import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface AITaskInputProps {
  onTaskCreated: (task: { title: string; emoji: string; xpReward: number; subtasks: { id: string; text: string; done: boolean }[] }) => void;
}

export function AITaskInput({ onTaskCreated }: AITaskInputProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const voice = useVoiceInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("You must be logged in to use AI features");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-task-breakdown`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ task: input.trim(), type: "breakdown" }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to break down task");
      }

      const result = await response.json();
      if (result && result.title && result.subtasks) {
        onTaskCreated(result);
        setInput("");
        toast.success("Task broken down into steps! 🎯");
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    if (voice.isListening) {
      voice.stopListening();
      return;
    }
    const ok = voice.startListening((text) => {
      setInput(text);
    });
    if (!ok) {
      toast.error("Voice input is not supported in this browser");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card border border-border shadow-card p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">AI Task Breakdown</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Type or speak any task and AI will break it into small, manageable steps
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="e.g. Study for biology exam, Clean my room..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          maxLength={500}
          className="flex-1"
        />
        {voice.supported && (
          <Button
            type="button"
            variant={voice.isListening ? "destructive" : "outline"}
            size="icon"
            onClick={handleVoice}
            disabled={loading}
            title={voice.isListening ? "Stop listening" : "Speak your task"}
          >
            {voice.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Button type="submit" variant="calm" disabled={loading || !input.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>

      <AnimatePresence>
        {voice.isListening && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex items-center gap-2 text-xs text-primary"
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-destructive"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            Listening... speak your task
          </motion.div>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex items-center gap-3 text-sm text-muted-foreground"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
            AI is breaking down your task into steps...
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
