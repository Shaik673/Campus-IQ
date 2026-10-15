import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json([]);

  const attempts = await db.quizAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json(attempts);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { category, count = 5 } = body;

  // Fetch FAQs for this category or general
  const faqs = await db.fAQ.findMany({
    where: { isActive: true, ...(category && { category }) },
    orderBy: { viewCount: "desc" },
    take: Math.min(count * 3, 30),
  });

  if (faqs.length < 2) {
    // Fallback to all active FAQs if category has few
    const allFaqs = await db.fAQ.findMany({
      where: { isActive: true },
      take: 20,
    });
    if (allFaqs.length < 2) {
      return NextResponse.json({ error: "Not enough FAQs to generate quiz" }, { status: 400 });
    }
  }

  const pool = faqs.length >= 2 ? faqs : await db.fAQ.findMany({ where: { isActive: true }, take: 20 });

  // Generate questions from FAQs
  const selected = pool.sort(() => Math.random() - 0.5).slice(0, count);
  const questions = selected.map((faq) => {
    // Generate wrong answers from other FAQs
    const otherFaqs = pool.filter((f) => f.id !== faq.id);
    const wrongAnswers = otherFaqs
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((f) => f.answer.slice(0, 80) + "...");

    const correctAnswer = faq.answer.slice(0, 80) + (faq.answer.length > 80 ? "..." : "");
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      id: faq.id,
      question: faq.question,
      options,
      correctAnswer,
      explanation: faq.answer.slice(0, 200),
      faqId: faq.id,
    };
  });

  return NextResponse.json({ questions, category: category || "general" });
}
