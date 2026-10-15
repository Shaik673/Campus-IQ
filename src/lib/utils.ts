import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
  if (isYesterday(d)) return `Yesterday at ${format(d, "h:mm a")}`;
  return format(d, "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFullDate(date: Date | string): string {
  return format(new Date(date), "MMMM d, yyyy 'at' h:mm a");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function groupByDate<T extends { createdAt: Date | string }>(
  items: T[]
): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of items) {
    const d = new Date(item.createdAt);
    let key: string;
    if (isToday(d)) key = "Today";
    else if (isYesterday(d)) key = "Yesterday";
    else {
      const daysAgo = Math.floor(
        (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysAgo <= 7) key = "This Week";
      else if (daysAgo <= 30) key = "This Month";
      else key = format(d, "MMMM yyyy");
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    admissions: "blue",
    courses: "violet",
    eligibility: "cyan",
    fees: "green",
    scholarships: "yellow",
    hostel: "orange",
    transportation: "red",
    library: "indigo",
    campus: "pink",
    examinations: "teal",
    placements: "emerald",
    faculty: "purple",
    contact: "sky",
    general: "slate",
  };
  return colors[category] || "gray";
}

export function getCategoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    admissions: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    courses: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    eligibility: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    fees: "bg-green-500/10 text-green-400 border-green-500/20",
    scholarships: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    hostel: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    transportation: "bg-red-500/10 text-red-400 border-red-500/20",
    library: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    campus: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    examinations: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    placements: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    faculty: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    contact: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    general: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return map[category] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
}

export function parseJSON<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export function sanitizeInput(text: string): string {
  return text.trim().slice(0, 2000);
}
