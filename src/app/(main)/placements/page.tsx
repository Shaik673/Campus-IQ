"use client";

import Link from "next/link";
import {
  Briefcase,
  TrendingUp,
  Award,
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TOP_RECRUITERS = [
  { name: "Google", type: "Tier-1 Tech", role: "Software Engineer", package: "₹42 - ₹44 LPA" },
  { name: "Microsoft", type: "Tier-1 Tech", role: "SDE-1", package: "₹40 - ₹43 LPA" },
  { name: "Amazon", type: "Tier-1 Tech", role: "Cloud / SDE", package: "₹38 - ₹42 LPA" },
  { name: "Adobe", type: "Tier-1 Tech", role: "Product Developer", package: "₹36 - ₹40 LPA" },
  { name: "Larsen & Toubro (L&T)", type: "Core Engineering", role: "Graduate Engineer Trainee", package: "₹8.5 - ₹12 LPA" },
  { name: "Tata Motors", type: "Core Engineering", role: "Vehicle Systems GET", package: "₹9.0 - ₹13 LPA" },
  { name: "Goldman Sachs", type: "FinTech / Quant", role: "Analyst", package: "₹28 - ₹32 LPA" },
  { name: "Deloitte", type: "Consulting", role: "Technology Consultant", package: "₹10 - ₹14 LPA" },
];

export default function PlacementsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Placements & Career Support Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Industry recruitment statistics, leading corporate recruiters, and career preparation roadmaps.
          </p>
        </div>

        <Link href="/assistant?q=What%20is%20the%20placement%20record%20and%20average%20package?">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant About Placements
          </Button>
        </Link>
      </div>

      {/* Placement Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Placement Rate", value: "94.6%", sub: "Eligible Graduating Batch", color: "text-emerald-400" },
          { label: "Highest Package", value: "₹44.0 LPA", sub: "International / Tier-1 Role", color: "text-cyan-400" },
          { label: "Average Package", value: "₹8.2 LPA", sub: "Across All Disciplines", color: "text-blue-400" },
          { label: "Recruiting Companies", value: "180+", sub: "Campus Recruiters 2025-26", color: "text-violet-400" },
        ].map((item) => (
          <Card key={item.label} className="p-5 border-border/70 bg-card">
            <div className={`text-3xl font-extrabold ${item.color} font-mono`}>{item.value}</div>
            <div className="font-semibold text-xs text-foreground mt-1">{item.label}</div>
            <div className="text-[10px] text-muted-foreground/80 mt-0.5">{item.sub}</div>
          </Card>
        ))}
      </div>

      {/* Top Recruiting Partners Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Top Recruiting Partners & Offer Bands</h2>
          <p className="text-muted-foreground text-xs">
            Leading multinational technology enterprises, core engineering conglomerates, and investment banks.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
              <tr>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Industry Sector</th>
                <th className="p-3.5">Job Roles Offered</th>
                <th className="p-3.5 font-bold text-foreground">Annual CTC Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground/90">
              {TOP_RECRUITERS.map((rec) => (
                <tr key={rec.name}>
                  <td className="p-3.5 font-bold text-foreground">{rec.name}</td>
                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px] font-normal">{rec.type}</Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{rec.role}</td>
                  <td className="p-3.5 font-bold font-mono text-cyan-400">{rec.package}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Career Development Training Support */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Code className="w-4 h-4" />
            Competitive Coding & DSA
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Continuous preparation from 3rd semester on institutional LeetCode/HackerRank platforms with weekly contests and professor reviews.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Data Structures & System Design</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>FAANG Specific 4-Week Bootcamps</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Users className="w-4 h-4" />
            Soft Skills & Mock Interviews
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Professional corporate trainers conduct group discussions, verbal aptitude clinics, executive resume reviews, and HR behavioral drills.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>1-on-1 Alumni Mock Interviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Group Discussion Simulation Pods</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Award className="w-4 h-4" />
            Corporate Internships
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Over 120 partner companies recruit pre-final year students for 2 to 6 month summer and winter paid internships with average stipends of ₹25,000/month.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Pre-Placement Offers (PPO)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Academic Credits for Internships</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
