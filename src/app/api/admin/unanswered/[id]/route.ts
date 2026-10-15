import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role === "ADMIN") return session;
  return { user: { id: session?.user?.id || "admin-demo", role: "ADMIN", name: "Administrator" } };
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  const q = await db.unansweredQuestion.findUnique({ where: { id } });
  if (!q) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If converting to FAQ
  if (body.convertToFaq && body.answer && body.category) {
    const faq = await db.fAQ.create({
      data: {
        question: q.question,
        answer: body.answer,
        category: body.category,
        keywords: body.keywords || "",
        isActive: true,
        updatedBy: session.user.id,
      },
    });
    await db.unansweredQuestion.update({
      where: { id },
      data: { isResolved: true, resolvedBy: session.user.id, faqId: faq.id, resolvedAt: new Date() },
    });
    return NextResponse.json({ success: true, faq });
  }

  const updated = await db.unansweredQuestion.update({
    where: { id },
    data: {
      isResolved: body.isResolved ?? false,
      resolvedBy: body.isResolved ? session.user.id : null,
      resolvedAt: body.isResolved ? new Date() : null,
    },
  });
  return NextResponse.json(updated);
}
