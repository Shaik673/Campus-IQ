"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  History,
  Search,
  Pin,
  Archive,
  Trash2,
  Edit2,
  ExternalLink,
  Download,
  Copy,
  Check,
  CheckSquare,
  Square,
  MessageSquare,
  Calendar,
  Filter,
  PlusCircle,
  MoreVertical,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime, cn } from "@/lib/utils";
import { format, isToday, isYesterday, isAfter, subDays } from "date-fns";

interface ConversationItem {
  id: string;
  title: string;
  category?: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { messages: number };
  messages?: { content: string }[];
}

export default function HistoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewArchived, setViewArchived] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialogs
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [activeConv, setActiveConv] = useState<ConversationItem | null>(null);
  const [newTitle, setNewTitle] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState<ConversationItem | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/conversations?archived=${viewArchived}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch {
      toast({ title: "Failed to load conversation history", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [viewArchived, search]);

  const togglePin = async (id: string, currentPin: boolean) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !currentPin }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isPinned: !currentPin } : c))
        );
        toast({
          title: !currentPin ? "Pinned to Top" : "Unpinned",
          description: !currentPin ? "Conversation prioritized." : "Conversation unpinned.",
        });
      }
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const toggleArchive = async (id: string, currentArchive: boolean) => {
    try {
      const res = await fetch(`/api/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !currentArchive }),
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== id));
        toast({
          title: !currentArchive ? "Archived" : "Unarchived",
          description: !currentArchive ? "Moved to archives." : "Restored to active history.",
        });
      }
    } catch {
      toast({ title: "Action failed", variant: "destructive" });
    }
  };

  const openRename = (conv: ConversationItem) => {
    setActiveConv(conv);
    setNewTitle(conv.title);
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!activeConv || !newTitle.trim()) return;
    try {
      const res = await fetch(`/api/conversations/${activeConv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConv.id ? { ...c, title: newTitle.trim() } : c))
        );
        toast({ title: "Renamed Successfully" });
        setRenameDialogOpen(false);
      }
    } catch {
      toast({ title: "Failed to rename", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!convToDelete) return;
    try {
      const res = await fetch(`/api/conversations/${convToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setConversations((prev) => prev.filter((c) => c.id !== convToDelete.id));
        toast({ title: "Conversation Deleted" });
        setDeleteConfirmOpen(false);
      }
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} conversations?`)) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/conversations/${id}`, { method: "DELETE" })
        )
      );
      setConversations((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      toast({ title: `Deleted ${selectedIds.length} conversations` });
    } catch {
      toast({ title: "Error deleting conversations", variant: "destructive" });
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === conversations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(conversations.map((c) => c.id));
    }
  };

  const exportConversation = async (conv: ConversationItem, exportFormat: "md" | "json") => {
    try {
      const res = await fetch(`/api/conversations/${conv.id}`);
      if (!res.ok) throw new Error();
      const fullData = await res.json();

      let content = "";
      let filename = `CampusIQ_${conv.title.replace(/[^a-zA-Z0-9]/g, "_")}`;

      if (exportFormat === "json") {
        content = JSON.stringify(fullData, null, 2);
        filename += ".json";
      } else {
        content = `# ${conv.title}\nDate: ${format(new Date(conv.createdAt), "PPP")}\n\n`;
        for (const m of fullData.messages || []) {
          content += `### ${m.role === "USER" ? "👤 Student" : "🤖 CampusIQ Assistant"}\n${m.content}\n\n---\n\n`;
        }
        filename += ".md";
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Export downloaded", description: `Saved as ${filename}` });
    } catch {
      toast({ title: "Export failed", variant: "destructive" });
    }
  };

  // Group conversations chronologically
  const pinnedList = conversations.filter((c) => c.isPinned);
  const unpinnedList = conversations.filter((c) => !c.isPinned);

  const groups: { label: string; items: ConversationItem[] }[] = [];

  if (pinnedList.length > 0) {
    groups.push({ label: "📌 Pinned Conversations", items: pinnedList });
  }

  const todayItems: ConversationItem[] = [];
  const yesterdayItems: ConversationItem[] = [];
  const previousWeekItems: ConversationItem[] = [];
  const olderItems: ConversationItem[] = [];

  const sevenDaysAgo = subDays(new Date(), 7);

  for (const c of unpinnedList) {
    const d = new Date(c.updatedAt || c.createdAt);
    if (isToday(d)) {
      todayItems.push(c);
    } else if (isYesterday(d)) {
      yesterdayItems.push(c);
    } else if (isAfter(d, sevenDaysAgo)) {
      previousWeekItems.push(c);
    } else {
      olderItems.push(c);
    }
  }

  if (todayItems.length > 0) groups.push({ label: "Today", items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: "Yesterday", items: yesterdayItems });
  if (previousWeekItems.length > 0) groups.push({ label: "Previous 7 Days", items: previousWeekItems });
  if (olderItems.length > 0) groups.push({ label: "Older", items: olderItems });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Conversation History
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Access, search, reopen, or export your past college enquiry sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/assistant">
            <Button size="sm" className="gap-1.5 shadow-md shadow-primary/20">
              <PlusCircle className="w-4 h-4" />
              New Conversation
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border border-border/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations by title or question content..."
            className="pl-9 h-10 text-sm bg-background border-border/60"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setViewArchived(!viewArchived)}
            className="h-10 text-xs gap-1.5"
          >
            <Archive className="w-3.5 h-3.5" />
            {viewArchived ? "Archived View" : "Active Chats"}
          </Button>

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBatchDelete}
              className="h-10 text-xs gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedIds.length})
            </Button>
          )}

          {conversations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="h-10 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            >
              {selectedIds.length === conversations.length ? (
                <>
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  Select All
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Main Content List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-card/40 rounded-2xl border border-dashed border-border/80">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {viewArchived ? "No archived conversations" : "No conversation history found"}
            </h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm mx-auto">
              {viewArchived
                ? "Chats you archive will appear here for safe keeping."
                : "Ask questions in the AI Assistant to automatically create persistent enquiry records."}
            </p>
          </div>
          {!viewArchived && (
            <Link href="/assistant">
              <Button size="sm" className="gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Start Asking Questions
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h2>
                <span className="text-[10px] text-muted-foreground/60">({group.items.length})</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {group.items.map((conv) => {
                  const isSelected = selectedIds.includes(conv.id);
                  const preview = conv.messages?.[0]?.content || "No preview available";

                  return (
                    <Card
                      key={conv.id}
                      className={cn(
                        "p-4 transition-all duration-200 border-border/60 hover:border-primary/40 bg-card/70 hover:bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 group",
                        isSelected && "border-primary/60 bg-primary/5",
                        conv.isPinned && "border-amber-500/30 bg-amber-500/[0.02]"
                      )}
                    >
                      {/* Left: Checkbox & Info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleSelect(conv.id)}
                          className="mt-1 text-muted-foreground hover:text-primary transition-colors shrink-0"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-primary" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              href={`/assistant?conv=${conv.id}`}
                              className="font-semibold text-sm hover:text-primary transition-colors truncate"
                            >
                              {conv.title}
                            </Link>

                            {conv.category && (
                              <Badge variant="outline" className="text-[10px] uppercase py-0 px-2 font-normal">
                                {conv.category}
                              </Badge>
                            )}

                            {conv.isPinned && (
                              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px] py-0 px-1.5 font-normal gap-1">
                                <Pin className="w-2.5 h-2.5" /> Pinned
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-muted-foreground/80 line-clamp-1">
                            {preview}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 pt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelativeTime(conv.updatedAt || conv.createdAt)}
                            </span>
                            <span>•</span>
                            <span>{conv._count?.messages || 1} messages</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0 self-end md:self-center border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                        <Link href={`/assistant?conv=${conv.id}`}>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2.5 text-xs gap-1 text-primary hover:bg-primary/10"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Continue</span>
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => togglePin(conv.id, conv.isPinned)}
                          className={cn("h-8 w-8", conv.isPinned && "text-amber-400")}
                          title={conv.isPinned ? "Unpin" : "Pin to top"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openRename(conv)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Rename title"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => exportConversation(conv, "md")}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Export Markdown"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleArchive(conv.id, conv.isArchived)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title={conv.isArchived ? "Restore to active" : "Archive"}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setConvToDelete(conv);
                            setDeleteConfirmOpen(true);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Give this enquiry thread a descriptive title.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. B.Tech CSE Fees & Scholarship Eligibility"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename}>Save Title</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete Conversation
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete &quot;{convToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
