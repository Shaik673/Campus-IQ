import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await db.fAQ.findUnique({ where: { id } });
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Increment view count
  await db.fAQ.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  return NextResponse.json(faq);
}
