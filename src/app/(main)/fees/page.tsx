"use client";

import Link from "next/link";
import {
  CreditCard,
  Building,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  Landmark,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FeesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Fee Structure & Payment Guide (2026-27)
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete transparent breakdown of tuition fees, installment options, and refund policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/scholarships">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              View Scholarships
            </Button>
          </Link>
          <Link href="/assistant?q=What%20are%20the%20fee%20structures%20for%20CSE%20branch?">
            <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
              <Sparkles className="w-4 h-4" />
              Ask Assistant About Fees
            </Button>
          </Link>
        </div>
      </div>

      {/* Illustrative Notice Banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-blue-200">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
        <span>
          <strong>Fee Transparency Commitment:</strong> The fee amounts presented below reflect approved
          standard academic rates. Caution deposits are 100% refundable at the end of the degree program.
        </span>
      </div>

      {/* Annual Program Fee Breakdown Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Annual Academic Tuition Fee Breakdown</h2>
          <p className="text-muted-foreground text-xs">
            Per-annum fees payable in two equal semester installments.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
              <tr>
                <th className="p-3.5">Degree Program</th>
                <th className="p-3.5">Tuition Fee</th>
                <th className="p-3.5">Lab & Development</th>
                <th className="p-3.5">Exam & Library</th>
                <th className="p-3.5">Refundable Deposit</th>
                <th className="p-3.5 font-bold text-foreground">Total Annual Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground/90">
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Computer Science (CSE)</td>
                <td className="p-3.5">₹1,20,000</td>
                <td className="p-3.5">₹25,000</td>
                <td className="p-3.5">₹15,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹1,60,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech AI & Data Science</td>
                <td className="p-3.5">₹1,20,000</td>
                <td className="p-3.5">₹25,000</td>
                <td className="p-3.5">₹15,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹1,60,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Electronics & Comm (ECE)</td>
                <td className="p-3.5">₹1,05,000</td>
                <td className="p-3.5">₹25,000</td>
                <td className="p-3.5">₹15,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹1,45,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">B.Tech Mechanical / Civil</td>
                <td className="p-3.5">₹90,000</td>
                <td className="p-3.5">₹20,000</td>
                <td className="p-3.5">₹15,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹1,25,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">M.Tech (All Specializations)</td>
                <td className="p-3.5">₹80,000</td>
                <td className="p-3.5">₹15,000</td>
                <td className="p-3.5">₹10,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹1,05,000</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold">MBA (Business Administration)</td>
                <td className="p-3.5">₹1,50,000</td>
                <td className="p-3.5">₹30,000</td>
                <td className="p-3.5">₹20,000</td>
                <td className="p-3.5 text-emerald-400">₹10,000 (1st yr only)</td>
                <td className="p-3.5 font-bold font-mono text-primary text-sm">₹2,00,000</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>

      {/* Hostel & Mess Accommodation Fees */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold">Hostel Residence & Dining Fees</h2>
          <p className="text-muted-foreground text-xs">
            Optional on-campus boarding charges including 4 meals daily, high-speed Wi-Fi, and 24/7 security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              type: "Triple Sharing (Non-AC)",
              rent: "₹45,000 / year",
              mess: "₹42,000 / year",
              total: "₹87,000 / year",
              amenities: ["Attached washroom", "High-speed Wi-Fi", "Daily housekeeping", "Laundry (40 washes/sem)"],
            },
            {
              type: "Double Sharing (Non-AC)",
              rent: "₹60,000 / year",
              mess: "₹42,000 / year",
              total: "₹1,02,000 / year",
              amenities: ["Spacious balcony", "Study cubicles", "High-speed Wi-Fi", "Laundry included"],
              popular: true,
            },
            {
              type: "Double Sharing (Air-Conditioned)",
              rent: "₹85,000 / year",
              mess: "₹42,000 / year",
              total: "₹1,27,000 / year",
              amenities: ["Split AC unit", "Premium attached bath", "Elevator access", "Priority mess counter"],
            },
          ].map((item) => (
            <Card key={item.type} className={`p-5 border-border/70 bg-card flex flex-col justify-between ${item.popular ? "border-primary/50 shadow-md ring-1 ring-primary/20" : ""}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm">{item.type}</h3>
                  {item.popular && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">Most Popular</Badge>
                  )}
                </div>

                <div className="text-2xl font-extrabold text-foreground font-mono">{item.total}</div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Room Rent: {item.rent}</p>
                  <p>Mess & Dining: {item.mess}</p>
                  <p className="text-emerald-400">Refundable Caution Deposit: ₹5,000</p>
                </div>

                <div className="pt-2 border-t border-border/40 space-y-1.5 text-xs text-muted-foreground">
                  {item.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Options and Loan Tie-ups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Landmark className="w-4 h-4" />
            Accepted Payment Channels
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All semester fees must be paid through the official ERP student finance gateway:
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">1. Online ERP Portal (Zero Surcharge)</strong>
              Supports Net Banking (all major nationalized banks), Debit Cards, and UPI (Google Pay, PhonePe, Paytm).
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">2. Demand Draft (DD)</strong>
              In favor of &quot;CampusIQ University Admissions&quot; payable at Bengaluru. Submit at Central Accounts Desk.
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">3. Institutional Bank NEFT / RTGS Transfer</strong>
              Account Name: CampusIQ Educational Trust | IFSC: SBIN0001234 | Account No: 38291048291
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <DollarSign className="w-4 h-4" />
            Education Loan & Bank Tie-ups
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            CampusIQ University has partnered with leading nationalized and private banks to provide fast-track education loan approvals:
          </p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">State Bank of India (SBI) - On-Campus Branch</strong>
              Concessional interest rate (0.5% lower for female scholars), zero collateral for loans up to ₹7.5 Lakhs.
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">Vidya Lakshmi Education Loan Portal</strong>
              Direct integration for Central Government subsidized interest loan schemes (CSIS) for family income &lt; ₹4.5 LPA.
            </div>
            <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
              <strong className="text-foreground block mb-0.5">Official Bonafide & Fee Estimates</strong>
              Accounts desk issues sanctioned fee estimate letters within 24 hours of provisional seat acceptance.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
