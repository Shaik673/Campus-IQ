"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Shield,
  User,
  Search,
  Calendar,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface UserRecord {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count?: { conversations: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
              Administration
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-semibold text-primary">Users</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
            <Users className="h-6 w-6 text-primary" />
            User Accounts & Roles Directory
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Registered students, faculty coordinators, and institutional administrators.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9 h-10 text-sm bg-card border-border/70"
        />
      </div>

      {/* Users Table */}
      <Card className="overflow-x-auto border-border/70">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
            <tr>
              <th className="p-3.5">User</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Role</th>
              <th className="p-3.5">Conversations</th>
              <th className="p-3.5">Member Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-foreground/90">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading user directory...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-bold flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                      {(u.name || u.email)[0].toUpperCase()}
                    </div>
                    <span>{u.name || "Student User"}</span>
                  </td>
                  <td className="p-3.5 font-mono text-muted-foreground">{u.email}</td>
                  <td className="p-3.5">
                    <Badge
                      className={
                        u.role === "ADMIN"
                          ? "bg-violet-500/10 text-violet-400 border-violet-500/30 text-[10px]"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30 text-[10px]"
                      }
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="p-3.5 font-mono text-muted-foreground">
                    {u._count?.conversations ?? 0}
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    {formatRelativeTime(u.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
