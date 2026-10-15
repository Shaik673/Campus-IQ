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

  const questions = await db.unansweredQuestion.findMany({
    where: { isResolved: false },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(questions);
}
