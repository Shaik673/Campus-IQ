"use client";

import Link from "next/link";
import {
  Home,
  Bus,
  Utensils,
  Clock,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BUS_ROUTES = [
  { routeNo: "Route 01", startPoint: "Central Railway Station", via: "Majestic, Malleshwaram, Yeshwanthpur", time: "7:15 AM", fare: "₹24,000 / year" },
  { routeNo: "Route 04", startPoint: "Indiranagar Metro", via: "HAL, Marathahalli, Bellandur, Sarjapur", time: "7:00 AM", fare: "₹26,000 / year" },
  { routeNo: "Route 07", startPoint: "Jayanagar 4th Block", via: "BTM Layout, Silk Board, HSR Layout", time: "7:10 AM", fare: "₹24,000 / year" },
  { routeNo: "Route 12", startPoint: "Whitefield ITPL", via: "Kadugodi, Hoodi, KR Puram, Outer Ring Road", time: "7:05 AM", fare: "₹26,000 / year" },
  { routeNo: "Route 18", startPoint: "Electronic City Gate 1", via: "Bommanahalli, Kudlu Gate, Singasandra", time: "7:20 AM", fare: "₹22,000 / year" },
  { routeNo: "Route 23", startPoint: "Hebbal Flyover", via: "RT Nagar, Banaswadi, Kalyan Nagar, Tin Factory", time: "6:55 AM", fare: "₹28,000 / year" },
];

export default function HostelPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            Hostel & Transportation Guide
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Safe residential accommodations for 3,000+ students and extensive city transit fleet.
          </p>
        </div>

        <Link href="/assistant?q=What%20are%20the%20hostel%20fees%20and%20rules?">
          <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4" />
            Ask Assistant About Hostels
          </Button>
        </Link>
      </div>

      {/* Hostel Features & Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Home className="w-4 h-4" />
            Residential Blocks & Security
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Four boys&apos; hostel blocks and three girls&apos; hostel blocks with biometric turnstiles, 24/7 CCTV surveillance, and dedicated resident wardens.
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Biometric entry & turnstiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Dedicated fresher block (anti-ragging)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Commercial laundry machines</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Filtered RO drinking water on every floor</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Utensils className="w-4 h-4" />
            Dining & Mess Timings
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nutritious four-meal routine prepared under strict food hygiene standards with student-elected menu committees.
          </p>
          <div className="space-y-1 text-xs text-muted-foreground pt-1">
            <div className="p-1.5 rounded bg-muted/40 flex justify-between">
              <span>Breakfast:</span>
              <strong className="text-foreground">7:30 AM - 9:00 AM</strong>
            </div>
            <div className="p-1.5 rounded bg-muted/40 flex justify-between">
              <span>Lunch:</span>
              <strong className="text-foreground">12:30 PM - 2:00 PM</strong>
            </div>
            <div className="p-1.5 rounded bg-muted/40 flex justify-between">
              <span>Evening Snacks:</span>
              <strong className="text-foreground">5:00 PM - 6:00 PM</strong>
            </div>
            <div className="p-1.5 rounded bg-muted/40 flex justify-between">
              <span>Dinner:</span>
              <strong className="text-foreground">7:30 PM - 9:30 PM</strong>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border/70 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Clock className="w-4 h-4" />
            Curfew & Leave Pass Guidelines
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Safety protocols are enforced to ensure student accountability while supporting academic freedom.
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>In-Campus Curfew: 9:30 PM daily</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Hostel Block Lock: 10:30 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Weekend Home Pass via ERP approval</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Automated SMS alerts to parents on exit</span>
            </div>
          </div>
        </Card>
      </div>

      {/* College Transportation Fleet Table */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Bus className="w-5 h-5 text-primary" />
            College Bus Fleet & Major Commute Routes
          </h2>
          <p className="text-muted-foreground text-xs">
            Over 25 GPS-enabled institutional buses connect major city hubs and transit stations with campus.
          </p>
        </div>

        <Card className="overflow-x-auto border-border/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
              <tr>
                <th className="p-3.5">Route</th>
                <th className="p-3.5">Starting Hub</th>
                <th className="p-3.5">Key Major Pickup Stops</th>
                <th className="p-3.5">Departure Time</th>
                <th className="p-3.5 font-bold text-foreground">Annual Bus Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-foreground/90">
              {BUS_ROUTES.map((route) => (
                <tr key={route.routeNo}>
                  <td className="p-3.5 font-bold text-primary font-mono">{route.routeNo}</td>
                  <td className="p-3.5 font-semibold">{route.startPoint}</td>
                  <td className="p-3.5 text-muted-foreground">{route.via}</td>
                  <td className="p-3.5 font-mono">{route.time}</td>
                  <td className="p-3.5 font-bold font-mono text-foreground">{route.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
