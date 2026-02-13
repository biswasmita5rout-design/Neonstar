import { useCallback, useRef, useState } from "react";

// NOVA - AI Voice Companion using Web Speech API
const NOVA_HINTS: Record<string, string> = {
  "ai-task-input": "Add your task, I will help you break it down into small steps!",
  "focus-timer": "Start a focus session to stay productive and earn XP!",
  "mood-checker": "Tell me how you're feeling. I'll adjust to support you better.",
  "energy-schedule": "Your energy schedule helps you work with your natural rhythm.",
  "xp-bar": "Keep completing tasks to level up and unlock achievements!",
  "achievement-badges": "Collect badges by building streaks and completing challenges!",
  "calm-mode": "Toggle calm mode to reduce visual noise when you need peace.",
  "logout-button": "See you next time! Your progress is saved.",
  "profile-button": "View your profile details and settings.",
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
    utterance.rate = 0.95;
    utterance.pitch = 1.15;
    utterance.volume = 0.8;

    // Try to pick a friendly female voice
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
        }, 10000);
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

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, speakHint, stop, isSpeaking, lastMessage };
}
