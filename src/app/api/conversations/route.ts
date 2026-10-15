import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    // For guest visitors, return recent public or guest demo conversations
    const [conversations, total] = await Promise.all([
      db.conversation.findMany({
        where: { userId: null, isArchived: false },
        orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
        take: 20,
        include: {
          _count: { select: { messages: true } },
          messages: { take: 1, orderBy: { createdAt: "desc" }, where: { role: "USER" } },
        },
      }),
      db.conversation.count({ where: { userId: null, isArchived: false } }),
    ]);
    return NextResponse.json({ conversations, total, page: 1, limit: 20 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const archived = searchParams.get("archived") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const where = {
    userId,
    isArchived: archived,
    ...(search && {
      OR: [
        { title: { contains: search } },
        { messages: { some: { content: { contains: search } } } },
      ],
    }),
  };

  const [conversations, total] = await Promise.all([
    db.conversation.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        _count: { select: { messages: true } },
        messages: { take: 1, orderBy: { createdAt: "desc" }, where: { role: "USER" } },
      },
    }),
    db.conversation.count({ where }),
  ]);

  return NextResponse.json({ conversations, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const body = await req.json();
  const conversation = await db.conversation.create({
    data: {
      userId,
      title: body.title || "New Conversation",
      category: body.category || null,
    },
  });
  return NextResponse.json(conversation, { status: 201 });
}
