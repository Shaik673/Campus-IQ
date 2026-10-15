"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare, Search, BookOpen, TrendingUp, Clock, Bookmark,
  BarChart3, ArrowRight, Sparkles, GraduationCap, CreditCard,
  Award, Briefcase, RefreshCw, Activity, ChevronRight, Zap,
  HelpCircle, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn, formatRelativeTime, getCategoryBadgeClass } from "@/lib/utils";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { format } from "date-fns";

interface DashboardData {
  totalEnquiries: number;
  answeredEnquiries: number;
  unansweredCount: number;
  conversationsCount: number;
  savedAnswers: number;
  feedbackCount: number;
  enquiryTrend: { date: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  recentActivity: { id: string; type: string; description: string; createdAt: string }[];
}

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const QUICK_ACTIONS = [
  { label: "Ask a Question", href: "/assistant", icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Explore FAQs", href: "/explore", icon: Search, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Admissions Info", href: "/admissions", icon: GraduationCap, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Fee Structure", href: "/fees", icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
  { label: "Scholarships", href: "/scholarships", icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { label: "Placements", href: "/placements", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

const STARTER_QUESTIONS = [
  "What is the admission process for B.Tech?",
  "What are the fee structures for CSE branch?",
  "Are there any scholarships available?",
  "What hostel facilities are provided?",
  "What is the placement record?",
  "How do I apply for government scholarships?",
];

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  ENQUIRY: MessageSquare,
  CATEGORY_VIEWED: BookOpen,
  FAQ_SAVED: Bookmark,
  QUIZ_COMPLETED: BarChart3,
  FEEDBACK_SUBMITTED: Activity,
  CONVERSATION_OPENED: Clock,
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [range, setRange] = useState("7d");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/analytics?range=${range}`);
      if (res.ok) setData(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [range]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const answeredPct = data
    ? Math.round((data.answeredEnquiries / Math.max(data.totalEnquiries, 1)) * 100)
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — Welcome to CampusIQ
          </p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRange(r)}
            >
              {r}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-5 w-5" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask anything about admissions, fees, courses, scholarships..."
            className="h-14 pl-12 pr-32 text-base rounded-xl border-border/60 bg-card focus:ring-2 focus:ring-primary/30"
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 gap-2">
            <Sparkles className="h-4 w-4" />
            Ask AI
          </Button>
        </form>
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-2">
          {STARTER_QUESTIONS.slice(0, 3).map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => router.push(`/assistant?q=${encodeURIComponent(q)}`)}
              className="text-xs text-muted-foreground hover:text-primary bg-card hover:bg-primary/5 border border-border/40 rounded-full px-3 py-1 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Enquiries", value: data?.totalEnquiries ?? 0, icon: MessageSquare, color: "text-blue-400", bg: "bg-blue-500/10", href: "/history" },
          { label: "Answered", value: `${answeredPct}%`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10", href: "/history" },
          { label: "Saved Answers", value: data?.savedAnswers ?? 0, icon: Bookmark, color: "text-violet-400", bg: "bg-violet-500/10", href: "/saved" },
          { label: "Unanswered", value: data?.unansweredCount ?? 0, icon: HelpCircle, color: "text-orange-400", bg: "bg-orange-500/10", href: "/explore" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="stat-card cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">{stat.value}</div>
              )}
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enquiry Trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Enquiry Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
              ) : data?.enquiryTrend && data.enquiryTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={data.enquiryTrend}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(v) => format(new Date(v), "MMM d")}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={25} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }}
                      labelFormatter={(v) => format(new Date(v), "MMM d, yyyy")}
                    />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#colorCount)" strokeWidth={2} name="Activities" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No activity data yet</p>
                  <p className="text-xs mt-1">Start asking questions to see trends</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-48 bg-muted/30 rounded-lg animate-pulse" />
            ) : data?.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
              <div className="space-y-2">
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={data.categoryBreakdown} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="count" nameKey="category">
                      {data.categoryBreakdown.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1">
                  {data.categoryBreakdown.slice(0, 4).map((item, i) => (
                    <div key={item.category} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="capitalize flex-1 truncate">{item.category}</span>
                      <span className="text-muted-foreground font-mono">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No category data yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 cursor-pointer group">
                <div className={cn("p-2.5 rounded-xl", action.bg, "group-hover:scale-110 transition-transform")}>
                  <action.icon className={cn("h-4 w-4", action.color)} />
                </div>
                <span className="text-xs font-medium text-center leading-tight">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Link href="/history">
                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <div className="w-7 h-7 rounded-lg bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-muted rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))
            ) : data?.recentActivity?.length ? (
              data.recentActivity.slice(0, 5).map((act) => {
                const Icon = ACTIVITY_ICONS[act.type] || Activity;
                return (
                  <div key={act.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{act.description}</p>
                      <p className="text-[10px] text-muted-foreground">{formatRelativeTime(act.createdAt)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs mt-1">Start by asking a question</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Starters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Suggested Questions</CardTitle>
              <Link href="/explore">
                <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                  Explore <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => router.push(`/assistant?q=${encodeURIComponent(q)}`)}
                className="w-full text-left flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/50 border border-transparent hover:border-border/50 transition-all group"
              >
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <span className="text-xs flex-1 truncate">{q}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Demo data notice */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
        <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="text-yellow-400 font-medium">Demo Mode</span> — All college data (fees, dates, contacts) is illustrative. 
          Replace with verified institutional information before going live.
        </p>
      </div>
    </div>
  );
}
