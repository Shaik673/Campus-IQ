"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Users,
  Search,
  ArrowRight,
  Cpu,
  Layers,
  Award,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Course {
  id: string;
  name: string;
  degree: "B.Tech" | "M.Tech" | "MBA" | "MCA" | "Ph.D.";
  level: "ug" | "pg" | "phd";
  duration: string;
  intake: number;
  eligibility: string;
  specializations: string[];
  careerRoles: string[];
  description: string;
}

const COURSES_DATA: Course[] = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    degree: "B.Tech",
    level: "ug",
    duration: "4 Years (8 Semesters)",
    intake: 240,
    eligibility: "10+2 with Physics, Mathematics & Chemistry (min 60% aggregate) + JEE Main / CET score",
    specializations: ["Artificial Intelligence & ML", "Cloud Computing & DevOps", "Cyber Security & Forensics"],
    careerRoles: ["Software Development Engineer (SDE)", "Full Stack Architect", "Cloud Systems Engineer"],
    description: "Industry-aligned curriculum covering algorithms, distributed computing, microservices, and applied machine learning with cutting-edge lab infrastructure.",
  },
  {
    id: "ai-ds",
    name: "Artificial Intelligence & Data Science",
    degree: "B.Tech",
    level: "ug",
    duration: "4 Years (8 Semesters)",
    intake: 120,
    eligibility: "10+2 with Physics, Mathematics & Chemistry (min 60% aggregate) + JEE Main / CET score",
    specializations: ["Deep Learning & NLP", "Big Data Analytics", "Computer Vision"],
    careerRoles: ["Data Scientist", "ML Engineer", "AI Research Associate"],
    description: "Specialized degree focusing on statistical modeling, neural networks, predictive algorithms, and high-performance computing on GPU clusters.",
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    degree: "B.Tech",
    level: "ug",
    duration: "4 Years (8 Semesters)",
    intake: 180,
    eligibility: "10+2 with Physics, Mathematics & Chemistry (min 60% aggregate) + JEE Main / CET score",
    specializations: ["VLSI Design & Embedded Systems", "5G/6G Wireless Networks", "IoT & Robotics"],
    careerRoles: ["VLSI Design Engineer", "Embedded Firmware Developer", "RF System Engineer"],
    description: "Comprehensive study of semiconductor devices, digital signal processing, satellite communications, and modern IoT architecture.",
  },
  {
    id: "me",
    name: "Mechanical Engineering",
    degree: "B.Tech",
    level: "ug",
    duration: "4 Years (8 Semesters)",
    intake: 120,
    eligibility: "10+2 with Physics, Mathematics & Chemistry (min 60% aggregate) + JEE Main / CET score",
    specializations: ["Automotive Engineering & EV", "Robotics & Automation", "Thermodynamics & Energy Systems"],
    careerRoles: ["Design & Simulation Engineer", "Production Specialist", "Automotive R&D Engineer"],
    description: "Hands-on engineering curriculum featuring modern CAD/CAM/CAE centers, rapid prototyping labs, and formula racing vehicle project teams.",
  },
  {
    id: "civil",
    name: "Civil & Environmental Engineering",
    degree: "B.Tech",
    level: "ug",
    duration: "4 Years (8 Semesters)",
    intake: 60,
    eligibility: "10+2 with Physics, Mathematics & Chemistry (min 60% aggregate) + JEE Main / CET score",
    specializations: ["Structural Engineering & BIM", "Smart City Infrastructure", "Environmental Management"],
    careerRoles: ["Structural Consultant", "Project Planning Engineer", "Geotechnical Engineer"],
    description: "Focus on resilient green structures, earthquake engineering, urban transportation, and building information modeling (BIM).",
  },
  {
    id: "mtech-cse",
    name: "M.Tech in Computer Science & Engineering",
    degree: "M.Tech",
    level: "pg",
    duration: "2 Years (4 Semesters)",
    intake: 30,
    eligibility: "B.E./B.Tech in CSE/IT or MCA with minimum 60% marks + valid GATE score",
    specializations: ["High Performance Computing", "Distributed Ledger & Cryptography"],
    careerRoles: ["Senior Research Engineer", "Systems Architect", "Doctoral Researcher"],
    description: "Advanced post-graduate research program focusing on scalable architectures, autonomous systems, and sponsored defense/industry research.",
  },
  {
    id: "mtech-vlsi",
    name: "M.Tech in VLSI Design & Embedded Systems",
    degree: "M.Tech",
    level: "pg",
    duration: "2 Years (4 Semesters)",
    intake: 24,
    eligibility: "B.E./B.Tech in ECE/EEE/Instrumentation with minimum 60% marks + valid GATE score",
    specializations: ["ASIC Design & Synthesis", "System on Chip (SoC) Architecture"],
    careerRoles: ["Chip Design Specialist", "Physical Design Engineer", "Verification Architect"],
    description: "Industry partnered with Synopsys and Cadence EDA suites for deep sub-micron semiconductor design and tape-out exposure.",
  },
  {
    id: "mba",
    name: "Master of Business Administration (MBA)",
    degree: "MBA",
    level: "pg",
    duration: "2 Years (4 Semesters)",
    intake: 120,
    eligibility: "Bachelor's degree in any discipline (min 50% aggregate) + CAT/MAT/CMAT score",
    specializations: ["Business Analytics", "FinTech & Investment Banking", "Operations & Supply Chain"],
    careerRoles: ["Product Manager", "Management Consultant", "Financial Analyst"],
    description: "Case-study driven business management program equipped with Bloomberg financial terminal simulation labs and global executive mentorship.",
  },
  {
    id: "mca",
    name: "Master of Computer Applications (MCA)",
    degree: "MCA",
    level: "pg",
    duration: "2 Years (4 Semesters)",
    intake: 60,
    eligibility: "BCA/B.Sc. in Computer Science/IT or equivalent with Mathematics at 10+2/Degree level",
    specializations: ["Cloud Native Computing", "Full Stack Enterprise Engineering"],
    careerRoles: ["Application Engineer", "Enterprise Developer", "Database Administrator"],
    description: "Rigorous computing program designed to transform graduates into top-tier enterprise software developers with 6-month corporate internships.",
  },
  {
    id: "phd",
    name: "Doctor of Philosophy (Ph.D.) in Engineering & Science",
    degree: "Ph.D.",
    level: "phd",
    duration: "3 to 5 Years",
    intake: 45,
    eligibility: "Master's degree in relevant discipline with minimum 65% aggregate + University Entrance/NET",
    specializations: ["Artificial Intelligence", "Advanced Nanomaterials", "Renewable Energy Systems"],
    careerRoles: ["University Professor", "Principal Scientist", "Industrial R&D Director"],
    description: "Full-time and part-time doctoral research fellowships with monthly institutional stipends and access to state-of-the-art central research facilities.",
  },
];

export default function CoursesPage() {
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = COURSES_DATA.filter((course) => {
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    const matchesSearch =
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.degree.toLowerCase().includes(search.toLowerCase()) ||
      course.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Courses & Academic Programs
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Explore accredited undergraduate, postgraduate, and doctoral degree programs.
          </p>
        </div>

        <Link href="/admissions">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <GraduationCap className="w-4 h-4" />
            View Admission Criteria
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border border-border/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by program name, degree, or specialization..."
            className="pl-9 h-10 text-sm bg-background border-border/60"
          />
        </div>

        <Tabs value={levelFilter} onValueChange={setLevelFilter} className="w-auto">
          <TabsList className="bg-muted/60 p-1 h-10">
            <TabsTrigger value="all" className="text-xs px-3">All Levels</TabsTrigger>
            <TabsTrigger value="ug" className="text-xs px-3">Undergraduate</TabsTrigger>
            <TabsTrigger value="pg" className="text-xs px-3">Postgraduate</TabsTrigger>
            <TabsTrigger value="phd" className="text-xs px-3">Doctoral</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course) => (
          <Card
            key={course.id}
            className="border-border/70 bg-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between shadow-sm"
          >
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5 border-primary/40 text-primary">
                    {course.degree}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground/95">{course.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Course Key Details Grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground/70 block text-[10px] uppercase font-semibold">Intake Capacity</span>
                  <span className="font-semibold text-foreground">{course.intake} Seats / Year</span>
                </div>
                <div>
                  <span className="text-muted-foreground/70 block text-[10px] uppercase font-semibold">Degree Level</span>
                  <span className="font-semibold text-foreground uppercase">{course.level} Program</span>
                </div>
              </div>

              {/* Specializations */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase text-muted-foreground block">
                  Elective Specializations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {course.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-[11px] font-normal py-0 px-2">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Eligibility */}
              <div className="space-y-1 text-xs bg-blue-500/5 border border-blue-500/20 p-2.5 rounded-lg text-blue-200/90">
                <span className="font-semibold text-blue-400 block text-[11px]">Eligibility Criteria:</span>
                <p className="text-[11px] leading-relaxed">{course.eligibility}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <Link href={`/assistant?q=${encodeURIComponent(`What is the curriculum and eligibility for ${course.name}?`)}`}>
                  <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask Assistant
                  </Button>
                </Link>

                <Link href="/admissions">
                  <Button size="sm" variant="ghost" className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground">
                    <span>Admissions Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
