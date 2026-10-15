"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  Flag,
  Share2,
  ExternalLink,
  GraduationCap,
  CreditCard,
  Award,
  Home,
  Bus,
  Library,
  Building2,
  FileText,
  Briefcase,
  Users,
  Phone,
  Info,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FAQ_CATEGORIES, FAQCategory } from "@/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string | null;
  keywords: string;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  lastUpdated: string;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  admissions: GraduationCap,
  courses: BookOpen,
  eligibility: CheckCircle2,
  fees: CreditCard,
  scholarships: Award,
  hostel: Home,
  transportation: Bus,
  library: Library,
  campus: Building2,
  examinations: FileText,
  placements: Briefcase,
  faculty: Users,
  contact: Phone,
  general: Info,
};

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "");
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save Modal
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [faqToSave, setFaqToSave] = useState<FAQItem | null>(null);
  const [saveCollection, setSaveCollection] = useState("Admissions 2026");
  const [saveNotes, setSaveNotes] = useState("");

  // Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [faqToReport, setFaqToReport] = useState<FAQItem | null>(null);
  const [reportReason, setReportReason] = useState<"OUTDATED" | "INCORRECT" | "INCOMPLETE" | "CONFUSING">("OUTDATED");
  const [reportComment, setReportComment] = useState("");

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      params.set("limit", "50");

      const res = await fetch(`/api/faqs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
        setTotal(data.total || 0);

        // Auto expand first 2 results if searching
        if (search.trim() && data.faqs?.length > 0) {
          const autoExpand: Record<string, boolean> = {};
          data.faqs.slice(0, 3).forEach((f: FAQItem) => {
            autoExpand[f.id] = true;
          });
          setExpandedIds(autoExpand);
        }
      }
    } catch {
      toast({ title: "Failed to load FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFaqs();
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyAnswer = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard" });
  };

  const handleRate = async (id: string, type: "HELPFUL" | "UNHELPFUL") => {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqId: id, type }),
      });

      setFaqs((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            return {
              ...f,
              helpfulCount: type === "HELPFUL" ? f.helpfulCount + 1 : f.helpfulCount,
              unhelpfulCount: type === "UNHELPFUL" ? f.unhelpfulCount + 1 : f.unhelpfulCount,
            };
          }
          return f;
        })
      );

      toast({
        title: type === "HELPFUL" ? "Marked as helpful" : "Feedback recorded",
        description: "Thank you for helping us maintain accurate college answers.",
      });
    } catch {
      toast({ title: "Feedback submission failed", variant: "destructive" });
    }
  };

  const openSave = (faq: FAQItem) => {
    setFaqToSave(faq);
    setSaveCollection(faq.category.charAt(0).toUpperCase() + faq.category.slice(1));
    setSaveNotes("");
    setSaveModalOpen(true);
  };

  const confirmSave = async () => {
    if (!faqToSave) return;
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faqId: faqToSave.id,
          title: faqToSave.question,
          content: faqToSave.answer,
          category: faqToSave.category,
          collection: saveCollection,
          notes: saveNotes,
        }),
      });

      if (res.ok) {
        toast({ title: "Saved to Personal Notebook", description: `Added to "${saveCollection}"` });
        setSaveModalOpen(false);
      } else {
        const d = await res.json();
        toast({ title: "Could not save", description: d.error || "Please sign in to save items.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error saving FAQ", variant: "destructive" });
    }
  };

  const openReport = (faq: FAQItem) => {
    setFaqToReport(faq);
    setReportReason("OUTDATED");
    setReportComment("");
    setReportModalOpen(true);
  };

  const submitReport = async () => {
    if (!faqToReport) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faqId: faqToReport.id,
          type: "REPORT",
          reportReason,
          comment: reportComment,
        }),
      });

      toast({
        title: "Report Submitted",
        description: "The administration knowledge team will review this FAQ entry.",
      });
      setReportModalOpen(false);
    } catch {
      toast({ title: "Error submitting report", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            Explore Knowledge Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Search verified institutional FAQs across {FAQ_CATEGORIES.length} categories or browse answers directly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-xs border-primary/30 text-primary">
            {total} Verified Entries
          </Badge>
        </div>
      </div>

      {/* Prominent Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by keywords (e.g. B.Tech admission, hostel curfew, merit scholarship, refund policy)..."
          className="h-14 pl-12 pr-28 text-base rounded-2xl border-border/80 bg-card focus:ring-2 focus:ring-primary/20 shadow-sm"
        />
        <Button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 gap-1.5 h-9 rounded-xl">
          Search
        </Button>
      </form>

      {/* Category Pills Slider / Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Browse by Category
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory("")}
              className="text-xs text-primary hover:underline"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("")}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5",
              selectedCategory === ""
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card border-border/70 hover:border-primary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            All Categories ({total})
          </button>

          {FAQ_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all shrink-0 flex items-center gap-1.5",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card border-border/70 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Results List */}
      {loading ? (
        <div className="space-y-3 py-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card rounded-xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-card/40 rounded-2xl border border-dashed border-border/80">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">No matching FAQ entries found</h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm mx-auto">
              We couldn&apos;t find an exact match for &quot;{search}&quot;. Try broader terms or ask our AI assistant to analyze related college documents.
            </p>
          </div>
          <Link href={`/assistant?q=${encodeURIComponent(search)}`}>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isExpanded = !!expandedIds[faq.id];
            const Icon = CATEGORY_ICONS[faq.category] || BookOpen;

            return (
              <Card
                key={faq.id}
                className={cn(
                  "border-border/70 bg-card transition-all duration-200 overflow-hidden",
                  isExpanded && "border-primary/40 shadow-sm"
                )}
              >
                {/* FAQ Header Row */}
                <div
                  onClick={() => toggleExpand(faq.id)}
                  className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-foreground/95 hover:text-primary transition-colors">
                          {faq.question}
                        </span>
                        <Badge variant="outline" className="text-[10px] uppercase py-0 font-normal">
                          {faq.category}
                        </Badge>
                      </div>
                      {!isExpanded && (
                        <p className="text-xs text-muted-foreground/80 line-clamp-1">
                          {faq.answer.replace(/[#*`]/g, "")}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-1">
                    <div className="text-[11px] text-muted-foreground/70 hidden sm:block">
                      {faq.helpfulCount > 0 && `${faq.helpfulCount} found helpful`}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-border/40 space-y-4 bg-muted/[0.04] animate-fade-in">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 text-sm leading-relaxed">
                      <ReactMarkdown>{faq.answer}</ReactMarkdown>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/30 flex-wrap text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Link href={`/assistant?q=${encodeURIComponent(faq.question)}`}>
                          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs text-primary border-primary/30 hover:bg-primary/10">
                            <Sparkles className="w-3.5 h-3.5" />
                            Ask Follow-up in AI Chat
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyAnswer(faq.answer, faq.id)}
                          className="h-8 text-xs gap-1"
                        >
                          {copiedId === faq.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openSave(faq)}
                          className="h-8 text-xs gap-1"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRate(faq.id, "HELPFUL")}
                          className="h-8 px-2 gap-1 text-xs hover:text-emerald-400"
                          title="Mark Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{faq.helpfulCount}</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRate(faq.id, "UNHELPFUL")}
                          className="h-8 px-2 gap-1 text-xs hover:text-destructive"
                          title="Not Helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openReport(faq)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Report Issue"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Save Modal */}
      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save FAQ to Personal Notebook</DialogTitle>
            <DialogDescription>
              Keep this verified answer in your saved collections for offline or quick review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Collection / Folder</label>
              <Input
                value={saveCollection}
                onChange={(e) => setSaveCollection(e.target.value)}
                placeholder="e.g. Admissions 2026, Fees, Hostel Check-in"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Personal Notes (Optional)</label>
              <Textarea
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="Add any personal reminders or dates..."
                className="mt-1 text-xs"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSave} className="gap-1.5">
              <Bookmark className="w-4 h-4" />
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Modal */}
      <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-destructive" />
              Report Information Issue
            </DialogTitle>
            <DialogDescription>
              Help our administration content team correct inaccurate or outdated information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Issue Type</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {[
                  { id: "OUTDATED", label: "Outdated Facts/Dates" },
                  { id: "INCORRECT", label: "Incorrect Policy/Fee" },
                  { id: "INCOMPLETE", label: "Incomplete Answer" },
                  { id: "CONFUSING", label: "Confusing Wording" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReportReason(item.id as any)}
                    className={cn(
                      "p-2 text-xs rounded-lg border text-left transition-all",
                      reportReason === item.id
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border/60 hover:bg-muted/40"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Details</label>
              <Textarea
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder="Explain what needs updating or provide the verified reference..."
                className="mt-1 text-xs"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitReport}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading Knowledge Hub...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
