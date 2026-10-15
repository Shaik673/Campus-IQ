import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;

  const body = await req.json();
  const { questions, answers, category } = body;

  let score = 0;
  for (const q of (questions || [])) {
    if (answers && answers[q.id] === q.correctAnswer) score++;
  }

  if (userId) {
    const attempt = await db.quizAttempt.create({
      data: {
        userId,
        category: category || "general",
        questions: JSON.stringify(questions),
        answers: JSON.stringify(answers || {}),
        score,
        total: (questions || []).length,
      },
    });

    await db.activity.create({
      data: {
        userId,
        type: "QUIZ_COMPLETED",
        description: `Completed quiz on ${category || "general"}: ${score}/${(questions || []).length}`,
      },
    }).catch(() => {});

    return NextResponse.json({ attemptId: attempt.id, score, total: (questions || []).length });
  }

  // Guest response
  return NextResponse.json({ attemptId: "guest-" + Date.now(), score, total: (questions || []).length });
}
