"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  HelpCircle,
  BarChart3,
  Users,
  PlusCircle,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Database,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalFaqs: 106,
    activeFaqs: 106,
    unansweredCount: 0,
    totalEnquiries: 0,
    feedbackCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalFaqs: data.totalFaqs || 106,
          activeFaqs: data.totalFaqs || 106,
          unansweredCount: data.unansweredCount || 0,
          totalEnquiries: data.totalEnquiries || 0,
          feedbackCount: data.feedbackCount || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Administration & Knowledge Governance
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage institutional FAQs, review unanswered questions, and monitor knowledge base performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/faqs">
            <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
              <PlusCircle className="w-4 h-4" />
              Manage FAQs
            </Button>
          </Link>
          <Link href="/admin/unanswered">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <HelpCircle className="w-3.5 h-3.5" />
              Review Queue
            </Button>
          </Link>
        </div>
      </div>

      {/* Operational Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Knowledge Entries", value: stats.totalFaqs, icon: BookOpen, color: "text-blue-400", href: "/admin/faqs" },
          { label: "Active Verified FAQs", value: stats.activeFaqs, icon: CheckCircle2, color: "text-emerald-400", href: "/admin/faqs" },
          { label: "Unanswered Enquiries", value: stats.unansweredCount, icon: HelpCircle, color: "text-amber-400", href: "/admin/unanswered" },
          { label: "User Feedback Submissions", value: stats.feedbackCount, icon: Activity, color: "text-violet-400", href: "/admin/analytics" },
        ].map((item) => (
          <Link key={item.label} href={item.href}>
            <Card className="p-5 border-border/70 bg-card hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div className="text-3xl font-extrabold font-mono text-foreground">{item.value}</div>
              <div className="flex items-center gap-1 text-[11px] text-primary font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Management Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/faqs">
          <Card className="p-6 border-border/70 bg-card hover:border-primary/40 transition-all h-full flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                Knowledge Base Management
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create, edit, activate/deactivate, search, and delete FAQ entries. Perform bulk CSV import and export.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium pt-2 border-t border-border/40">
              <span>Open FAQ Editor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/unanswered">
          <Card className="p-6 border-border/70 bg-card hover:border-primary/40 transition-all h-full flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                Unanswered Enquiry Queue
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Review questions the system could not answer with high confidence and convert them into new verified FAQ entries.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium pt-2 border-t border-border/40">
              <span>View Unresolved Queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>

        <Link href="/admin/analytics">
          <Card className="p-6 border-border/70 bg-card hover:border-primary/40 transition-all h-full flex flex-col justify-between space-y-4 shadow-sm group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                Operational Analytics
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Examine category enquiry volume, popular student queries, satisfaction ratings, and knowledge index freshness.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-primary font-medium pt-2 border-t border-border/40">
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
