"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Star,
  Send,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn, formatRelativeTime } from "@/lib/utils";

const DEPARTMENTS = [
  {
    name: "Central Admissions Cell",
    head: "Dr. A. K. Sharma (Dean Admissions)",
    email: "admissions@campusiq.edu",
    phone: "+91 (080) 4123-4500",
    location: "Administrative Block A, Room 102",
    timings: "Mon-Sat: 9:00 AM - 5:00 PM",
  },
  {
    name: "Student Accounts & Fee Section",
    head: "Mr. R. V. Nathan (Chief Finance Officer)",
    email: "accounts@campusiq.edu",
    phone: "+91 (080) 4123-4567",
    location: "Administrative Block A, Ground Floor",
    timings: "Mon-Fri: 9:30 AM - 4:30 PM",
  },
  {
    name: "Controller of Examinations (COE)",
    head: "Prof. Sunita Deshmukh",
    email: "examinations@campusiq.edu",
    phone: "+91 (080) 4123-4522",
    location: "Examination Wing, Block B",
    timings: "Mon-Fri: 10:00 AM - 4:00 PM",
  },
  {
    name: "Chief Hostel Warden Office",
    head: "Col. (Retd.) M. P. Singh",
    email: "hostels@campusiq.edu",
    phone: "+91 (080) 4123-4588",
    location: "Central Student Activity Center",
    timings: "24/7 Helpline Available",
  },
  {
    name: "Training & Placement Cell (T&P)",
    head: "Mr. Vikram Mehta (Head Placements)",
    email: "placements@campusiq.edu",
    phone: "+91 (080) 4123-4545",
    location: "Corporate Hub, Block C",
    timings: "Mon-Sat: 9:00 AM - 6:00 PM",
  },
  {
    name: "Student Grievance & Anti-Ragging Cell",
    head: "Justice (Retd.) K. R. Rao (Ombudsman)",
    email: "ombudsman@campusiq.edu",
    phone: "1800-180-5522 (Toll-Free)",
    location: "Legal & Ombudsman Office, Block B",
    timings: "Mon-Fri: 11:00 AM - 3:00 PM",
  },
];

export default function FeedbackPage() {
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [feedbackType, setFeedbackType] = useState<"HELPFUL" | "UNHELPFUL" | "REPORT">("HELPFUL");
  const [reportReason, setReportReason] = useState("GENERAL_INQUIRY");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pastFeedback, setPastFeedback] = useState<any[]>([]);

  const fetchPastFeedback = async () => {
    try {
      const res = await fetch("/api/feedback");
      if (res.ok) setPastFeedback(await res.json());
    } catch {}
  };

  useEffect(() => {
    fetchPastFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast({ title: "Please enter your comments", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: feedbackType,
          rating,
          comment: comment.trim(),
          reportReason: feedbackType === "REPORT" ? reportReason : null,
        }),
      });

      if (res.ok) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you! Your feedback helps us keep college answers accurate and verified.",
        });
        setComment("");
        fetchPastFeedback();
      }
    } catch {
      toast({ title: "Submission failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            Feedback & Campus Support
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Share feedback on answer accuracy, suggest improvements, or contact university departments directly.
          </p>
        </div>

        <Link href="/assistant">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant a Question
          </Button>
        </Link>
      </div>

      {/* Main Feedback Form & Past Submissions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Feedback Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-border/70 bg-card space-y-5">
            <div>
              <h2 className="text-lg font-bold">Platform Experience & Accuracy Feedback</h2>
              <p className="text-xs text-muted-foreground">
                Your ratings and issue reports are reviewed by the administration knowledge governance team.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Rating */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground block">
                  Overall System Experience Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-muted-foreground/60 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={cn(
                          "w-7 h-7",
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2 font-medium">
                    {rating === 5 ? "Excellent" : rating === 4 ? "Very Good" : rating === 3 ? "Average" : "Needs Improvement"}
                  </span>
                </div>
              </div>

              {/* Feedback Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground block">
                  Feedback Focus
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "HELPFUL", label: "Positive Experience" },
                    { id: "UNHELPFUL", label: "Answer Issue" },
                    { id: "REPORT", label: "Outdated College Fact" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFeedbackType(t.id as any)}
                      className={cn(
                        "p-2.5 rounded-lg border text-xs font-medium transition-all text-center",
                        feedbackType === t.id
                          ? "border-primary bg-primary/10 text-primary font-bold"
                          : "border-border/60 hover:bg-muted/40 text-muted-foreground"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase text-muted-foreground block">
                  Comments & Specific Suggestions
                </label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about what information was helpful, or what college regulations need updating..."
                  rows={4}
                  className="text-xs bg-background"
                />
              </div>

              <Button type="submit" disabled={submitting} className="gap-2 h-10 shadow-md shadow-primary/20">
                <Send className="w-4 h-4" />
                <span>{submitting ? "Submitting..." : "Submit Feedback"}</span>
              </Button>
            </form>
          </Card>

          {/* Past Submitted Feedback */}
          {pastFeedback.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm">Your Recent Feedback Submissions</h3>
              <div className="space-y-2">
                {pastFeedback.slice(0, 5).map((f) => (
                  <Card key={f.id} className="p-3.5 border-border/70 bg-card/60 text-xs flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-normal uppercase">
                          {f.type}
                        </Badge>
                        {f.rating && (
                          <span className="text-amber-400 font-bold font-mono">
                            ★ {f.rating}/5
                          </span>
                        )}
                        <span className="text-muted-foreground/60 text-[11px]">
                          {formatRelativeTime(f.createdAt)}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{f.comment}</p>
                    </div>

                    <Badge className={cn("text-[9px] py-0 px-1.5 font-normal", f.isReviewed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground")}>
                      {f.isReviewed ? "Reviewed by Admin" : "Pending Review"}
                    </Badge>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Department Contacts Directory */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              University Departments
            </h2>
            <p className="text-xs text-muted-foreground">
              Official office contacts and walk-in visiting hours.
            </p>
          </div>

          <div className="space-y-3">
            {DEPARTMENTS.map((dept) => (
              <Card key={dept.name} className="p-4 border-border/70 bg-card space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-foreground text-sm leading-snug">{dept.name}</h4>
                  <span className="text-[11px] text-primary block mt-0.5">{dept.head}</span>
                </div>

                <div className="space-y-1 text-muted-foreground pt-1 border-t border-border/40 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                    <span className="truncate">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                    <span>{dept.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted-foreground/70 shrink-0" />
                    <span>{dept.timings}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
