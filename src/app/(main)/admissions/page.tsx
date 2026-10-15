"use client";

import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Clock,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ADMISSION_STEPS = [
  {
    step: "01",
    title: "Online Application Registration",
    description: "Create an applicant account on the official admissions portal. Fill in personal, educational, and parent details, and upload your recent passport photograph and signature.",
    time: "June 1 - July 15",
  },
  {
    step: "02",
    title: "Entrance Exam Score Submission",
    description: "Submit valid scorecards for your respective entrance test: JEE Main / State CET for B.Tech; GATE for M.Tech; CAT/MAT for MBA; NIMCET for MCA.",
    time: "By July 18",
  },
  {
    step: "03",
    title: "Document Verification & Merit Ranking",
    description: "Upload scanned copies of 10th/12th marksheets, transfer certificate, and category certificates (if applicable). State and institutional merit ranks are published.",
    time: "July 20 - July 24",
  },
  {
    step: "04",
    title: "Counselling & Seat Allotment",
    description: "Participate in online choice filling for engineering branches. Seat allotment is conducted across Round 1, Round 2, and mop-up vacancy rounds based on merit rank.",
    time: "July 25 - July 30",
  },
  {
    step: "05",
    title: "Fee Payment & Physical Reporting",
    description: "Accept the allotted seat by paying the initial semester tuition fee online. Complete document verification at the campus registrar desk and receive your permanent student ID.",
    time: "August 1 - August 5",
  },
];

const REQUIRED_DOCUMENTS = [
  { name: "10th Standard Board Certificate & Marksheet", mandatory: true, copies: "Original + 3 Self-Attested Photocopies" },
  { name: "12th Standard Board / Diploma Marksheet", mandatory: true, copies: "Original + 3 Self-Attested Photocopies" },
  { name: "JEE Main / State CET / Entrance Exam Scorecard", mandatory: true, copies: "Color Printout (with rank clearly legible)" },
  { name: "Transfer Certificate (TC) & Migration Certificate", mandatory: true, copies: "Original from previous institution" },
  { name: "Government Photo ID (Aadhaar Card / Passport)", mandatory: true, copies: "Photocopy with original for physical verification" },
  { name: "Passport-Sized Color Photographs", mandatory: true, copies: "8 Recent identical photographs on white background" },
  { name: "Caste / Category Certificate (SC/ST/OBC-NCL/EWS)", mandatory: false, copies: "Issued by competent revenue authority (within 1 yr)" },
  { name: "Income Certificate for Fee Concession / Scholarships", mandatory: false, copies: "Current financial year certificate from Tahsildar" },
  { name: "Medical Fitness Certificate with Blood Group", mandatory: true, copies: "Signed by registered medical practitioner (MBBS)" },
  { name: "Anti-Ragging Affidavit (Student & Parent)", mandatory: true, copies: "Online UGC portal reference number & signed undertaking" },
];

export default function AdmissionsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Admissions & Eligibility Guide (2026-27)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Official walkthrough of entrance requirements, counseling rounds, and document verification.
          </p>
        </div>

        <Link href="/assistant?q=What%20is%20the%20admission%20process%20for%20B.Tech%20programs?">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant About Eligibility
          </Button>
        </Link>
      </div>

      {/* Illustrative Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
        <span>
          <strong>Illustrative Admission Schedule:</strong> The dates and procedures below represent the
          approved standard institutional timeline. Please verify against state CET announcements for
          state-quota allotted seats.
        </span>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">5-Step Admission Walkthrough</h2>
          <p className="text-muted-foreground text-xs">
            Follow these sequential stages to complete your enrollment smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {ADMISSION_STEPS.map((step, idx) => (
            <Card key={step.step} className="border-border/70 bg-card p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-primary/40 font-mono">{step.step}</span>
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {step.time}
                  </Badge>
                </div>
                <h3 className="font-bold text-sm leading-snug">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Eligibility Matrix & Cutoffs Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Eligibility & Entrance Cutoffs (Illustrative)</h2>
          <p className="text-muted-foreground text-xs">
            Minimum qualifying scores for undergraduate and postgraduate entrance.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
              <tr>
                <th className="p-3.5">Degree Program</th>
                <th className="p-3.5">Accepted Entrance Exam</th>
                <th className="p-3.5">Academic Qualification</th>
                <th className="p-3.5">Illustrative JEE / CET Percentile Cutoff</th>
                <th className="p-3.5">Management Quota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground/90">
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Computer Science (CSE)</td>
                <td className="p-3.5">JEE Main / State CET</td>
                <td className="p-3.5">10+2 with PCM (min 60% aggregate)</td>
                <td className="p-3.5 font-mono text-cyan-400">92+ Percentile (State Rank &lt; 4,500)</td>
                <td className="p-3.5">Available (Merit-based)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech AI & Data Science</td>
                <td className="p-3.5">JEE Main / State CET</td>
                <td className="p-3.5">10+2 with PCM (min 60% aggregate)</td>
                <td className="p-3.5 font-mono text-cyan-400">89+ Percentile (State Rank &lt; 6,800)</td>
                <td className="p-3.5">Available</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Electronics & Comm (ECE)</td>
                <td className="p-3.5">JEE Main / State CET</td>
                <td className="p-3.5">10+2 with PCM (min 60% aggregate)</td>
                <td className="p-3.5 font-mono text-cyan-400">85+ Percentile (State Rank &lt; 10,200)</td>
                <td className="p-3.5">Available</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Mechanical / Civil</td>
                <td className="p-3.5">JEE Main / State CET</td>
                <td className="p-3.5">10+2 with PCM (min 55% aggregate)</td>
                <td className="p-3.5 font-mono text-cyan-400">75+ Percentile (State Rank &lt; 22,000)</td>
                <td className="p-3.5">Available</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Lateral Entry (2nd Year)</td>
                <td className="p-3.5">JELET / State Lateral CET</td>
                <td className="p-3.5">3-Year Polytechnic Diploma (min 60%)</td>
                <td className="p-3.5 font-mono text-cyan-400">State Lateral Merit Rank &lt; 800</td>
                <td className="p-3.5">Subject to Vacancy</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">MBA (Master of Business Admin)</td>
                <td className="p-3.5">CAT / MAT / CMAT / KMAT</td>
                <td className="p-3.5">Graduation in any stream (min 50%)</td>
                <td className="p-3.5 font-mono text-cyan-400">CAT 75+ / MAT 600+ Composite Score</td>
                <td className="p-3.5">Available</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* Mandatory Documents Checklist */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Required Documents for Physical Reporting</h2>
          <p className="text-muted-foreground text-xs">
            Prepare these documents in original and self-attested photocopies before counselling day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {REQUIRED_DOCUMENTS.map((doc, idx) => (
            <Card key={idx} className="p-3.5 border-border/70 bg-card flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-foreground/95">{doc.name}</span>
                  {doc.mandatory ? (
                    <Badge variant="destructive" className="text-[9px] py-0 px-1 font-normal">Mandatory</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal">If Applicable</Badge>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">{doc.copies}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
