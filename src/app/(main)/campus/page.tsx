"use client";

import Link from "next/link";
import {
  Building2,
  Library,
  Cpu,
  HeartPulse,
  Trophy,
  Coffee,
  Sun,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FACILITIES = [
  {
    title: "Central Library & Digital Knowledge Center",
    category: "Academic",
    icon: Library,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    stats: "120,000+ Volumes • 24/7 Exam Reading Halls",
    description: "Fully automated library with RFID self-checkout, air-conditioned reading halls, 100 digital workstations, and remote proxy access to IEEE, ACM, Springer, and ScienceDirect journals.",
    features: ["RFID Self-Service Checkout", "Turnitin Plagiarism Software", "Discussion Pods", "Remote Digital Access"],
  },
  {
    title: "High-Tech Innovation & Computing Clusters",
    category: "Research",
    icon: Cpu,
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
    stats: "NVIDIA DGX A100 Clusters • 1,200 Workstations",
    description: "Equipped with high-performance computing GPU clusters for deep learning, specialized IoT hardware setups, 3D rapid prototyping maker-spaces, and industrial robotics rigs.",
    features: ["NVIDIA GPU AI Cluster", "MakerSpace with 3D Printers", "Embedded Systems Lab", "Robotics Testing Floor"],
  },
  {
    title: "24/7 Health, Wellness & Medical Center",
    category: "Student Care",
    icon: HeartPulse,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
    stats: "Resident Doctors • Dedicated BLS Ambulance",
    description: "Full-time resident medical officers and qualified nurses available round the clock. Fully stocked dispensary, emergency treatment beds, and tie-ups with leading tertiary hospitals.",
    features: ["24/7 On-Duty Doctors", "Free Emergency First Aid", "Campus Ambulance", "₹1 Lakh Student Insurance"],
  },
  {
    title: "Olympus Sports Complex & Athletic Grounds",
    category: "Athletics",
    icon: Trophy,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    stats: "400m Track • Floodlit Arenas • 8 Badminton Courts",
    description: "Extensive sports infrastructure including a full-sized floodlit cricket stadium, FIFA-standard turf football pitch, Olympic powerlifting fitness center, and indoor wooden badminton arenas.",
    features: ["Floodlit Football Turf", "Gym & Power Racks", "Badminton & Squash", "Professional Coaches"],
  },
  {
    title: "Smart Air-Conditioned Lecture Theaters",
    category: "Classrooms",
    icon: Building2,
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
    stats: "45 Tiered Theaters • Automated Lecture Capture",
    description: "Ergonomically designed amphitheater-style lecture halls with dual-power charging at every seat, interactive touch podiums, surround acoustic systems, and high-definition lecture capture.",
    features: ["Seat Power Outlets", "Automated Lecture Video", "Acoustic Insulation", "Smart Touch Boards"],
  },
  {
    title: "Multi-Cuisine Cafeterias & Food Courts",
    category: "Dining",
    icon: Coffee,
    color: "from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30",
    stats: "3 Dining Hubs • Open 8:00 AM - 10:30 PM",
    description: "Hygienic multi-cuisine dining options offering North Indian, South Indian, continental meals, fresh juice bars, and branded outlets (CCD, Subway, Amul) with strict bi-weekly safety audits.",
    features: ["Hygienic Kitchens", "Subsidized Student Rates", "Branded Outlets", "Late-Night Snack Counter"],
  },
  {
    title: "Net-Zero Green Campus Initiatives",
    category: "Sustainability",
    icon: Sun,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    stats: "1.2 MW Solar Power • 100% Recycled Water",
    description: "Recognized as one of the cleanest green campuses nationwide. Features 1.2 MW rooftop solar panels, rainwater harvesting reservoirs, 100% sewage water treatment, and zero single-use plastic.",
    features: ["1.2 MW Rooftop Solar", "Rainwater Harvesting", "100% Recycled Water", "Zero Single-Use Plastic"],
  },
  {
    title: "Campus-Wide Optical Fiber & 1 Gbps Wi-Fi",
    category: "Connectivity",
    icon: Wifi,
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
    stats: "1 Gbps Symmetrical • Seamless Hostels & Labs",
    description: "Uninterrupted optical fiber backbone across all academic departments, student hostels, and athletic fields with institutional SSO single-sign-on credentials.",
    features: ["1 Gbps Leased Line", "Secure Firewall Filter", "2 Device Connection/Student", "24/7 Hostel Access"],
  },
];

export default function CampusPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Campus Facilities & Infrastructure
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Explore our 120-acre modern campus designed for world-class learning, athletics, and student life.
          </p>
        </div>

        <Link href="/assistant?q=What%20campus%20facilities%20are%20available%20for%20students?">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant About Campus
          </Button>
        </Link>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FACILITIES.map((fac) => {
          const Icon = fac.icon;
          return (
            <Card key={fac.title} className="p-5 border-border/70 bg-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${fac.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-normal uppercase">
                    {fac.category}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base leading-snug">{fac.title}</h3>
                  <span className="text-xs text-primary font-medium block mt-0.5">{fac.stats}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {fac.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                {fac.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
