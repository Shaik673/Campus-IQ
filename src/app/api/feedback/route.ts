import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  if (!body.type || !["HELPFUL", "UNHELPFUL", "REPORT"].includes(body.type)) {
    return NextResponse.json({ error: "Invalid feedback type" }, { status: 400 });
  }

  const feedback = await db.feedback.create({
    data: {
      userId: session?.user?.id || null,
      messageId: body.messageId || null,
      faqId: body.faqId || null,
      type: body.type,
      rating: body.rating || null,
      comment: body.comment?.slice(0, 500) || null,
      reportReason: body.reportReason || null,
    },
  });

  // Update FAQ helpful/unhelpful counts
  if (body.faqId) {
    if (body.type === "HELPFUL") {
      await db.fAQ.update({ where: { id: body.faqId }, data: { helpfulCount: { increment: 1 } } });
    } else if (body.type === "UNHELPFUL") {
      await db.fAQ.update({ where: { id: body.faqId }, data: { unhelpfulCount: { increment: 1 } } });
    }
  }

  if (session?.user?.id) {
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "FEEDBACK_SUBMITTED",
        description: `Submitted ${body.type.toLowerCase()} feedback`,
      },
    }).catch(() => {});
  }

  return NextResponse.json(feedback, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const feedback = await db.feedback.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(feedback);
}
