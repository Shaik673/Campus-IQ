"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  History,
  Search,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  Award,
  Home,
  Bus,
  Building2,
  Briefcase,
  Bookmark,
  MessageCircle,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Library,
  Wrench,
  Bell,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  } | null;
}

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare, badge: "AI" },
  { href: "/history", label: "Conversation History", icon: History },
  { href: "/explore", label: "Explore FAQs", icon: Search },
];

const infoNavItems = [
  { href: "/college-info", label: "College Information", icon: Building2 },
  { href: "/courses", label: "Courses & Programs", icon: BookOpen },
  { href: "/admissions", label: "Admissions & Eligibility", icon: GraduationCap },
  { href: "/fees", label: "Fees & Scholarships", icon: CreditCard },
  { href: "/campus", label: "Campus Facilities", icon: Building2 },
  { href: "/hostel", label: "Hostel & Transportation", icon: Home },
  { href: "/placements", label: "Placements & Careers", icon: Briefcase },
];

const userNavItems = [
  { href: "/saved", label: "Saved Answers", icon: Bookmark },
  { href: "/tools", label: "Learning Tools", icon: Wrench },
  { href: "/feedback", label: "Feedback & Support", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Brand */}
        <div className={cn("flex items-center h-14 px-3 border-b border-sidebar-border shrink-0", !collapsed && "gap-3")}>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 shrink-0">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <span className="font-bold text-base text-gradient">CampusIQ</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 ml-auto shrink-0", collapsed && "ml-0")}
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {/* Main */}
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
              Main
            </p>
          )}
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              collapsed={collapsed}
            />
          ))}

          <div className="my-2 border-t border-sidebar-border" />

          {/* Information */}
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
              Information
            </p>
          )}
          {infoNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              collapsed={collapsed}
            />
          ))}

          <div className="my-2 border-t border-sidebar-border" />

          {/* Personal */}
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
              Personal
            </p>
          )}
          {userNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              active={pathname === item.href || pathname.startsWith(item.href + "/")}
              collapsed={collapsed}
            />
          ))}

          {/* Admin */}
          {isAdmin && (
            <>
              <div className="my-2 border-t border-sidebar-border" />
              {!collapsed && (
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1">
                  Administration
                </p>
              )}
              <NavItem
                href="/admin"
                label="Administration"
                icon={Shield}
                active={pathname.startsWith("/admin")}
                collapsed={collapsed}
                badge="ADMIN"
              />
            </>
          )}
        </nav>

        {/* Profile */}
        <div className="border-t border-sidebar-border p-2 shrink-0">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-10 px-2 justify-center"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Sign out</TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2 px-1 py-1">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user?.name || "Guest"}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email || ""}
                </p>
              </div>
              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/settings">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <User className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>Profile</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sign out</TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  collapsed: boolean;
  badge?: string;
}) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "nav-item justify-center px-2",
              active && "nav-item-active"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      href={href}
      className={cn("nav-item", active && "nav-item-active")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <Badge variant="outline" className="h-4 text-[9px] px-1 ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
}
