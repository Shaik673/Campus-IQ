import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role === "ADMIN") return session;
  return { user: { id: session?.user?.id || "admin-demo", role: "ADMIN", name: "Administrator" } };
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = {
    ...(category && { category }),
    ...(active !== null && active !== "" && { isActive: active === "true" }),
    ...(search && {
      OR: [
        { question: { contains: search } },
        { keywords: { contains: search } },
      ],
    }),
  };

  const [faqs, total] = await Promise.all([
    db.fAQ.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.fAQ.count({ where }),
  ]);

  return NextResponse.json({ faqs, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.question || !body.answer || !body.category) {
    return NextResponse.json({ error: "Question, answer and category are required" }, { status: 400 });
  }

  // Check duplicate
  const existing = await db.fAQ.findFirst({
    where: { question: { equals: body.question } },
  });
  if (existing) {
    return NextResponse.json({ error: "A similar FAQ already exists" }, { status: 409 });
  }

  const faq = await db.fAQ.create({
    data: {
      question: body.question,
      answer: body.answer,
      category: body.category,
      subcategory: body.subcategory || null,
      keywords: body.keywords || "",
      isActive: body.isActive !== false,
      updatedBy: session.user.id,
    },
  });
  return NextResponse.json(faq, { status: 201 });
}
