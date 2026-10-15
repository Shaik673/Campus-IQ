import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get("collection") || "";
  const category = searchParams.get("category") || "";

  const saved = await db.savedAnswer.findMany({
    where: {
      userId: session.user.id,
      ...(collection && { collection }),
      ...(category && { category }),
    },
    orderBy: { createdAt: "desc" },
    include: { faq: { select: { id: true, question: true, category: true } } },
  });
  return NextResponse.json(saved);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const saved = await db.savedAnswer.create({
    data: {
      userId: session.user.id,
      faqId: body.faqId || null,
      messageId: body.messageId || null,
      title: body.title || "Saved Answer",
      content: body.content,
      category: body.category || null,
      collection: body.collection || null,
      notes: body.notes || null,
    },
  });

  if (session.user.id) {
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "FAQ_SAVED",
        description: `Saved: ${(body.title || "answer").slice(0, 60)}`,
      },
    }).catch(() => {});
  }

  return NextResponse.json(saved, { status: 201 });
}
