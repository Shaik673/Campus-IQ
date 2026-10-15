import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SearchEngine, normalizeScore, getAnswerMode } from "@/lib/search-engine";
import { getGrokResponse, buildLocalResponse, generateFollowUps } from "@/lib/grok";
import { sanitizeInput } from "@/lib/utils";

let searchEngine: SearchEngine | null = null;
let lastIndexBuild = 0;

async function getSearchEngine() {
  const now = Date.now();
  // Rebuild index every 5 minutes
  if (!searchEngine || now - lastIndexBuild > 300000) {
    const faqs = await db.fAQ.findMany({ where: { isActive: true } });
    searchEngine = new SearchEngine(faqs as never);
    lastIndexBuild = now;
  }
  return searchEngine;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();

    const message = sanitizeInput(body.message || "");
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    const conversationId: string | undefined = body.conversationId;
    const history: { role: string; content: string }[] = body.history || [];

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await db.conversation.findFirst({
        where: {
          id: conversationId,
          userId: session?.user?.id ?? null,
        },
      });
    }

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId: session?.user?.id ?? null,
          title: message.slice(0, 60) + (message.length > 60 ? "..." : ""),
          category: body.category || null,
        },
      });
    }

    // Save user message
    const userMsg = await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "USER",
        content: message,
      },
    });

    // Search knowledge base
    const engine = await getSearchEngine();
    const results = engine.search(message, 5);
    const topScore = results[0]?.score ?? 0;
    const normalizedScore = normalizeScore(topScore);
    let answerMode = getAnswerMode(normalizedScore);

    const clientApiKey = body.apiKey || undefined;
    const hasAiKey = Boolean(process.env.GROK_API_KEY || clientApiKey);

    let responseContent = "";
    // Only attach sources if there is an authentic relevant match
    let sources = normalizedScore >= 0.28 ? results.slice(0, 3).map((r) => r.faq.id) : [];

    if (answerMode === "UNAVAILABLE") {
      // Try Groq / Grok LLM for out-of-dataset or general questions
      if (hasAiKey) {
        const grokResult = await getGrokResponse(
          message,
          history as { role: "user" | "assistant" | "system"; content: string }[],
          normalizedScore >= 0.2 ? results.slice(0, 3).map((r) => r.faq) : [],
          clientApiKey
        );
        if (grokResult.success) {
          responseContent = grokResult.response;
          answerMode = "AI_ASSISTED";
        } else {
          responseContent = buildLocalResponse(message, []);
        }
      } else {
        responseContent = buildLocalResponse(message, []);
      }
    } else if (answerMode === "AI_ASSISTED" && hasAiKey) {
      const grokResult = await getGrokResponse(
        message,
        history as { role: "user" | "assistant" | "system"; content: string }[],
        results.slice(0, 5).map((r) => r.faq),
        clientApiKey
      );
      if (grokResult.success) {
        responseContent = grokResult.response;
      } else {
        responseContent = buildLocalResponse(message, results);
      }
    } else {
      // High confidence - use local result, optionally enhance with Grok
      if (hasAiKey) {
        const grokResult = await getGrokResponse(
          message,
          history as { role: "user" | "assistant" | "system"; content: string }[],
          results.slice(0, 3).map((r) => r.faq),
          clientApiKey
        );
        responseContent = grokResult.success
          ? grokResult.response
          : buildLocalResponse(message, results);
      } else {
        responseContent = buildLocalResponse(message, results);
      }
    }

    // Generate follow-up suggestions
    const topCategory = results[0]?.faq.category;
    const followUps = generateFollowUps(message, results.map((r) => r.faq), topCategory);

    // Save assistant message
    const assistantMsg = await db.message.create({
      data: {
        conversationId: conversation.id,
        role: "ASSISTANT",
        content: responseContent,
        sources: JSON.stringify(sources),
        confidence: normalizedScore,
        answerMode,
      },
    });

    // Update conversation timestamp and category
    await db.conversation.update({
      where: { id: conversation.id },
      data: {
        updatedAt: new Date(),
        category: conversation.category || topCategory || null,
      },
    });

    // Increment FAQ view counts if relevant
    if (sources.length > 0) {
      await db.fAQ.updateMany({
        where: { id: { in: sources } },
        data: { viewCount: { increment: 1 } },
      });
    }

    // Log activity
    if (session?.user?.id) {
      await db.activity.create({
        data: {
          userId: session.user.id,
          type: "ENQUIRY",
          description: `Asked: ${message.slice(0, 80)}`,
          metadata: JSON.stringify({ conversationId: conversation.id, category: topCategory }),
        },
      }).catch(() => {});
    }

    // Track unanswered questions ONLY if still UNAVAILABLE
    if (answerMode === "UNAVAILABLE") {
      await db.unansweredQuestion.create({
        data: {
          question: message,
          userId: session?.user?.id ?? null,
          sessionId: conversation.id,
          category: topCategory || null,
        },
      }).catch(() => {});
    }

    const sourceFaqs =
      sources.length > 0
        ? results
            .filter((r) => sources.includes(r.faq.id))
            .map((r) => ({
              id: r.faq.id,
              question: r.faq.question,
              category: r.faq.category,
            }))
        : [];

    return NextResponse.json({
      response: responseContent,
      conversationId: conversation.id,
      messageId: assistantMsg.id,
      sources: sourceFaqs,
      confidence: normalizedScore,
      answerMode,
      suggestedFollowUps: followUps,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}
