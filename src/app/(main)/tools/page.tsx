"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Sparkles,
  BookOpen,
  HelpCircle,
  CheckSquare,
  Square,
  Award,
  RefreshCw,
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FAQ_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// Checklists Data
const PRESET_CHECKLISTS = [
  {
    id: "app-prep",
    title: "B.Tech Application Preparation Checklist",
    category: "Admissions",
    items: [
      { id: "c1", text: "Download JEE Main / CET Rank Scorecard & Admit Card" },
      { id: "c2", text: "Obtain 10th Standard Marksheet & Passing Certificate" },
      { id: "c3", text: "Obtain 12th Standard Marksheet with minimum 60% in PCM" },
      { id: "c4", text: "Obtain Transfer Certificate (TC) & Conduct Certificate from school" },
      { id: "c5", text: "Verify Caste / Category Certificate (if claiming OBC/SC/ST reservation)" },
      { id: "c6", text: "Prepare 8 recent passport-sized color photographs on white background" },
      { id: "c7", text: "Complete online ERP registration form and print acknowledgement slip" },
    ],
  },
  {
    id: "doc-reporting",
    title: "Campus Physical Reporting & Verification Checklist",
    category: "Enrollment",
    items: [
      { id: "d1", text: "Carry all original academic marksheets in a waterproof folder" },
      { id: "d2", text: "Prepare 3 sets of self-attested photocopies of all documents" },
      { id: "d3", text: "Obtain signed Medical Fitness Certificate with blood group from MBBS doctor" },
      { id: "d4", text: "Submit Anti-Ragging undertaking on national UGC anti-ragging portal" },
      { id: "d5", text: "Carry Demand Draft or Net Banking credentials for first semester tuition fee" },
      { id: "d6", text: "Collect temporary student ID badge and official enrollment receipt" },
    ],
  },
  {
    id: "scholarship-apply",
    title: "Scholarship & Fee Waiver Application Checklist",
    category: "Financial Aid",
    items: [
      { id: "s1", text: "Check eligibility cutoff (e.g., JEE AIR < 1,000 for 100% waiver)" },
      { id: "s2", text: "Obtain current financial year Income Certificate from Tahsildar (if EWS/need-based)" },
      { id: "s3", text: "Open student bank account with SBI / Canara Bank linked to Aadhaar" },
      { id: "s4", text: "Submit Merit Scholarship Claim form at Central Accounts Desk before July 30" },
      { id: "s5", text: "Register on National Scholarship Portal (NSP) for Central Sector Scheme" },
    ],
  },
  {
    id: "hostel-pack",
    title: "Hostel Check-in & Room Move-in Checklist",
    category: "Campus Life",
    items: [
      { id: "h1", text: "Submit hostel allotment receipt and caution deposit payment proof" },
      { id: "h2", text: "Pack bedsheets (single bed size), pillow, blanket, and laundry hamper" },
      { id: "h3", text: "Bring personal padlock with duplicate keys for room wardrobe" },
      { id: "h4", text: "Pack personal laptop, spike guard / surge protector, and ethernet cable" },
      { id: "h5", text: "Complete room inventory checklist with hostel block warden" },
      { id: "h6", text: "Register biometric fingerprint at hostel security turnstile" },
    ],
  },
];

export default function ToolsPage() {
  const { toast } = useToast();

  // Tab State
  const [activeTab, setActiveTab] = useState("summarizer");

  // Summarizer State
  const [summaryTopic, setSummaryTopic] = useState("B.Tech Admission Process & Cutoffs");
  const [summaryStyle, setSummaryStyle] = useState("Quick Overview");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Quiz State
  const [quizCategory, setQuizCategory] = useState("admissions");
  const [quizCount, setQuizCount] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Checklists State (persisted in localStorage)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("campusiq_checklist_progress");
      if (saved) setCheckedItems(JSON.parse(saved));
    } catch {}
  }, []);

  const toggleChecklistItem = (id: string) => {
    const next = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(next);
    try {
      localStorage.setItem("campusiq_checklist_progress", JSON.stringify(next));
    } catch {}
  };

  // Summarizer Generation
  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setGeneratedSummary(null);

    try {
      // Query knowledge base
      const queryPrompt = `Generate a ${summaryStyle} summary about: ${summaryTopic}. Preserve essential eligibility rules, deadlines, conditions, and procedures.`;
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedSummary(data.response);
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Failed to generate summary", variant: "destructive" });
    } finally {
      setSummaryLoading(false);
    }
  };

  const copySummaryText = () => {
    if (!generatedSummary) return;
    navigator.clipboard.writeText(generatedSummary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
    toast({ title: "Summary copied to clipboard" });
  };

  // Quiz Start
  const startQuiz = async () => {
    setQuizLoading(true);
    setQuizQuestions([]);
    setUserAnswers({});
    setQuizSubmitted(false);
    setCurrentQuestionIndex(0);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: quizCategory, count: quizCount }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data.questions || []);
      } else {
        throw new Error();
      }
    } catch {
      toast({ title: "Could not generate quiz", description: "Not enough questions for this category.", variant: "destructive" });
    } finally {
      setQuizLoading(false);
    }
  };

  const selectAnswer = (questionId: string, answer: string) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    let score = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: quizCategory,
          questions: quizQuestions,
          answers: userAnswers,
        }),
      });
      toast({ title: `Quiz Completed! Score: ${score}/${quizQuestions.length}` });
    } catch {}
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-primary" />
            Study & Enquiry Learning Tools
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Grounded AI summarizer, interactive FAQ knowledge quizzes, and guided college checklists.
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted/60 p-1 h-11 border border-border/60">
          <TabsTrigger value="summarizer" className="gap-2 text-xs font-semibold px-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI Policy Summarizer
          </TabsTrigger>
          <TabsTrigger value="quiz" className="gap-2 text-xs font-semibold px-4">
            <Award className="w-3.5 h-3.5" />
            Interactive FAQ Quiz
          </TabsTrigger>
          <TabsTrigger value="checklists" className="gap-2 text-xs font-semibold px-4">
            <CheckSquare className="w-3.5 h-3.5" />
            Guided Checklists
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: AI Policy Summarizer */}
        <TabsContent value="summarizer" className="space-y-4">
          <Card className="p-6 border-border/70 bg-card space-y-5">
            <div>
              <h2 className="text-lg font-bold">College Policy & Regulations Summarizer</h2>
              <p className="text-xs text-muted-foreground">
                Synthesize complex college documentation, fee regulations, eligibility criteria, and hostel rules into concise formats.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                  Choose Enquiry Subject
                </label>
                <div className="space-y-1.5">
                  {[
                    "B.Tech Admission Process & Cutoffs",
                    "Tuition Fees, Payment Schedules & Refund Rules",
                    "Merit & Need-Based Scholarship Schemes",
                    "Hostel Room Allotments, Curfew & Dining",
                    "Placement Training, Eligibility & Highest Packages",
                  ].map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSummaryTopic(topic)}
                      className={cn(
                        "w-full text-left p-2.5 rounded-lg border text-xs transition-all",
                        summaryTopic === topic
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                    Summary Presentation Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "Quick Overview", desc: "Bullet points & core numbers" },
                      { id: "Detailed Explanation", desc: "Full breakdown of conditions" },
                      { id: "Step-by-Step Guide", desc: "Chronological walkthrough" },
                      { id: "Revision Checklist", desc: "Checkable reminders" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSummaryStyle(style.id)}
                        className={cn(
                          "p-3 rounded-lg border text-left transition-all",
                          summaryStyle === style.id
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border/60 hover:bg-muted/40"
                        )}
                      >
                        <span className="text-xs font-semibold block">{style.id}</span>
                        <span className="text-[10px] text-muted-foreground">{style.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className="w-full gap-2 h-11 shadow-md shadow-primary/20"
                >
                  {summaryLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Knowledge Base & Formulating Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate {summaryStyle}
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Generated Summary Output */}
            {generatedSummary && (
              <div className="mt-6 pt-6 border-t border-border/50 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs gap-1 border-primary/30 text-primary">
                    <Sparkles className="w-3 h-3" /> Grounded in Verified Institutional Data
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copySummaryText}
                    className="h-8 gap-1.5 text-xs"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? "Copied" : "Copy Summary"}</span>
                  </Button>
                </div>

                <div className="p-5 rounded-2xl bg-muted/30 border border-border/60 prose prose-sm dark:prose-invert max-w-none text-foreground/90">
                  <ReactMarkdown>{generatedSummary}</ReactMarkdown>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 2: Interactive FAQ Quiz */}
        <TabsContent value="quiz" className="space-y-4">
          <Card className="p-6 border-border/70 bg-card space-y-6">
            <div>
              <h2 className="text-lg font-bold">Knowledge-Check Quizzes</h2>
              <p className="text-xs text-muted-foreground">
                Test your understanding of college cutoffs, fee deadlines, scholarships, and campus policies.
              </p>
            </div>

            {quizQuestions.length === 0 ? (
              /* Quiz Configuration Screen */
              <div className="max-w-xl space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                    Select Knowledge Category
                  </label>
                  <select
                    value={quizCategory}
                    onChange={(e) => setQuizCategory(e.target.value)}
                    className="w-full h-11 rounded-lg border border-border/80 bg-background px-3 text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1.5">
                    Number of Questions
                  </label>
                  <div className="flex gap-2">
                    {[5, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuizCount(num)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-xs font-medium transition-all",
                          quizCount === num
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border/60 hover:bg-muted/40"
                        )}
                      >
                        {num} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startQuiz}
                  disabled={quizLoading}
                  className="gap-2 h-10 w-full sm:w-auto shadow-md shadow-primary/20"
                >
                  {quizLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating Quiz from Verified FAQs...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      Start Knowledge Check
                    </>
                  )}
                </Button>
              </div>
            ) : (
              /* Active Quiz Flow */
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs uppercase">
                      {quizCategory}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuizQuestions([])}
                    className="text-xs text-muted-foreground hover:text-foreground h-8"
                  >
                    Exit Quiz
                  </Button>
                </div>

                {/* Current Question */}
                {(() => {
                  const q = quizQuestions[currentQuestionIndex];
                  if (!q) return null;
                  const selectedOpt = userAnswers[q.id];

                  return (
                    <div className="space-y-4 max-w-3xl">
                      <h3 className="text-base font-bold text-foreground/95 leading-relaxed">
                        {currentQuestionIndex + 1}. {q.question}
                      </h3>

                      <div className="space-y-2">
                        {q.options.map((opt: string, i: number) => {
                          const isChosen = selectedOpt === opt;
                          const isCorrect = q.correctAnswer === opt;

                          return (
                            <button
                              key={i}
                              disabled={quizSubmitted}
                              onClick={() => selectAnswer(q.id, opt)}
                              className={cn(
                                "w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-start gap-3",
                                isChosen && !quizSubmitted && "border-primary bg-primary/10 text-primary font-medium",
                                !isChosen && !quizSubmitted && "border-border/60 hover:bg-muted/40",
                                quizSubmitted && isCorrect && "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-medium",
                                quizSubmitted && isChosen && !isCorrect && "border-destructive bg-destructive/10 text-destructive"
                              )}
                            >
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] shrink-0 font-bold">
                                {String.fromCharCode(65 + i)}
                              </span>
                              <span className="flex-1 leading-relaxed">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation if submitted */}
                      {quizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-200/90 space-y-1">
                          <strong className="text-blue-400 block font-semibold">Verified Explanation:</strong>
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Quiz Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="h-9"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < quizQuestions.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                        className="h-9 gap-1"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    ) : !quizSubmitted ? (
                      <Button
                        size="sm"
                        onClick={submitQuiz}
                        className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Submit & Check Score
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => startQuiz()}
                        className="h-9 gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Try Another Quiz
                      </Button>
                    )}
                  </div>
                </div>

                {/* Score Summary Banner */}
                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      Your Score: {quizScore} / {quizQuestions.length}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {quizScore === quizQuestions.length
                        ? "🎉 Outstanding! You have excellent mastery over institutional regulations."
                        : "Good effort! Review the explanations above to solidify your college knowledge."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Tab 3: Guided Checklists */}
        <TabsContent value="checklists" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_CHECKLISTS.map((list) => {
              const completedCount = list.items.filter((item) => checkedItems[item.id]).length;
              const totalCount = list.items.length;
              const progressPct = Math.round((completedCount / totalCount) * 100);

              return (
                <Card key={list.id} className="p-5 border-border/70 bg-card flex flex-col justify-between space-y-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-normal">
                        {list.category}
                      </Badge>
                      <span className="text-xs font-mono font-semibold text-primary">
                        {completedCount} / {totalCount} Done ({progressPct}%)
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-foreground/95">{list.title}</h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300 rounded-full"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-2 pt-1">
                      {list.items.map((item) => {
                        const isDone = !!checkedItems[item.id];
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleChecklistItem(item.id)}
                            className={cn(
                              "w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2.5 select-none",
                              isDone
                                ? "bg-muted/30 border-border/40 text-muted-foreground line-through"
                                : "bg-card border-border/60 hover:border-primary/40 text-foreground"
                            )}
                          >
                            <span className="mt-0.5 text-primary shrink-0">
                              {isDone ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                            </span>
                            <span className="leading-relaxed">{item.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
