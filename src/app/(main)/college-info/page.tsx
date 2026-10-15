"use client";

import Link from "next/link";
import {
  Building2,
  GraduationCap,
  BookOpen,
  CreditCard,
  Award,
  Home,
  Bus,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INFO_SECTIONS = [
  {
    title: "Courses & Academic Programs",
    description: "Explore 18+ undergraduate, postgraduate, and doctoral degree programs with updated curricula.",
    href: "/courses",
    icon: BookOpen,
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
    stats: "4 Disciplines • 18 Degrees",
  },
  {
    title: "Admissions & Eligibility Guide",
    description: "Detailed entrance examination cutoffs, application procedure, eligibility criteria, and timeline.",
    href: "/admissions",
    icon: GraduationCap,
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
    stats: "JEE Main • State CET • Lateral Entry",
  },
  {
    title: "Fee Structure & Payment",
    description: "Complete transparent breakdown of tuition, examination, laboratory, and library fees per semester.",
    href: "/fees",
    icon: CreditCard,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    stats: "Zero Hidden Charges • Installments",
  },
  {
    title: "Scholarships & Financial Aid",
    description: "Merit scholarships for top entrance rankers, sports achievers, and government fee waiver schemes.",
    href: "/scholarships",
    icon: Award,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    stats: "Up to 100% Tuition Waiver",
  },
  {
    title: "Campus Infrastructure & Life",
    description: "World-class central library, modern research laboratories, 24/7 health center, and athletic arenas.",
    href: "/campus",
    icon: Building2,
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    stats: "120-Acre Smart Green Campus",
  },
  {
    title: "Hostel & Transportation Fleet",
    description: "Safe on-campus student residences with nutritious dining options and 25 bus transit routes.",
    href: "/hostel",
    icon: Home,
    color: "from-cyan-500/20 to-sky-500/20 text-cyan-400 border-cyan-500/30",
    stats: "3,000+ Resident Capacity • 25 Bus Routes",
  },
  {
    title: "Placements & Career Center",
    description: "Industry tie-ups, corporate internships, average packages, and top global recruiting companies.",
    href: "/placements",
    icon: Briefcase,
    color: "from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/30",
    stats: "94.6% Placement Rate • ₹44 LPA Highest",
  },
];

export default function CollegeInfoPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 border border-blue-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>NAAC A++ Accredited • NIRF Top 50 Ranked • Autonomous Institution</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            CampusIQ University <br />
            <span className="text-gradient">Information Center</span>
          </h1>

          <p className="text-blue-100/80 text-sm md:text-base leading-relaxed">
            Welcome to the official institutional guide. Access verified academic regulations,
            admissions requirements, fee structures, facilities, and placement achievements.
            All data is maintained by university departmental coordinators.
          </p>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <Link href="/assistant">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Sparkles className="w-4 h-4" />
                Ask Assistant About Campus
              </Button>
            </Link>
            <Link href="/admissions">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                2026-27 Admissions
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Highlights Counter */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          {[
            { label: "Established", value: "2002" },
            { label: "Active Students", value: "6,500+" },
            { label: "Faculty (PhD holders)", value: "320+ (85%)" },
            { label: "Recruiting Partners", value: "180+" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-blue-200/60 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Directory Sections Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Institutional Information Portals</h2>
          <p className="text-muted-foreground text-sm">
            Select an area below for detailed guides, comparison tables, and administrative policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INFO_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <Link key={sec.title} href={sec.href}>
                <Card className="h-full border-border/70 hover:border-primary/40 bg-card hover:bg-muted/10 transition-all duration-200 group cursor-pointer shadow-sm">
                  <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${sec.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <Badge variant="secondary" className="text-[11px] font-normal">
                          {sec.stats}
                        </Badge>
                      </div>

                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                        {sec.title}
                      </h3>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {sec.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium pt-2 border-t border-border/40">
                      <span>View Detailed Section</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Administrative Contacts Footer Card */}
      <Card className="p-6 bg-card border-border/70">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Central Campus Information Desk
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have a specialized enquiry not covered in online documentation? Reach out directly
              to the academic registrar or admissions counselling committee.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Knowledge City, Bengaluru, Karnataka 560100
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                admissions@campusiq.edu
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/feedback">
              <Button variant="outline" size="sm" className="h-9">
                Contact Helpdesk
              </Button>
            </Link>
            <Link href="/assistant">
              <Button size="sm" className="h-9 gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Ask Assistant
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
