"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  Folder,
  Trash2,
  Edit3,
  Copy,
  Check,
  Download,
  Sparkles,
  ExternalLink,
  Plus,
  BookOpen,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime, cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface SavedItem {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  collection?: string | null;
  notes?: string | null;
  createdAt: string;
  faq?: { id: string; question: string; category: string } | null;
}

export default function SavedAnswersPage() {
  const { toast } = useToast();

  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Notes Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<SavedItem | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editCollection, setEditCollection] = useState("");

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/saved");
      if (res.ok) {
        const data = await res.json();
        setItems(data || []);
      }
    } catch {
      toast({ title: "Failed to load saved items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/saved/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        toast({ title: "Removed from Saved Items" });
      }
    } catch {
      toast({ title: "Error deleting item", variant: "destructive" });
    }
  };

  const openEdit = (item: SavedItem) => {
    setActiveItem(item);
    setEditNotes(item.notes || "");
    setEditCollection(item.collection || "General");
    setEditDialogOpen(true);
  };

  const confirmEdit = async () => {
    if (!activeItem) return;
    try {
      const res = await fetch(`/api/saved/${activeItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: editNotes,
          collection: editCollection,
        }),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === activeItem.id ? { ...i, notes: editNotes, collection: editCollection } : i
          )
        );
        toast({ title: "Updated notes and collection" });
        setEditDialogOpen(false);
      }
    } catch {
      toast({ title: "Failed to update item", variant: "destructive" });
    }
  };

  const copyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied answer to clipboard" });
  };

  const exportAll = (exportFormat: "md" | "json") => {
    if (items.length === 0) return;

    let content = "";
    let filename = `CampusIQ_Notebook_${new Date().toISOString().split("T")[0]}`;

    if (exportFormat === "json") {
      content = JSON.stringify(items, null, 2);
      filename += ".json";
    } else {
      content = `# CampusIQ Saved College Knowledge Collection\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
      for (const item of items) {
        content += `## ${item.title}\n`;
        content += `Collection: ${item.collection || "General"} | Category: ${item.category || "General"}\n`;
        if (item.notes) content += `> Personal Note: ${item.notes}\n\n`;
        content += `${item.content}\n\n---\n\n`;
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
    toast({ title: "Notebook Exported", description: `Saved as ${filename}` });
  };

  // Extract unique collections
  const collections = Array.from(
    new Set(items.map((i) => i.collection || "General"))
  ).filter(Boolean);

  const filteredItems = items.filter((item) => {
    const matchesCollection =
      selectedCollection === "all" || (item.collection || "General") === selectedCollection;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.content.toLowerCase().includes(search.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()));
    return matchesCollection && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bookmark className="h-6 w-6 text-primary" />
            Saved Answers & Personal Notebook
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Organize bookmarked college policies, fees, deadlines, and FAQ answers into custom folders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAll("md")}
              className="gap-1.5 text-xs h-9"
            >
              <Download className="w-3.5 h-3.5" />
              Export Markdown
            </Button>
          )}

          <Link href="/explore">
            <Button size="sm" className="gap-1.5 h-9 shadow-md shadow-primary/20">
              <Search className="w-3.5 h-3.5" />
              Explore More FAQs
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Collection Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border border-border/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved answers and notes..."
            className="pl-9 h-10 text-sm bg-background border-border/60"
          />
        </div>

        {/* Collection Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCollection("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border",
              selectedCollection === "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
            )}
          >
            All Items ({items.length})
          </button>
          {collections.map((col) => (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 border flex items-center gap-1",
                selectedCollection === col
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
              )}
            >
              <Folder className="w-3 h-3" />
              <span>{col}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Items List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-card rounded-xl animate-pulse border border-border/40" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-card/40 rounded-2xl border border-dashed border-border/80">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">
              {items.length === 0 ? "No saved answers yet" : "No matching items in this collection"}
            </h3>
            <p className="text-muted-foreground text-xs mt-1 max-w-sm mx-auto">
              Save responses from the AI Assistant or Explore FAQs by clicking the bookmark button to collect admissions, fees, and scholarship facts.
            </p>
          </div>
          <Link href="/explore">
            <Button size="sm" className="gap-1.5">
              <Search className="w-3.5 h-3.5" />
              Browse Knowledge Hub
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="border-border/70 bg-card hover:border-primary/40 transition-all duration-200 flex flex-col justify-between shadow-sm overflow-hidden"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] uppercase py-0 font-normal">
                        {item.collection || "General"}
                      </Badge>
                      {item.category && (
                        <Badge variant="secondary" className="text-[10px] uppercase py-0 font-normal">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-foreground/95 line-clamp-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(item)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="Edit Notes"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Personal Notes Box */}
                {item.notes && (
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90">
                    <strong className="block text-[10px] uppercase font-bold text-amber-300 mb-0.5">Personal Note:</strong>
                    <p className="leading-relaxed">{item.notes}</p>
                  </div>
                )}

                {/* Content Markdown Snippet */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs text-muted-foreground/90 line-clamp-4 leading-relaxed bg-muted/20 p-3 rounded-lg border border-border/40">
                  <ReactMarkdown>{item.content}</ReactMarkdown>
                </div>

                {/* Action Bar */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="text-[11px] text-muted-foreground/60">
                    Saved {formatRelativeTime(item.createdAt)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyContent(item.content, item.id)}
                      className="h-7 px-2 text-xs gap-1"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </Button>

                    <Link href={`/assistant?q=${encodeURIComponent(item.title)}`}>
                      <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[11px]">Ask Assistant</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Notes Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Saved Item Details</DialogTitle>
            <DialogDescription>
              Update the folder collection or attach personal notes for your reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Collection / Folder</label>
              <Input
                value={editCollection}
                onChange={(e) => setEditCollection(e.target.value)}
                placeholder="e.g. Admissions 2026, Scholarships, Exam Prep"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-muted-foreground">Personal Notes</label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add reminders, document requirements, or follow-up questions..."
                className="mt-1 text-xs"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
