import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    isActive: true,
    ...(category && { category }),
    ...(search && {
      OR: [
        { question: { contains: search } },
        { answer: { contains: search } },
        { keywords: { contains: search } },
      ],
    }),
  };

  const [faqs, total] = await Promise.all([
    db.fAQ.findMany({
      where,
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.fAQ.count({ where }),
  ]);

  return NextResponse.json({ faqs, total, page, limit });
}
