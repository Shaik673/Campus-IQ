"use client";

import Link from "next/link";
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SCHOLARSHIPS = [
  {
    title: "Chancellor's Merit Scholarship (100% Tuition Waiver)",
    eligibility: "JEE Main All India Rank (AIR) within top 1,000 OR State CET Rank within top 200.",
    benefit: "100% Tuition Fee Waiver for all 4 years + free hostel accommodation.",
    renewal: "Maintain minimum 8.5 CGPA with no backlogs and 80% attendance annually.",
    tag: "Top Merit",
  },
  {
    title: "Dean's Excellence Scholarship (50% Tuition Waiver)",
    eligibility: "JEE Main AIR between 1,001 and 5,000 OR 12th Board PCM marks >= 95%.",
    benefit: "50% Tuition Fee Waiver per annum.",
    renewal: "Maintain minimum 8.0 CGPA with no active backlogs.",
    tag: "High Merit",
  },
  {
    title: "Women in STEM Leadership Award",
    eligibility: "Top 20 female engineering applicants based on merit in entrance examination.",
    benefit: "₹50,000 annual scholarship grant + laptop allowance + industry mentor.",
    renewal: "Maintain minimum 7.5 CGPA and active participation in tech clubs.",
    tag: "Diversity",
  },
  {
    title: "Sports & Athletics Excellence Fellowship",
    eligibility: "Represented state or nation in Olympic, Asian Games, or National School Games federations.",
    benefit: "Up to 75% tuition fee waiver + specialized athletic diet and tournament travel sponsorship.",
    renewal: "Active representation of university in inter-university sports meets.",
    tag: "Sports",
  },
  {
    title: "Defense Personnel & Martyrs' Wards Grant",
    eligibility: "Wards of armed forces, paramilitary, or police personnel killed in action or serving.",
    benefit: "30% concession on tuition fee throughout the degree program.",
    renewal: "Continuous enrollment and good conduct record.",
    tag: "Service",
  },
  {
    title: "Need-Based Financial Assistance (EWS)",
    eligibility: "Family annual income below ₹3.0 Lakhs from all sources with valid Tahsildar certificate.",
    benefit: "Subsidized tuition and hostel fee waiver funded by the Alumni Endowment Fund.",
    renewal: "Annual income review and satisfactory academic progress (>= 6.5 CGPA).",
    tag: "Financial Need",
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Award className="h-6 w-6 text-amber-400" />
            Scholarships & Financial Assistance
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Over ₹4.5 Crores awarded annually in institutional merit scholarships and need-based tuition waivers.
          </p>
        </div>

        <Link href="/assistant?q=What%20scholarships%20are%20available%20for%20engineering%20students?">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant About Scholarships
          </Button>
        </Link>
      </div>

      {/* Highlights Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-amber-300">Merit & Need Guarantee</h2>
          <p className="max-w-2xl leading-relaxed">
            No qualified student admitted on merit will be turned away due to financial constraints.
            Scholarships are applied directly as tuition fee deductions during semester billing.
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-black text-amber-400 font-mono">₹4.5 Cr+</span>
          <span className="block text-[10px] text-amber-300/70 uppercase">Annual Endowment Pool</span>
        </div>
      </div>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCHOLARSHIPS.map((sch) => (
          <Card key={sch.title} className="border-border/70 bg-card flex flex-col justify-between p-5 space-y-4 hover:border-amber-500/40 transition-all duration-200 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">
                  {sch.tag}
                </Badge>
                <span className="text-[11px] text-muted-foreground font-mono">Institutional Scheme</span>
              </div>

              <h3 className="font-bold text-sm leading-snug">{sch.title}</h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Eligibility:</span>
                  <p className="text-foreground/90 leading-relaxed">{sch.eligibility}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                  <span className="text-[10px] uppercase font-bold block mb-0.5">Scholarship Award:</span>
                  <p className="leading-relaxed">{sch.benefit}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground/80 block">Renewal Condition:</span>
              <p className="leading-relaxed">{sch.renewal}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Government & External Schemes */}
      <Card className="p-6 bg-card border-border/70 space-y-4">
        <div>
          <h2 className="text-lg font-bold">Government & National Scholarship Portal (NSP) Schemes</h2>
          <p className="text-xs text-muted-foreground">
            Our dedicated Scholarship Cell assists students in applying for and claiming Central and State Government disbursements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <h4 className="font-bold text-foreground">Post-Matric Scholarship (SC/ST/OBC)</h4>
            <p>100% tuition and maintenance allowance reimbursed directly by State Social Welfare Department.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <h4 className="font-bold text-foreground">Pragati & Saksham Scholarships (AICTE)</h4>
            <p>₹50,000 per annum for girl students and specially-abled engineering scholars.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1">
            <h4 className="font-bold text-foreground">Central Sector Scheme (CSSS)</h4>
            <p>₹20,000 annual scholarship for students scoring in the top 20th percentile in 12th board exams.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
