import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  const isGuest = !userId;

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "7d";

  const days = range === "30d" ? 30 : range === "90d" ? 90 : 7;
  const since = new Date(Date.now() - days * 86400000);

  // If user is authenticated, query their data. If guest, query aggregate campus statistics.
  const userFilter = isGuest ? {} : { userId };

  const [
    totalConversations,
    totalMessages,
    savedAnswers,
    feedbackCount,
    recentActivity,
    categoryBreakdown,
    dailyActivity,
    totalFaqs,
  ] = await Promise.all([
    db.conversation.count({ where: userFilter }),
    db.message.count({
      where: isGuest ? { role: "USER" } : { conversation: { userId }, role: "USER" },
    }),
    db.savedAnswer.count({ where: userFilter }),
    db.feedback.count({ where: userFilter }),
    db.activity.findMany({
      where: userFilter,
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    db.conversation.groupBy({
      by: ["category"],
      where: { ...(isGuest ? {} : { userId }), category: { not: null } },
      _count: { category: true },
    }),
    db.activity.findMany({
      where: { ...(isGuest ? {} : { userId }), createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    }),
    db.fAQ.count({ where: { isActive: true } }),
  ]);

  // Build daily counts
  const dailyCounts: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }
  for (const a of dailyActivity) {
    const key = new Date(a.createdAt).toISOString().split("T")[0];
    if (dailyCounts[key] !== undefined) dailyCounts[key]++;
  }
  const enquiryTrend = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Count messages with AI_ASSISTED vs VERIFIED_FAQ
  const answeredMessages = await db.message.count({
    where: {
      ...(isGuest ? {} : { conversation: { userId } }),
      role: "ASSISTANT",
      answerMode: { in: ["VERIFIED_FAQ", "AI_ASSISTED"] },
    },
  });
  const unansweredMessages = await db.message.count({
    where: {
      ...(isGuest ? {} : { conversation: { userId } }),
      role: "ASSISTANT",
      answerMode: "UNAVAILABLE",
    },
  });

  // If no category breakdown from conversations, populate from top FAQ categories
  let breakdown = categoryBreakdown.map((c) => ({
    category: c.category || "general",
    count: c._count.category,
  }));

  if (breakdown.length === 0) {
    const faqCategories = await db.fAQ.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { category: true },
    });
    breakdown = faqCategories.slice(0, 6).map((c) => ({
      category: c.category,
      count: c._count.category,
    }));
  }

  return NextResponse.json({
    totalEnquiries: totalMessages,
    answeredEnquiries: answeredMessages,
    unansweredCount: unansweredMessages,
    conversationsCount: totalConversations,
    savedAnswers,
    feedbackCount,
    totalFaqs,
    enquiryTrend,
    categoryBreakdown: breakdown,
    recentActivity,
    isGuest,
  });
}
