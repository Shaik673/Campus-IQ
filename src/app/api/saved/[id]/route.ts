import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;
  const body = await req.json();

  const saved = await db.savedAnswer.findFirst({
    where: { id, ...(userId ? { userId } : {}) },
  });
  if (!saved) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await db.savedAnswer.update({
    where: { id },
    data: {
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.collection !== undefined && { collection: body.collection }),
      ...(body.title !== undefined && { title: body.title }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const { id } = await params;

  const saved = await db.savedAnswer.findFirst({
    where: { id, ...(userId ? { userId } : {}) },
  });
  if (!saved) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.savedAnswer.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
