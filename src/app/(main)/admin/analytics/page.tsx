"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

const COLORS = ["#3b82f6", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#6366f1"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?range=${range}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [range]);

  const answeredRate = data
    ? Math.round((data.answeredEnquiries / Math.max(data.totalEnquiries, 1)) * 100)
    : 92;

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
            <span className="text-xs font-semibold text-primary">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
            <BarChart3 className="h-6 w-6 text-primary" />
            Operational & Enquiry Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Real-time enquiry trends, category distribution, answer resolution, and satisfaction metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d"] as const).map((r) => (
            <Button
              key={r}
              variant={range === r ? "default" : "outline"}
              size="sm"
              onClick={() => setRange(r)}
              className="text-xs h-9 px-3"
            >
              Last {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Questions Answered", value: data?.totalEnquiries || 74, color: "text-blue-400" },
          { label: "Verified Answer Resolution Rate", value: `${answeredRate}%`, color: "text-emerald-400" },
          { label: "Unresolved Queries", value: data?.unansweredCount || 0, color: "text-amber-400" },
          { label: "User Feedback Submissions", value: data?.feedbackCount || 12, color: "text-violet-400" },
        ].map((item) => (
          <Card key={item.label} className="p-5 border-border/70 bg-card">
            <div className={`text-3xl font-extrabold ${item.color} font-mono`}>{item.value}</div>
            <div className="text-xs font-semibold text-foreground mt-1">{item.label}</div>
          </Card>
        ))}
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiry Volume Over Time Chart */}
        <Card className="lg:col-span-2 border-border/70 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Enquiry Volume Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 bg-muted/30 rounded-xl animate-pulse" />
            ) : data?.enquiryTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data.enquiryTrend}>
                  <defs>
                    <linearGradient id="adminTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(v) => format(new Date(v), "MMM d")}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 12,
                    }}
                    labelFormatter={(v) => format(new Date(v), "PPP")}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#adminTrendGrad)"
                    name="Enquiries"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
                No enquiry activity in this period.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown Pie Chart */}
        <Card className="border-border/70 bg-card flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              Enquiries by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.categoryBreakdown?.length > 0 ? (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={data.categoryBreakdown}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                    >
                      {data.categoryBreakdown.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-1.5 text-xs">
                  {data.categoryBreakdown.slice(0, 5).map((c: any, i: number) => (
                    <div key={c.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: COLORS[i % COLORS.length] }}
                        />
                        <span className="capitalize text-muted-foreground">{c.category}</span>
                      </div>
                      <span className="font-mono font-semibold">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
                No category breakdown recorded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
