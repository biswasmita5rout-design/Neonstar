import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileDropdownProps {
  displayName: string;
  email: string;
  level: number;
  xp: number;
  onSignOut: () => void;
}

export function ProfileDropdown({ displayName, email, level, xp, onSignOut }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const initials = (displayName || email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full bg-card border border-border px-3 py-1.5 hover:bg-muted/50 transition-colors"
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[100px] truncate">
          {displayName || "User"}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl bg-card border border-border shadow-soft p-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
              </div>

              <div className="rounded-xl bg-muted/50 p-3 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold text-primary">{level}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-muted-foreground">Total XP</span>
                  <span className="font-semibold text-foreground">{xp}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="w-full flex items-center gap-2 rounded-xl p-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
