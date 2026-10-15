import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { id } = await params;

  const conversation = await db.conversation.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(conversation);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { id } = await params;
  const body = await req.json();

  const conversation = await db.conversation.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
  });

  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.conversation.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.isPinned !== undefined && { isPinned: body.isPinned }),
      ...(body.isArchived !== undefined && { isArchived: body.isArchived }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const { id } = await params;

  const conversation = await db.conversation.findFirst({
    where: {
      id,
      ...(userId ? { userId } : {}),
    },
  });

  if (!conversation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.conversation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
