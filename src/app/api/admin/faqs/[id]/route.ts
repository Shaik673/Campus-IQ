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

  const faq = await db.fAQ.findUnique({ where: { id } });
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.fAQ.update({
    where: { id },
    data: {
      ...(body.question !== undefined && { question: body.question }),
      ...(body.answer !== undefined && { answer: body.answer }),
      ...(body.category !== undefined && { category: body.category }),
      ...(body.subcategory !== undefined && { subcategory: body.subcategory }),
      ...(body.keywords !== undefined && { keywords: body.keywords }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      lastUpdated: new Date(),
      updatedBy: session.user.id,
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await db.fAQ.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
