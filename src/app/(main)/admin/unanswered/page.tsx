"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HelpCircle,
  PlusCircle,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FAQ_CATEGORIES } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface UnansweredQuestion {
  id: string;
  question: string;
  category?: string | null;
  createdAt: string;
  isResolved: boolean;
}

export default function AdminUnansweredPage() {
  const { toast } = useToast();

  const [questions, setQuestions] = useState<UnansweredQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert Modal
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<UnansweredQuestion | null>(null);
  const [faqAnswer, setFaqAnswer] = useState("");
  const [faqCategory, setFaqCategory] = useState("admissions");
  const [faqKeywords, setFaqKeywords] = useState("");
  const [converting, setConverting] = useState(false);

  const fetchUnanswered = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/unanswered");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data || []);
      }
    } catch {
      toast({ title: "Failed to load unanswered queue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnanswered();
  }, []);

  const openConvertModal = (q: UnansweredQuestion) => {
    setSelectedQuestion(q);
    setFaqCategory(q.category || "admissions");
    setFaqKeywords(q.question.toLowerCase());
    setFaqAnswer("");
    setConvertModalOpen(true);
  };

  const handleConvertToFaq = async () => {
    if (!selectedQuestion || !faqAnswer.trim()) {
      toast({ title: "Answer is required", variant: "destructive" });
      return;
    }

    setConverting(true);
    try {
      const res = await fetch(`/api/admin/unanswered/${selectedQuestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          convertToFaq: true,
          answer: faqAnswer.trim(),
          category: faqCategory,
          keywords: faqKeywords.trim(),
        }),
      });

      if (res.ok) {
        toast({
          title: "Converted to Verified FAQ",
          description: "This question is now published in the knowledge base and retrievable by all users.",
        });
        setQuestions((prev) => prev.filter((q) => q.id !== selectedQuestion.id));
        setConvertModalOpen(false);
      } else {
        toast({ title: "Failed to convert FAQ", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error converting question", variant: "destructive" });
    } finally {
      setConverting(false);
    }
  };

  const dismissQuestion = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/unanswered/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isResolved: true }),
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        toast({ title: "Enquiry Dismissed / Resolved" });
      }
    } catch {
      toast({ title: "Failed to dismiss enquiry", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
              Administration
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-semibold text-primary">Unanswered Queue</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
            <HelpCircle className="h-6 w-6 text-amber-400" />
            Unanswered Enquiry Review Queue
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Identify knowledge gaps from student queries and transform them into verified answers.
          </p>
        </div>

        <Link href="/admin/faqs">
          <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
            <BookOpen className="w-3.5 h-3.5" />
            View Knowledge Base
          </Button>
        </Link>
      </div>

      {/* Explanatory Callout */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
        <span>
          <strong>Continuous Knowledge Improvement:</strong> When a user asks an enquiry that does
          not meet our confidence threshold, it is automatically routed here. Converting an enquiry
          instantly updates the TF-IDF search index.
        </span>
      </div>

      {/* Queue List */}
      {loading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-card/40 rounded-2xl border border-dashed border-border/80">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Unanswered Queue is Clear!</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm mx-auto">
              All student enquiries have been addressed or confidently resolved by the knowledge base.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Card
              key={q.id}
              className="p-4 border-border/70 bg-card hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground/95">{q.question}</span>
                  {q.category && (
                    <Badge variant="outline" className="text-[10px] uppercase font-normal py-0">
                      {q.category}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Recorded {formatRelativeTime(q.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => openConvertModal(q)}
                  className="h-8 gap-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Convert to Verified FAQ
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissQuestion(q.id)}
                  className="h-8 text-xs text-muted-foreground hover:text-foreground"
                >
                  Dismiss
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Convert to FAQ Dialog */}
      <Dialog open={convertModalOpen} onOpenChange={setConvertModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Convert Student Enquiry to Verified FAQ</DialogTitle>
            <DialogDescription>
              Write the official verified answer. Once published, the conversational assistant and FAQ search will answer this query accurately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold uppercase text-muted-foreground block mb-1">
                Student Enquiry Question
              </label>
              <div className="p-3 rounded-lg bg-muted/40 border border-border/50 font-medium text-foreground">
                {selectedQuestion?.question}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold uppercase text-muted-foreground block mb-1">
                  Assign Category
                </label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 text-xs"
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase text-muted-foreground block mb-1">
                  Keywords for Search Matching
                </label>
                <Input
                  value={faqKeywords}
                  onChange={(e) => setFaqKeywords(e.target.value)}
                  placeholder="e.g. fees, refund, deadline, hostel"
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold uppercase text-muted-foreground block mb-1">
                Official Institutional Answer (Markdown supported) <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={faqAnswer}
                onChange={(e) => setFaqAnswer(e.target.value)}
                placeholder="Provide accurate, comprehensive facts with headings, bullet lists, fee amounts, and responsible department..."
                rows={8}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvertToFaq} disabled={converting}>
              {converting ? "Publishing FAQ..." : "Publish Verified FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
