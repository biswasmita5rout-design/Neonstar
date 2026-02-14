import { useCallback, useRef, useState } from "react";

// NOVA - AI Voice Companion using Web Speech API
// Calm, soft, non-irritating voice. Speaks only when needed.
const NOVA_HINTS: Record<string, string> = {
  "ai-task-input": "Add your task here. I will break it into small, easy steps for you.",
  "focus-timer": "Start a focus session when you are ready. No rush.",
  "mood-checker": "Tell me how you feel. I will support you.",
  "energy-schedule": "Your energy schedule helps you work with your body's rhythm.",
  "xp-bar": "You earn XP by finishing steps. Keep going, you are doing great.",
  "achievement-badges": "Collect badges by building good habits. One step at a time.",
  "calm-mode": "Turn on calm mode to make things quieter and simpler.",
  "logout-button": "See you next time. Your progress is saved safely.",
  "profile-button": "Check your profile and see how far you have come.",
  "adaptive-profile": "Adjust how Nova helps you. Make it work for your style.",
};

const MOOD_HINTS: Record<string, string> = {
  "great": "Great means you feel happy, energetic, and ready to go. A wonderful place to be!",
  "good": "Good means you are feeling okay and steady. A nice calm state.",
  "okay": "Okay means things are alright, not too high, not too low. That is perfectly fine.",
  "low": "Low energy means you might feel tired or slow today. Be gentle with yourself.",
  "struggling": "Struggling means things feel hard right now. That is okay. Take it one tiny step at a time.",
  "energy-high": "High energy means you feel alert and strong. Great time for important tasks.",
  "energy-medium": "Medium energy means you are balanced. Good for steady work.",
  "energy-low": "Low energy means your body needs rest. Do light tasks or take a break.",
};

export function useNova() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const cooldownRef = useRef<string | null>(null);

  const speak = useCallback((text: string, id?: string) => {
    // Prevent repeating the same hint rapidly
    if (id && cooldownRef.current === id) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    // Calm, soft, slow voice - non-irritating
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 0.6;

    // Pick a gentle voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.name.includes("Google") && v.name.includes("Female")
    ) || voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
      || voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (id) {
        cooldownRef.current = id;
        setTimeout(() => {
          if (cooldownRef.current === id) cooldownRef.current = null;
        }, 15000); // Longer cooldown to avoid repetition
      }
    };

    utteranceRef.current = utterance;
    setLastMessage(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakHint = useCallback((elementId: string) => {
    const hint = NOVA_HINTS[elementId];
    if (hint) speak(hint, elementId);
  }, [speak]);

  const speakMoodHint = useCallback((moodId: string) => {
    const hint = MOOD_HINTS[moodId];
    if (hint) speak(hint, `mood-${moodId}`);
  }, [speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, speakHint, speakMoodHint, stop, isSpeaking, lastMessage };
}
