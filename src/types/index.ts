export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role: UserRole;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId?: string | null;
  title: string;
  category?: string | null;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: Message[];
  _count?: { messages: number };
}

export interface Message {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  sources?: string[] | null;
  confidence?: number | null;
  answerMode?: "VERIFIED_FAQ" | "AI_ASSISTED" | "UNAVAILABLE" | null;
  helpful?: boolean | null;
  createdAt: Date;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string | null;
  keywords: string;
  isActive: boolean;
  viewCount: number;
  helpfulCount: number;
  unhelpfulCount: number;
  lastUpdated: Date;
  updatedBy?: string | null;
  createdAt: Date;
}

export interface SavedAnswer {
  id: string;
  userId: string;
  faqId?: string | null;
  messageId?: string | null;
  title: string;
  content: string;
  category?: string | null;
  collection?: string | null;
  notes?: string | null;
  createdAt: Date;
  faq?: FAQ | null;
}

export interface Feedback {
  id: string;
  userId?: string | null;
  messageId?: string | null;
  faqId?: string | null;
  type: "HELPFUL" | "UNHELPFUL" | "REPORT";
  rating?: number | null;
  comment?: string | null;
  reportReason?: string | null;
  isReviewed: boolean;
  createdAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  category: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  score: number;
  total: number;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  faqId?: string;
}

export type FAQCategory =
  | "admissions"
  | "courses"
  | "eligibility"
  | "fees"
  | "scholarships"
  | "hostel"
  | "transportation"
  | "library"
  | "campus"
  | "examinations"
  | "placements"
  | "faculty"
  | "contact"
  | "general";

export const FAQ_CATEGORIES: { id: FAQCategory; label: string; icon: string; color: string }[] = [
  { id: "admissions", label: "Admissions & Applications", icon: "GraduationCap", color: "blue" },
  { id: "courses", label: "Courses & Programs", icon: "BookOpen", color: "violet" },
  { id: "eligibility", label: "Eligibility & Entrance", icon: "ClipboardCheck", color: "cyan" },
  { id: "fees", label: "Fees & Payments", icon: "CreditCard", color: "green" },
  { id: "scholarships", label: "Scholarships & Aid", icon: "Award", color: "yellow" },
  { id: "hostel", label: "Hostel & Accommodation", icon: "Home", color: "orange" },
  { id: "transportation", label: "Transportation", icon: "Bus", color: "red" },
  { id: "library", label: "Library & Labs", icon: "Library", color: "indigo" },
  { id: "campus", label: "Campus Facilities", icon: "Building2", color: "pink" },
  { id: "examinations", label: "Examinations", icon: "FileText", color: "teal" },
  { id: "placements", label: "Placements & Careers", icon: "Briefcase", color: "emerald" },
  { id: "faculty", label: "Faculty & Departments", icon: "Users", color: "purple" },
  { id: "contact", label: "Contact Details", icon: "Phone", color: "sky" },
  { id: "general", label: "General Information", icon: "Info", color: "slate" },
];

export interface DashboardStats {
  totalEnquiries: number;
  answeredEnquiries: number;
  savedAnswers: number;
  conversationsCount: number;
  unansweredCount: number;
  feedbackCount: number;
  avgConfidence: number;
  popularCategories: { category: string; count: number }[];
  enquiryTrend: { date: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  recentActivity: Activity[];
}

export interface SearchResult {
  faq: FAQ;
  score: number;
  matchType: "exact" | "fuzzy" | "semantic";
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  history?: { role: string; content: string }[];
}

export interface ChatResponse {
  response: string;
  conversationId: string;
  messageId: string;
  sources: FAQ[];
  confidence: number;
  answerMode: "VERIFIED_FAQ" | "AI_ASSISTED" | "UNAVAILABLE";
  suggestedFollowUps: string[];
}
