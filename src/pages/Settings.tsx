import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Globe, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

export default function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth?mode=login", { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("language_preference")
        .eq("user_id", user.id)
        .single() as any;
      if (data?.language_preference) setLang(data.language_preference);
    })();
  }, [user]);

  const handleSave = async (code: string) => {
    if (!user) return;
    setLang(code);
    setSaving(true);
    await supabase.from("profiles").update({ language_preference: code } as any).eq("user_id", user.id);
    setSaving(false);
    toast.success("Language preference saved!");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/dashboard")} className="rounded-xl p-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading font-bold text-xl text-foreground">Settings</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border shadow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-heading font-semibold text-foreground">Language Preference</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Choose the language Nova speaks in. This also changes voice recognition language.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => handleSave(l.code)}
                disabled={saving}
                className={`rounded-xl p-3 text-left transition-all ${
                  lang === l.code
                    ? "bg-primary/10 ring-2 ring-primary/30"
                    : "bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <span className="text-sm font-medium text-foreground block">{l.label}</span>
                <span className="text-xs text-muted-foreground">{l.native}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
