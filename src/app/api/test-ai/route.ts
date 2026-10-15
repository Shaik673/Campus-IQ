import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const apiKey = body.apiKey || process.env.GROK_API_KEY;
    const apiUrl = process.env.GROK_API_URL || "https://api.groq.com/openai/v1";

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "No API key configured in .env or request" },
        { status: 400 }
      );
    }

    // Determine model
    let model = process.env.GROK_MODEL;
    if (!model) {
      if (apiUrl.includes("groq.com") || apiKey.startsWith("gsk_")) {
        model = "openai/gpt-oss-120b";
      } else {
        model = "grok-beta";
      }
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a test ping responder. Output exactly 'OK'." },
          { role: "user", content: "ping" },
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          status: response.status,
          error: `Provider returned HTTP ${response.status}: ${errorText.slice(0, 200)}`,
        },
        { status: 400 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "OK";

    return NextResponse.json({
      success: true,
      provider: apiUrl.includes("groq.com") ? "Groq Cloud" : "xAI Grok",
      model,
      latencyMs,
      reply: reply.trim(),
      message: `Successfully connected to ${apiUrl.includes("groq.com") ? "Groq" : "Grok"} (${model}) in ${latencyMs}ms.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to reach AI endpoint" },
      { status: 500 }
    );
  }
}
