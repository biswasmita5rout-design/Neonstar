import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks cursor idle state. Fires callback when cursor stays still
 * for `idleMs` milliseconds. Resets on movement.
 */
export function useNovaSmartSpeaker(idleMs = 3000) {
  const [cursorIdle, setCursorIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - lastPosRef.current.x);
      const dy = Math.abs(e.clientY - lastPosRef.current.y);
      lastPosRef.current = { x: e.clientX, y: e.clientY };

      // Only reset if cursor actually moved significantly (>5px)
      if (dx < 5 && dy < 5) return;

      setCursorIdle(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCursorIdle(true), idleMs);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idleMs]);

  return cursorIdle;
}

/**
 * Adaptive profile settings that auto-adjust based on user behavior.
 */
export interface AdaptiveProfile {
  preferredStepSize: "tiny" | "small" | "medium"; // how small to break tasks
  speakFrequency: "minimal" | "moderate" | "frequent"; // how often Nova speaks
  breakFrequency: "often" | "normal" | "rare"; // how often to suggest breaks
  overwhelmThreshold: number; // 1-10, how many active subtasks before suggesting break
}

const DEFAULT_PROFILE: AdaptiveProfile = {
  preferredStepSize: "small",
  speakFrequency: "moderate",
  breakFrequency: "normal",
  overwhelmThreshold: 5,
};

export function useAdaptiveProfile() {
  const [profile, setProfile] = useState<AdaptiveProfile>(() => {
    try {
      const saved = localStorage.getItem("nova-adaptive-profile");
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const updateProfile = useCallback((partial: Partial<AdaptiveProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("nova-adaptive-profile", JSON.stringify(next));
      return next;
    });
  }, []);

  return { profile, updateProfile };
}
