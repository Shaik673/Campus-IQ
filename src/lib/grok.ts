import type { FAQ } from "@/types";

interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GrokResponse {
  id: string;
  choices: {
    message: { role: string; content: string; reasoning?: string };
    finish_reason: string;
  }[];
  usage?: { prompt_tokens: number; completion_tokens: number };
}

const SYSTEM_PROMPT = `You are CampusIQ Assistant, an intelligent, full-featured AI college enquiry and academic guidance assistant.
Your goal is to provide exceptional, accurate, friendly, and well-structured answers to students, parents, applicants, and visitors.

GUIDELINES FOR ANSWERING:
1. INSTITUTIONAL COLLEGE FACTS:
   - When verified knowledge base entries are provided below, prioritize them as the official ground truth for campus policies, dates, fees, programs, and procedures.
   - For specific institutional details (e.g. exact fee figures, official admission deadlines, specific course cutoffs, or campus rules) NOT found in the verified entries, do NOT invent fictional numbers or policies. Transparently inform the user that this specific institutional record is not in the verified campus database and provide guidance to contact the respective office (e.g., Admissions Desk, Registrar, Student Accounts, or Placement Cell).

2. GENERAL ACADEMIC, TECHNICAL & STUDENT LIFE QUESTIONS (OUT-OF-DATASET QUERIES):
   - When users ask questions beyond the specific college database—such as technical concepts (e.g., Data Structures, AI, Machine Learning, Web Development), career advice, software interview preparation, study strategies, exam tips, campus life guidance, or project ideas—provide comprehensive, insightful, and beautifully structured responses.
   - Do NOT refuse to answer general educational, career, or skill-related questions. Answer them thoroughly and helpfully!

3. PRESENTATION & STRICT FORMATTING RULES:
   - STRICTLY PROHIBIT RAW HTML TAGS: Never output <br>, <p>, <b>, <strong>, <span>, <div>, or <li> tags under any circumstances.
   - Paragraph Spacing: Use clean double newlines for paragraph breaks (never <br>).
   - Highlighting Key Information: Use prominent bold markdown (**Key Terms**, **Important Numbers**, **Deadlines**) to highlight critical concepts so they stand out clearly.
   - Lists: Use standard bullet lists (- Item) for features and considerations, or ordinal numbered lists (1. Step one, 2. Step two) for sequential guides.
   - Tabular Data: Use standard markdown tables (| Column 1 | Column 2 |) for comparisons.
   - Keep answers professional, encouraging, and easy to scan.
   - Conclude with 2-3 relevant follow-up questions or suggestions to keep the conversation engaging.`;

export function formatAiResponse(content: string): string {
  if (!content) return "";
  return content
    // Convert <br>, <br/>, <br > to double newlines
    .replace(/<br\s*\/?>/gi, "\n\n")
    // Convert <b> and <strong> to markdown bold **...**
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    // Convert <i> and <em> to markdown italic *...*
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    // Convert <li>...</li> to markdown bullet item
    .replace(/<li>\s*(.*?)\s*<\/li>/gi, "- $1\n")
    // Convert <p>...</p> to paragraphs
    .replace(/<p>\s*(.*?)\s*<\/p>/gi, "$1\n\n")
    // Strip other unwanted HTML tags like <span>, <div>, <ul>, <ol>, etc.
    .replace(/<\/?(div|span|ul|ol|p|header|footer|section|article)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    // Normalize newlines
    .replace(/\r\n/g, "\n")
    // Replace 3+ consecutive newlines with 2
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function getGrokResponse(
  userMessage: string,
  history: GrokMessage[],
  relevantFAQs: FAQ[],
  customApiKey?: string
): Promise<{ response: string; success: boolean; modelUsed?: string; error?: string }> {
  const apiKey = customApiKey || process.env.GROK_API_KEY;
  const apiUrl = process.env.GROK_API_URL || "https://api.groq.com/openai/v1";

  if (!apiKey) {
    return { response: "", success: false, error: "No API key configured" };
  }

  // Determine candidate models based on endpoint/key
  const isGroq = apiUrl.includes("groq.com") || apiKey.startsWith("gsk_");
  const configuredModel = process.env.GROK_MODEL;

  const candidateModels: string[] = configuredModel
    ? [configuredModel, ...(isGroq ? ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"] : ["grok-beta"])]
    : isGroq
    ? ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
    : ["grok-beta", "grok-2-latest"];

  // Build context from relevant FAQs if available
  const faqContext =
    relevantFAQs.length > 0
      ? `\n\nVERIFIED CAMPUS KNOWLEDGE BASE ENTRIES:\n${relevantFAQs
          .map(
            (faq, i) =>
              `[${i + 1}] Category: ${faq.category}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`
          )
          .join("\n\n")}`
      : "\n\nNote: No direct match found in the institutional FAQ database. Provide helpful academic/educational guidance while noting that official institutional records should be verified with the relevant campus office.";

  const messages: GrokMessage[] = [
    { role: "system", content: SYSTEM_PROMPT + faqContext },
    ...history.slice(-6), // Keep last 6 messages for context
    { role: "user", content: userMessage },
  ];

  let lastError = "";

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 18000);

      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1500,
          temperature: 0.4,
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        lastError = `HTTP ${response.status} with model ${model}: ${errorText.slice(0, 160)}`;
        console.warn(`CampusIQ AI warning: ${lastError}, trying next model if available...`);
        continue;
      }

      const data = (await response.json()) as GrokResponse;
      const content = data.choices?.[0]?.message?.content;

      if (content && content.trim().length > 0) {
        return { response: formatAiResponse(content), success: true, modelUsed: model };
      }
    } catch (err: any) {
      lastError = err.message || "Request failed";
      console.warn(`CampusIQ AI model ${model} error:`, lastError);
    }
  }

  return { response: "", success: false, error: lastError || "All AI models failed to respond" };
}

export function buildLocalResponse(
  query: string,
  faqs: { faq: FAQ; score: number }[]
): string {
  if (faqs.length === 0) {
    return `### Institutional Knowledge Base Search Result

I wasn't able to find a verified record matching your query in the institutional database.

#### Recommended Next Steps:
- **Rephrase your question**: Try using common keywords such as *admissions, tuition fee, hostel, placements, or scholarships*.
- **Explore Categories**: Visit the **Explore FAQs** section to browse through our 14 organized campus categories.
- **Contact University Office**: Reach out to the **Office of Admissions** at \`+91 1800-123-CAMPUS\` or \`admissions@campusiq.edu\`.

You can also browse our **Courses & Programs**, **Fees & Scholarships**, or **Campus Facilities** sections for comprehensive guides.`;
  }

  const top = faqs[0];
  const related = faqs.slice(1, 3);

  let response = `## ${top.faq.question}\n\n${top.faq.answer}`;

  if (related.length > 0) {
    response += "\n\n---\n\n### Related Information\n";
    for (const r of related) {
      response += `\n- **${r.faq.question}**\n  ${r.faq.answer.slice(0, 160)}...\n`;
    }
  }

  return response;
}

export function generateFollowUps(
  query: string,
  faqs: FAQ[],
  category?: string
): string[] {
  const qLower = query.toLowerCase();

  // Dynamic intent-based suggestions for out-of-dataset or general questions
  if (qLower.includes("interview") || qLower.includes("placement") || qLower.includes("career") || qLower.includes("job")) {
    return [
      "What companies visit the campus for placements?",
      "What is the average and highest placement package?",
      "What coding bootcamps and placement training are provided?",
    ];
  }

  if (qLower.includes("internship") || qLower.includes("project") || qLower.includes("research")) {
    return [
      "Are summer internships supported by the college?",
      "What research facilities and supercomputing labs are available?",
      "How can undergraduate students participate in research?",
    ];
  }

  if (qLower.includes("prepare") || qLower.includes("study") || qLower.includes("exam") || qLower.includes("tips")) {
    return [
      "What are the academic examination rules and grading policies?",
      "What is the minimum attendance requirement for semester exams?",
      "Where is the Central Library located and what are its hours?",
    ];
  }

  if (qLower.includes("fee") || qLower.includes("cost") || qLower.includes("scholarship")) {
    return [
      "What merit scholarships are available for high percentiles?",
      "Can tuition fees be paid in semester installments?",
      "What are the hostel and mess charges per annum?",
    ];
  }

  if (qLower.includes("admission") || qLower.includes("eligibility") || qLower.includes("cutoff")) {
    return [
      "What entrance exams and minimum percentiles are required?",
      "What is the 5-step admission process timeline?",
      "What original documents must be carried for physical verification?",
    ];
  }

  const followUps: Record<string, string[]> = {
    admissions: [
      "What documents are required for admission?",
      "What is the admission process timeline?",
      "Are there any entrance exams required?",
    ],
    fees: [
      "Are there any scholarships available?",
      "What are the payment methods accepted?",
      "Can fees be paid in installments?",
    ],
    courses: [
      "What are the eligibility requirements?",
      "What is the duration of the program?",
      "What are the career prospects after this course?",
    ],
    scholarships: [
      "What is the application process for scholarships?",
      "What are the eligibility criteria?",
      "When is the scholarship deadline?",
    ],
    hostel: [
      "What are the hostel fees?",
      "What facilities are available in the hostel?",
      "How do I apply for hostel accommodation?",
    ],
    placements: [
      "What companies visit for campus recruitment?",
      "What is the average placement package?",
      "What support is available for placement preparation?",
    ],
    default: [
      "What courses and degree programs are offered?",
      "What are the eligibility criteria and cutoffs?",
      "How can I contact the college admissions department?",
    ],
  };

  const cat = category || "default";
  return (followUps[cat] || followUps.default).slice(0, 3);
}
