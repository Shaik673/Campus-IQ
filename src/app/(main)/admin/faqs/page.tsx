"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Eye,
  Sparkles,
  ArrowUpDown,
  Filter,
  Check,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { FAQ_CATEGORIES } from "@/types";
import { cn } from "@/lib/utils";

interface AdminFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string | null;
  keywords: string;
  isActive: boolean;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: string;
  lastUpdated: string;
}

export default function AdminFaqsPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [faqs, setFaqs] = useState<AdminFAQ[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedActive, setSelectedActive] = useState("");
  const [page, setPage] = useState(1);

  // Create / Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "admissions",
    subcategory: "",
    keywords: "",
    isActive: true,
  });

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<AdminFAQ | null>(null);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedActive) params.set("active", selectedActive);
      params.set("page", String(page));

      const res = await fetch(`/api/admin/faqs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
        setTotal(data.total || 0);
      }
    } catch {
      toast({ title: "Failed to load FAQs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [search, selectedCategory, selectedActive, page]);

  const openCreateModal = () => {
    setIsEditing(false);
    setActiveFaqId(null);
    setFormData({
      question: "",
      answer: "",
      category: "admissions",
      subcategory: "",
      keywords: "",
      isActive: true,
    });
    setEditModalOpen(true);
  };

  const openEditModal = (faq: AdminFAQ) => {
    setIsEditing(true);
    setActiveFaqId(faq.id);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      subcategory: faq.subcategory || "",
      keywords: faq.keywords || "",
      isActive: faq.isActive,
    });
    setEditModalOpen(true);
  };

  const handleSaveFaq = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({ title: "Question and Answer are required", variant: "destructive" });
      return;
    }

    try {
      const url = isEditing ? `/api/admin/faqs/${activeFaqId}` : "/api/admin/faqs";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: isEditing ? "FAQ Updated" : "New FAQ Published",
          description: "Search retrieval index has been synchronized with the updated content.",
        });
        setEditModalOpen(false);
        fetchFaqs();
      } else {
        const err = await res.json();
        toast({ title: "Save Failed", description: err.error, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error saving FAQ", variant: "destructive" });
    }
  };

  const toggleStatus = async (faq: AdminFAQ) => {
    try {
      const res = await fetch(`/api/admin/faqs/${faq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !faq.isActive }),
      });
      if (res.ok) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === faq.id ? { ...f, isActive: !faq.isActive } : f))
        );
        toast({
          title: !faq.isActive ? "FAQ Activated" : "FAQ Deactivated",
        });
      }
    } catch {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const confirmDelete = async () => {
    if (!faqToDelete) return;
    try {
      const res = await fetch(`/api/admin/faqs/${faqToDelete.id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
        setTotal((prev) => prev - 1);
        toast({ title: "FAQ Deleted from Knowledge Base" });
        setDeleteModalOpen(false);
      }
    } catch {
      toast({ title: "Failed to delete FAQ", variant: "destructive" });
    }
  };

  const exportCsv = () => {
    if (faqs.length === 0) return;

    const headers = ["ID", "Category", "Question", "Answer", "Keywords", "IsActive", "ViewCount"];
    const rows = faqs.map((f) => [
      `"${f.id}"`,
      `"${f.category}"`,
      `"${f.question.replace(/"/g, '""')}"`,
      `"${f.answer.replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${f.keywords}"`,
      f.isActive ? "TRUE" : "FALSE",
      f.viewCount,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CampusIQ_KnowledgeBase_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "CSV Export Complete", description: "Downloaded verified knowledge base entries." });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          toast({ title: "Invalid CSV file format", variant: "destructive" });
          return;
        }

        let importedCount = 0;
        // Parse rows (ignoring header)
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(",");
          if (parts.length >= 3) {
            const question = parts[1]?.replace(/^"|"$/g, "").trim() || parts[0]?.replace(/^"|"$/g, "").trim();
            const answer = parts[2]?.replace(/^"|"$/g, "").trim() || "See official departmental brochure.";
            const category = parts[0]?.replace(/^"|"$/g, "").toLowerCase().trim() || "general";

            if (question) {
              await fetch("/api/admin/faqs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  question,
                  answer,
                  category: FAQ_CATEGORIES.some((c) => c.id === category) ? category : "general",
                  keywords: question.toLowerCase(),
                  isActive: true,
                }),
              }).catch(() => {});
              importedCount++;
            }
          }
        }

        toast({
          title: "Import Successful",
          description: `Processed ${importedCount} knowledge records from CSV.`,
        });
        fetchFaqs();
      } catch {
        toast({ title: "Failed to parse CSV file", variant: "destructive" });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Hidden file input for CSV */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleCsvUpload}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
              Administration
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-xs font-semibold text-primary">FAQ Management</span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mt-1">
            <BookOpen className="h-6 w-6 text-primary" />
            Knowledge Base FAQ Management
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {total} total entries registered in the retrieval engine.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={exportCsv} className="gap-1.5 h-9 text-xs">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-1.5 h-9 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Import CSV
          </Button>

          <Button size="sm" onClick={openCreateModal} className="gap-1.5 h-9 shadow-md shadow-primary/20">
            <Plus className="w-4 h-4" />
            Add New FAQ
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card p-3 rounded-xl border border-border/70">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by question or keywords..."
            className="pl-9 h-10 text-sm bg-background border-border/60"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 rounded-lg border border-border/80 bg-background px-3 text-xs focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Categories</option>
            {FAQ_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={selectedActive}
            onChange={(e) => setSelectedActive(e.target.value)}
            className="h-10 rounded-lg border border-border/80 bg-background px-3 text-xs focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* FAQs Admin Table */}
      <Card className="overflow-x-auto border-border/70">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border/70 uppercase font-semibold text-muted-foreground text-[10px]">
            <tr>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5 max-w-sm">Question & Keywords</th>
              <th className="p-3.5">Views</th>
              <th className="p-3.5">Helpful</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-foreground/90">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  Loading verified knowledge entries...
                </td>
              </tr>
            ) : faqs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No FAQs matching your query.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5">
                    <button
                      type="button"
                      onClick={() => toggleStatus(faq)}
                      title={faq.isActive ? "Click to deactivate" : "Click to activate"}
                    >
                      {faq.isActive ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[9px] py-0 px-1.5 font-normal cursor-pointer">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[9px] py-0 px-1.5 font-normal cursor-pointer">
                          Inactive
                        </Badge>
                      )}
                    </button>
                  </td>

                  <td className="p-3.5">
                    <Badge variant="outline" className="text-[10px] uppercase font-normal py-0">
                      {faq.category}
                    </Badge>
                  </td>

                  <td className="p-3.5 max-w-md space-y-1">
                    <span className="font-semibold text-foreground/95 block line-clamp-1">
                      {faq.question}
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 block truncate font-mono">
                      Keywords: {faq.keywords || "None"}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-muted-foreground">{faq.viewCount}</td>
                  <td className="p-3.5 font-mono text-emerald-400">+{faq.helpfulCount}</td>

                  <td className="p-3.5 text-right space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEditModal(faq)}
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setFaqToDelete(faq);
                        setDeleteModalOpen(true);
                      }}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Create / Edit FAQ Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Knowledge Base Entry" : "Create New Verified FAQ"}</DialogTitle>
            <DialogDescription>
              Updates are indexed automatically by the TF-IDF search engine.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold uppercase text-muted-foreground block mb-1">
                Question <span className="text-destructive">*</span>
              </label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g. What is the fee refund policy if an admission is withdrawn?"
                className="h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold uppercase text-muted-foreground block mb-1">
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border/80 bg-background px-3 text-xs"
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase text-muted-foreground block mb-1">
                  Subcategory (Optional)
                </label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g. B.Tech CSE, Boys Hostel, First Year"
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold uppercase text-muted-foreground block mb-1">
                Keywords & Synonyms (comma separated)
              </label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="refund, cancellation, fees back, withdrawal, caution money"
                className="h-10 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold uppercase text-muted-foreground block mb-1">
                Verified Answer (Markdown Supported) <span className="text-destructive">*</span>
              </label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide accurate, detailed information with lists, bold terms, and dates..."
                rows={8}
                className="text-xs font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="isActiveCheck" className="text-xs text-foreground cursor-pointer">
                Publish as Active (Immediate retrieval in search and conversational AI)
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFaq}>
              {isEditing ? "Save Changes" : "Publish FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete FAQ Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete FAQ Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete: &quot;{faqToDelete?.question}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
