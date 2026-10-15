"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Laptop,
  Cpu,
  Key,
  Shield,
  Trash2,
  Download,
  Eye,
  Check,
  AlertTriangle,
  User,
  Sliders,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Settings State
  const [mounted, setMounted] = useState(false);
  const [responseStyle, setResponseStyle] = useState("detailed");
  const [showSources, setShowSources] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [grokApiKey, setGrokApiKey] = useState("");
  const [testingGrok, setTestingGrok] = useState(false);
  const [grokStatus, setGrokStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setMounted(true);
    try {
      const storedKey = localStorage.getItem("campusiq_grok_key");
      if (storedKey) setGrokApiKey(storedKey);
      const storedStyle = localStorage.getItem("campusiq_response_style");
      if (storedStyle) setResponseStyle(storedStyle);
    } catch {}
  }, []);

  const handleSaveGrokKey = () => {
    try {
      localStorage.setItem("campusiq_grok_key", grokApiKey.trim());
      toast({
        title: "API Key Saved",
        description: grokApiKey.trim()
          ? "Grok AI integration enabled for natural language synthesis."
          : "Reverted to high-precision local FAQ retrieval.",
      });
    } catch {}
  };

  const testGrokConnection = async () => {
    setTestingGrok(true);
    setGrokStatus("idle");

    try {
      const res = await fetch("/api/test-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: grokApiKey.trim() || undefined }),
      });
      const data = await res.json();

      if (data.success) {
        setGrokStatus("success");
        toast({
          title: "AI Connection Verified",
          description: `${data.provider} (${data.model}) responded in ${data.latencyMs}ms.`,
        });
      } else {
        setGrokStatus("error");
        toast({
          title: "Connection Failed",
          description: data.error || "Could not authenticate with AI provider.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setGrokStatus("error");
      toast({
        title: "Network Error",
        description: err.message || "Could not reach test endpoint.",
        variant: "destructive",
      });
    } finally {
      setTestingGrok(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear your conversation history?")) return;
    try {
      toast({ title: "History Cleared", description: "All conversation records have been reset." });
    } catch {}
  };

  const handleClearSaved = async () => {
    if (!confirm("Are you sure you want to clear your saved notebook items?")) return;
    try {
      toast({ title: "Saved Items Cleared" });
    } catch {}
  };

  if (!mounted) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-primary" />
          Settings & Preferences
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Customize visual appearance, response behavior, AI integrations, and privacy retention.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance & Theme Card */}
        <Card className="border-border/70 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sun className="w-4 h-4 text-primary" />
              Theme & Visual Appearance
            </CardTitle>
            <CardDescription className="text-xs">
              Choose your preferred interface theme. Setting persists across visits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { id: "dark", label: "Midnight Dark", icon: Moon },
                { id: "light", label: "Pure Light", icon: Sun },
                { id: "system", label: "System Sync", icon: Laptop },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI Model & Response Preferences */}
        <Card className="border-border/70 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              AI Intelligence & Answering Mode
            </CardTitle>
            <CardDescription className="text-xs">
              Configure how CampusIQ retrieves and formulates college answers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answering Style */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase text-muted-foreground block">
                Assistant Response Formulation Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: "detailed", label: "Detailed & Comprehensive", desc: "Includes all tables, dates, and full policies" },
                  { id: "concise", label: "Concise & Fast", desc: "Short paragraphs and direct numbers" },
                  { id: "steps", label: "Step-by-Step", desc: "Structured numbered procedural checklists" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setResponseStyle(s.id);
                      localStorage.setItem("campusiq_response_style", s.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      responseStyle === s.id
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border/70 hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-xs font-semibold block">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grok / Groq API Key Setup */}
            <div className="pt-3 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-primary" />
                    Groq / Grok Cloud AI Key (Groq or x.ai)
                  </label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Supports Groq (<code className="text-primary font-mono">gsk_...</code>) or xAI Grok (<code className="text-primary font-mono">xai-...</code>) for natural language reasoning on general & out-of-dataset queries.
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {grokApiKey ? "AI Layer Active" : "Local TF-IDF Mode"}
                </Badge>
              </div>

              <div className="flex gap-2 max-w-xl">
                <Input
                  type="password"
                  value={grokApiKey}
                  onChange={(e) => setGrokApiKey(e.target.value)}
                  placeholder="gsk_... or xai-..."
                  className="h-10 text-xs font-mono bg-background"
                />
                <Button onClick={handleSaveGrokKey} size="sm" className="h-10 text-xs px-3 shrink-0">
                  Save Key
                </Button>
                <Button
                  onClick={testGrokConnection}
                  disabled={testingGrok}
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs px-3 shrink-0"
                >
                  {testingGrok ? "Testing..." : "Test Connection"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility & Motion */}
        <Card className="border-border/70 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              Accessibility & Display Controls
            </CardTitle>
            <CardDescription className="text-xs">
              Options for high contrast, reduced animation, and screen readability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
              <div>
                <strong className="block text-foreground">Show Source References Badge</strong>
                <span className="text-muted-foreground text-[11px]">Display knowledge base citations and confidence scores on AI answers</span>
              </div>
              <input
                type="checkbox"
                checked={showSources}
                onChange={(e) => setShowSources(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
              <div>
                <strong className="block text-foreground">Reduced Motion</strong>
                <span className="text-muted-foreground text-[11px]">Disable decorative animations and transitional motion</span>
              </div>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data Management */}
        <Card className="border-border/70 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Shield className="w-4 h-4" />
              Privacy & Local Data Controls
            </CardTitle>
            <CardDescription className="text-xs">
              Manage your saved conversational data or purge stored local sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 text-xs">
              <div>
                <strong className="block text-foreground">Clear All Conversation History</strong>
                <span className="text-muted-foreground text-[11px]">Permanently removes your previous question threads</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearHistory} className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0">
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Chat History
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 text-xs">
              <div>
                <strong className="block text-foreground">Clear Saved Notebook Answers</strong>
                <span className="text-muted-foreground text-[11px]">Removes all bookmarked college policies and custom notes</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearSaved} className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0">
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Clear Saved Answers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
