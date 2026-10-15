"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Cpu,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  ChevronRight,
  BookOpen,
  GraduationCap,
  CreditCard,
  Award,
  Home,
  Briefcase,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface SourceFAQ {
  id: string;
  question: string;
  category: string;
}

interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  answerMode?: "VERIFIED_FAQ" | "AI_ASSISTED" | "UNAVAILABLE" | null;
  confidence?: number | null;
  sources?: SourceFAQ[] | null;
  suggestedFollowUps?: string[];
  helpful?: boolean | null;
  createdAt: string;
}

const STARTER_PROMPTS = [
  {
    category: "Admissions",
    icon: GraduationCap,
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    questions: [
      "What is the admission process for B.Tech programs?",
      "What documents are required during physical reporting?",
      "Is lateral entry available for diploma holders?",
    ],
  },
  {
    category: "Fees & Aid",
    icon: CreditCard,
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    questions: [
      "What is the annual fee structure for CSE and IT?",
      "What merit scholarships are available for high JEE ranks?",
      "Can tuition fees be paid in semester installments?",
    ],
  },
  {
    category: "Campus & Hostel",
    icon: Home,
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    questions: [
      "What hostel room types and mess facilities are provided?",
      "What are the campus bus routes and transportation fees?",
      "What 24/7 medical and emergency services exist on campus?",
    ],
  },
  {
    category: "Placements & Career",
    icon: Briefcase,
    color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-400",
    questions: [
      "What is the highest and average placement CTC this year?",
      "Which top tech and core companies visit for campus recruitment?",
      "What interview preparation and DSA bootcamps are provided?",
    ],
  },
];

function cleanAndFormatMarkdown(text: string): string {
  if (!text) return "";
  return text
    // Remove raw HTML <br> variations and replace with double newline
    .replace(/<br\s*\/?>/gi, "\n\n")
    // Convert <b> and <strong> to markdown bold **...**
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    // Convert <i> and <em> to markdown italic *...*
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    // Convert <li> to markdown list items
    .replace(/<li>\s*(.*?)\s*<\/li>/gi, "- $1\n")
    // Strip common wrapper tags
    .replace(/<\/?(p|div|span|ul|ol|header|footer|section)[^>]*>/gi, "\n")
    // Remove any remaining stray HTML tags
    .replace(/<[^>]+>/g, "")
    // Normalize newlines
    .replace(/\r\n/g, "\n")
    // Remove excess blank lines (max 2)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [targetMessageToSave, setTargetMessageToSave] = useState<ChatMessage | null>(null);
  const [saveCollection, setSaveCollection] = useState("Admissions 2026");
  const [saveNotes, setSaveNotes] = useState("");

  const [inspectFaqId, setInspectFaqId] = useState<string | null>(null);
  const [inspectFaqData, setInspectFaqData] = useState<{ question: string; answer: string; category: string } | null>(null);
  const [inspectLoading, setInspectLoading] = useState(false);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackMessageId, setFeedbackMessageId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackType, setFeedbackType] = useState<"HELPFUL" | "UNHELPFUL">("HELPFUL");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversation if conv ID exists
  useEffect(() => {
    const convId = searchParams.get("conv");
    if (convId) {
      setConversationId(convId);
      fetch(`/api/conversations/${convId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.messages) {
            setMessages(
              data.messages.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                answerMode: m.answerMode,
                confidence: m.confidence,
                sources: m.sources ? JSON.parse(m.sources) : null,
                createdAt: m.createdAt,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [searchParams]);

  // Handle URL starter question ?q=
  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery && messages.length === 0 && !loading) {
      sendMessage(initialQuery);
    }
  }, [searchParams]);

  const startNewConversation = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
    router.replace("/assistant");
    toast({
      title: "New Conversation Started",
      description: "Ask any question about CampusIQ college policies.",
    });
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    setInput("");

    // Add user message to UI immediately
    const tempUserMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "USER",
      content: query,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      // Build history for context
      const history = messages.slice(-6).map((m) => ({
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
      }));

      const storedKey = typeof window !== "undefined" ? localStorage.getItem("campusiq_grok_key") : null;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          conversationId: conversationId || undefined,
          history,
          apiKey: storedKey || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to receive response");
      }

      const data = await res.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const newAssistantMsg: ChatMessage = {
        id: data.messageId || "assistant-" + Date.now(),
        role: "ASSISTANT",
        content: data.response,
        answerMode: data.answerMode,
        confidence: data.confidence,
        sources: data.sources,
        suggestedFollowUps: data.suggestedFollowUps,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newAssistantMsg]);
    } catch (err: any) {
      toast({
        title: "Communication Error",
        description: err.message || "Failed to reach assistant. Please try again.",
        variant: "destructive",
      });

      // Add fallback friendly error message
      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        role: "ASSISTANT",
        content:
          "⚠️ I encountered a temporary connection issue while querying the knowledge base. Please check your network connection or try asking your question again.",
        answerMode: "UNAVAILABLE",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard", description: "Answer text is ready to paste." });
  };

  const openSaveModal = (msg: ChatMessage) => {
    setTargetMessageToSave(msg);
    setSaveNotes("");
    setSaveModalOpen(true);
  };

  const confirmSaveAnswer = async () => {
    if (!targetMessageToSave) return;
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: targetMessageToSave.content.slice(0, 70).replace(/^[#\s*]+/, "") + "...",
          content: targetMessageToSave.content,
          collection: saveCollection,
          notes: saveNotes,
          category: targetMessageToSave.sources?.[0]?.category || "general",
        }),
      });

      if (res.ok) {
        toast({
          title: "Saved Successfully",
          description: `Added to "${saveCollection}" folder in Saved Answers.`,
        });
        setSaveModalOpen(false);
      } else {
        const d = await res.json();
        toast({ title: "Unable to Save", description: d.error || "Please sign in to save answers.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error saving answer", variant: "destructive" });
    }
  };

  const openFeedbackModal = (msgId: string, type: "HELPFUL" | "UNHELPFUL") => {
    setFeedbackMessageId(msgId);
    setFeedbackType(type);
    setFeedbackComment("");
    setFeedbackModalOpen(true);
  };

  const submitFeedback = async () => {
    if (!feedbackMessageId) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: feedbackMessageId,
          type: feedbackType,
          comment: feedbackComment,
        }),
      });

      setMessages((prev) =>
        prev.map((m) => (m.id === feedbackMessageId ? { ...m, helpful: feedbackType === "HELPFUL" } : m))
      );

      toast({
        title: "Feedback Recorded",
        description: "Thank you! Your feedback helps continuously improve CampusIQ answers.",
      });
      setFeedbackModalOpen(false);
    } catch {
      toast({ title: "Error recording feedback", variant: "destructive" });
    }
  };

  const inspectSourceFaq = async (faqId: string) => {
    setInspectFaqId(faqId);
    setInspectLoading(true);
    try {
      const res = await fetch(`/api/faqs/${faqId}`);
      if (res.ok) {
        const data = await res.json();
        setInspectFaqData(data);
      }
    } catch {
      toast({ title: "Could not load source details", variant: "destructive" });
    } finally {
      setInspectLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen bg-background overflow-hidden relative">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-border/60 bg-card/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-sm">CampusIQ Conversational Assistant</h1>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30 animate-pulse" />
            </div>
            <p className="text-[11px] text-muted-foreground">
              TF-IDF Verified College Knowledge Base & Hybrid Grok LLM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={startNewConversation}
              className="h-8 gap-1.5 text-xs border-border/80 hover:bg-card"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Conversation
            </Button>
          )}
        </div>
      </header>

      {/* Main Messages Workspace */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          /* Empty State / Welcome Screen */
          <div className="max-w-4xl mx-auto py-8 space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-violet-600/20 border border-blue-500/30 mb-2 shadow-xl shadow-blue-500/10">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                How can <span className="text-gradient">CampusIQ</span> assist you today?
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
                Ask anything about courses, admission cutoffs, fee structures, scholarships, hostel
                accommodations, and campus life. Answers are retrieved from our verified institutional
                knowledge base.
              </p>
            </div>

            {/* Category Cards with Clickable Starters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STARTER_PROMPTS.map((group) => {
                const IconComponent = group.icon;
                return (
                  <Card
                    key={group.category}
                    className="p-5 border-border/50 bg-card/60 backdrop-blur-sm hover:border-border transition-all duration-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={cn("p-2 rounded-lg border", group.color)}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="font-semibold text-sm">{group.category}</h3>
                    </div>
                    <div className="space-y-1.5">
                      {group.questions.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="w-full text-left text-xs p-2.5 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-all border border-border/30 hover:border-primary/30 flex items-center justify-between group"
                        >
                          <span className="truncate pr-2">{q}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Trust and Accuracy Callout */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-200/80">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <span>
                <strong>Fact-grounded responses:</strong> CampusIQ prioritizes official university
                documents and regulatory cutoffs. When information is unavailable, we guide you to the
                responsible campus department rather than guessing.
              </span>
            </div>
          </div>
        ) : (
          /* Messages List */
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 md:gap-4 animate-fade-in",
                  msg.role === "USER" ? "justify-end" : "justify-start"
                )}
              >
                {/* Assistant Avatar */}
                {msg.role === "ASSISTANT" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                {/* Message Body */}
                <div
                  className={cn(
                    "rounded-2xl p-4 md:p-5 max-w-[88%] md:max-w-[82%] text-sm leading-relaxed shadow-sm space-y-3",
                    msg.role === "USER"
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-sm ml-auto"
                      : "bg-card border border-border/70 rounded-tl-sm text-foreground/95"
                  )}
                >
                  {/* Assistant Meta Badge Header */}
                  {msg.role === "ASSISTANT" && (
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-border/40 text-xs">
                      <div className="flex items-center gap-2">
                        {msg.answerMode === "VERIFIED_FAQ" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1 font-normal py-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            Verified FAQ Match
                          </Badge>
                        ) : msg.answerMode === "AI_ASSISTED" ? (
                          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 gap-1 font-normal py-0.5">
                            <Cpu className="w-3 h-3 text-cyan-400" />
                            AI-Assisted Hybrid
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 font-normal py-0.5">
                            <HelpCircle className="w-3 h-3 text-amber-400" />
                            Department Guidance
                          </Badge>
                        )}

                        {typeof msg.confidence === "number" && (
                          <span className="text-[11px] text-muted-foreground">
                            {Math.round(msg.confidence * 100)}% match confidence
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Message Markdown Content */}
                  <div className={cn("prose prose-sm dark:prose-invert max-w-none break-words", msg.role === "USER" && "text-white")}>
                    <ReactMarkdown
                      components={{
                        strong: ({ children }) => (
                          <strong className="font-bold text-sky-400 dark:text-sky-300">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 my-2.5 space-y-1.5 marker:text-cyan-400">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 my-2.5 space-y-1.5 marker:text-cyan-400 marker:font-bold">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-sm leading-relaxed text-foreground/90 pl-1 font-normal">
                            {children}
                          </li>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold text-foreground mt-4 mb-2 pb-1.5 border-b border-border/40 text-cyan-400">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-base font-bold text-foreground mt-3 mb-1.5 text-cyan-300 dark:text-cyan-200">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold text-foreground mt-2.5 mb-1 text-sky-300 font-bold">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm leading-relaxed my-2 text-foreground/90">
                            {children}
                          </p>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-3 rounded-lg border border-border/60">
                            <table className="w-full text-xs text-left border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-muted/80 text-foreground font-semibold border-b border-border/60">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="p-2.5 text-left font-bold border-r border-border/40 last:border-r-0 text-cyan-300">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="p-2.5 border-t border-border/40 border-r border-border/30 last:border-r-0">
                            {children}
                          </td>
                        ),
                        tr: ({ children }) => (
                          <tr className="hover:bg-muted/30 transition-colors even:bg-muted/10">
                            {children}
                          </tr>
                        ),
                      }}
                    >
                      {cleanAndFormatMarkdown(msg.content)}
                    </ReactMarkdown>
                  </div>

                  {/* Supporting Knowledge Sources Badges */}
                  {msg.role === "ASSISTANT" && msg.sources && msg.sources.length > 0 && (
                    <div className="pt-2 border-t border-border/40">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5 font-medium">
                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                        <span>Supporting Knowledge Base Entries:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src) => (
                          <button
                            key={src.id}
                            onClick={() => inspectSourceFaq(src.id)}
                            className="inline-flex items-center gap-1 text-[11px] bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-md px-2.5 py-1 transition-colors text-left"
                          >
                            <span className="max-w-[240px] truncate">{src.question}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Assistant Action Bar (Copy, Save, Feedback) */}
                  {msg.role === "ASSISTANT" && (
                    <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="h-7 px-2 text-xs gap-1 hover:text-foreground"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[11px]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openSaveModal(msg)}
                          className="h-7 px-2 text-xs gap-1 hover:text-primary"
                          title="Save to Notebook"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Save</span>
                        </Button>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openFeedbackModal(msg.id, "HELPFUL")}
                          className={cn("h-7 w-7", msg.helpful === true && "text-emerald-400 bg-emerald-500/10")}
                          title="Helpful Answer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openFeedbackModal(msg.id, "UNHELPFUL")}
                          className={cn("h-7 w-7", msg.helpful === false && "text-destructive bg-destructive/10")}
                          title="Not Helpful / Report Issue"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-up Questions */}
                  {msg.role === "ASSISTANT" && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Suggested Follow-ups
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((followUp) => (
                          <button
                            key={followUp}
                            onClick={() => sendMessage(followUp)}
                            className="text-xs bg-card hover:bg-primary/10 hover:text-primary border border-border/70 rounded-full px-3 py-1 transition-all flex items-center gap-1 text-left"
                          >
                            <span>{followUp}</span>
                            <ChevronRight className="w-3 h-3 shrink-0 opacity-60" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "USER" && (
                  <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing Indicator */}
            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-blue-500/20">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-sm bg-card border border-border/70 flex items-center gap-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Analyzing college knowledge base & ranking verified FAQs...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Composer Area */}
      <div className="border-t border-border/70 bg-card/60 backdrop-blur-md p-4 md:px-6 shrink-0 z-10">
        <div className="max-w-4xl mx-auto space-y-2">
          <div className="relative flex items-end gap-2 bg-background border border-border/80 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 rounded-xl p-2 transition-all">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about admissions, fee schedules, branch eligibility, hostel rules..."
              className="min-h-[44px] max-h-36 resize-none border-0 focus-visible:ring-0 p-2 text-sm bg-transparent placeholder:text-muted-foreground/60"
              rows={1}
            />

            <Button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="h-10 px-4 rounded-lg gap-1.5 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground/70 px-1">
            <span>Press <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to send, <kbd className="font-mono bg-muted px-1.5 py-0.5 rounded text-[10px]">Shift + Enter</kbd> for newline</span>
            <span>CampusIQ AI • Grounded in institutional documentation</span>
          </div>
        </div>
      </div>

      {/* Save Answer Dialog */}
      <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Answer to Notebook</DialogTitle>
            <DialogDescription>
              Organize this response into your personal collection for quick revision.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Collection / Folder</label>
              <Input
                value={saveCollection}
                onChange={(e) => setSaveCollection(e.target.value)}
                placeholder="e.g. Admissions 2026, Scholarships, Hostel Preparation"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Personal Notes (Optional)</label>
              <Textarea
                value={saveNotes}
                onChange={(e) => setSaveNotes(e.target.value)}
                placeholder="e.g. Remember to prepare TC & 12th marksheet before July 15"
                className="mt-1 text-xs"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSaveAnswer} className="gap-1.5">
              <Bookmark className="w-4 h-4" />
              Save to Collection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {feedbackType === "HELPFUL" ? "Answer Feedback" : "Report an Issue"}
            </DialogTitle>
            <DialogDescription>
              {feedbackType === "HELPFUL"
                ? "Let us know what made this answer helpful."
                : "Help us correct outdated, incomplete, or inaccurate information."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder={
                feedbackType === "HELPFUL"
                  ? "Optional: What details were most useful?"
                  : "Optional: What was missing, unclear, or outdated in this response?"
              }
              rows={4}
              className="text-xs"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitFeedback} className="gap-1.5">
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect Source FAQ Modal */}
      <Dialog open={!!inspectFaqId} onOpenChange={(open) => !open && setInspectFaqId(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase">
                {inspectFaqData?.category || "Knowledge Base"}
              </Badge>
              <DialogTitle className="text-base">Verified Knowledge Base Entry</DialogTitle>
            </div>
          </DialogHeader>
          {inspectLoading ? (
            <div className="py-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading verified FAQ entry...
            </div>
          ) : inspectFaqData ? (
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                <p className="font-semibold text-foreground">{inspectFaqData.question}</p>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                <ReactMarkdown>{inspectFaqData.answer}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Entry details unavailable.</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setInspectFaqId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-muted-foreground">
          Loading CampusIQ Assistant...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
