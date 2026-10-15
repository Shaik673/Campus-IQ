import type { FAQ } from "@/types";

// TF-IDF based search engine for FAQ retrieval
export class SearchEngine {
  private faqs: FAQ[] = [];
  private tfidf: Map<string, Map<string, number>> = new Map();
  private idf: Map<string, number> = new Map();

  constructor(faqs: FAQ[]) {
    this.faqs = faqs.filter((f) => f.isActive);
    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 2 && !STOPWORDS.has(t));
  }

  private buildIndex() {
    const docFreq: Map<string, number> = new Map();

    // Build TF for each FAQ
    for (const faq of this.faqs) {
      const text = `${faq.question} ${faq.answer} ${faq.keywords} ${faq.category}`;
      const tokens = this.tokenize(text);
      const tf = new Map<string, number>();

      for (const token of tokens) {
        tf.set(token, (tf.get(token) || 0) + 1);
      }

      // Normalize TF
      const maxFreq = Math.max(...tf.values());
      for (const [token, freq] of tf) {
        tf.set(token, freq / maxFreq);
      }

      this.tfidf.set(faq.id, tf);

      // Track document frequency
      for (const token of new Set(tokens)) {
        docFreq.set(token, (docFreq.get(token) || 0) + 1);
      }
    }

    // Build IDF
    const N = this.faqs.length;
    for (const [token, df] of docFreq) {
      this.idf.set(token, Math.log((N + 1) / (df + 1)) + 1);
    }
  }

  search(
    query: string,
    topK = 5,
    category?: string
  ): { faq: FAQ; score: number }[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const scores: { faq: FAQ; score: number }[] = [];

    for (const faq of this.faqs) {
      if (category && faq.category !== category) continue;

      const tf = this.tfidf.get(faq.id);
      if (!tf) continue;

      let score = 0;
      for (const token of queryTokens) {
        const tfVal = tf.get(token) || 0;
        const idfVal = this.idf.get(token) || 0;
        score += tfVal * idfVal;
      }

      // Boost exact question match
      if (
        faq.question.toLowerCase().includes(query.toLowerCase().slice(0, 20))
      ) {
        score *= 1.5;
      }

      // Boost keyword match
      const keywords = faq.keywords.toLowerCase();
      for (const token of queryTokens) {
        if (keywords.includes(token)) score *= 1.2;
      }

      if (score > 0) {
        scores.push({ faq, score });
      }
    }

    return scores.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  getByCategory(category: string): FAQ[] {
    return this.faqs.filter((f) => f.category === category);
  }

  getRelated(faqId: string, topK = 3): FAQ[] {
    const faq = this.faqs.find((f) => f.id === faqId);
    if (!faq) return [];

    const results = this.search(faq.question, topK + 1);
    return results
      .filter((r) => r.faq.id !== faqId)
      .slice(0, topK)
      .map((r) => r.faq);
  }

  update(faqs: FAQ[]) {
    this.faqs = faqs.filter((f) => f.isActive);
    this.tfidf.clear();
    this.idf.clear();
    this.buildIndex();
  }
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "it", "in", "on", "at", "to", "for", "of",
  "and", "or", "but", "with", "by", "from", "this", "that", "are", "was",
  "be", "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "could", "should", "may", "might", "shall", "can", "cannot",
  "i", "we", "you", "he", "she", "they", "what", "how", "when", "where",
  "which", "who", "whom", "about", "more", "also", "any", "all", "not",
  "no", "yes", "so", "as", "if", "than", "then", "there", "here",
]);

// Confidence thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.6,
  MEDIUM: 0.3,
  LOW: 0,
};

export function getAnswerMode(
  score: number
): "VERIFIED_FAQ" | "AI_ASSISTED" | "UNAVAILABLE" {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return "VERIFIED_FAQ";
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) return "AI_ASSISTED";
  return "UNAVAILABLE";
}

export function normalizeScore(score: number, maxPossible = 5): number {
  return Math.min(1, score / maxPossible);
}
