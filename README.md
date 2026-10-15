# CampusIQ — Next-Gen AI Campus Information & Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Groq Cloud](https://img.shields.io/badge/Groq_Cloud-Llama_3_/_GPT--OSS-F55036?style=for-the-badge&logo=fastapi)](https://groq.com/)

**CampusIQ** is a full-stack, AI-powered college enquiry and intelligence system designed to automate student services, admissions counseling, and campus FAQs with sub-second response times, verified institutional knowledge citations, and a protected administrative analytics portal.

---

## 🌟 Key Highlights & Features

### 🤖 1. Hybrid Multi-Turn AI Assistant
- **Dual Inference Engine**: Blends deterministic keyword/semantic matching over verified campus FAQs with ultra-fast LLM fallback synthesis via **Groq Cloud API** (`openai/gpt-oss-120b`).
- **Confidence Scoring & Citations**: Displays dynamic confidence badges with expandable citations back to institutional handbooks.
- **Context Retention**: Maintains conversation memory across multi-turn follow-ups with contextual prompt recommendations.
- **Safety Fallback**: Gracefully diverts unresolved questions to human administrative review.

### 🎓 2. Comprehensive Student Information Hub
- **Explore FAQs**: 100+ verified campus questions organized across 14 interactive category filters (Admissions, Fees, Scholarships, Hostels, Academics, Placements, etc.).
- **Academic Directory**: UG, PG, and Ph.D. program curricula, admission eligibility criteria, cutoff percentiles, and required documentation checklists.
- **Fees & Financial Aid**: Tuition schedules, hostel fee tiers, installment structures, and institutional scholarship schemes.
- **Career & Placements**: Placement trends, top recruiter tiering, highest/median packages, and interview preparation resources.

### 🧰 3. Learning Tools & Interactive Checklists
- **Interactive Checklists**: Multi-step application readiness checklists with persistent browser state and progress rings.
- **Saved Answers Notebook**: Personal bookmarking system with custom collection folders, notes editor, and Markdown export.
- **Campus Directory & Feedback**: Direct contact cards for college departments and interactive 5-star feedback forms.

### 🛡️ 4. Protected Administration Portal
- **Operational Analytics**: Real-time KPI cards tracking enquiry volume, resolution rates, user engagement, and top queried categories.
- **FAQ CRUD Management**: Full lifecycle management of official institutional answers with live toggle switch and CSV export/import.
- **Unanswered Enquiries Queue**: Review triage system with 1-click "Convert to FAQ" workflow.
- **User Management**: Role-based access control distinguishing Students, Staff, and Administrators.

---

## 📸 Screenshots Showcase

All high-resolution system screenshots are cataloged in [`screenshots/`](./screenshots/README.md).

| Feature | Preview |
| :--- | :--- |
| **Authentication & Demo Access** | [View Screenshot](./screenshots/01_Authentication_Login_Page.png) |
| **Personalized KPI Dashboard** | [View Screenshot](./screenshots/02_Personalized_Dashboard_Dark.png) |
| **AI Assistant Workspace** | [View Screenshot](./screenshots/04_AI_Assistant_Workspace.png) |
| **Groq LLM Synthesis** | [View Screenshot](./screenshots/07_AI_Assistant_Groq_LLM_Synthesis.png) |
| **Searchable Knowledge Hub** | [View Screenshot](./screenshots/08_Explore_FAQs_Knowledge_Hub.png) |
| **Interactive Application Checklist** | [View Screenshot](./screenshots/20_Guided_Checklist_Interactive_State.png) |
| **Live Groq Cloud Diagnostics** | [View Screenshot](./screenshots/24_Settings_Groq_Live_Connection_Test.png) |
| **Admin Operations Portal** | [View Screenshot](./screenshots/26_Admin_Portal_Dashboard.png) |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript, React 18 |
| **Styling** | Tailwind CSS, Radix UI Primitives, Lucide Icons, Framer Motion |
| **Database & ORM** | SQLite, Prisma ORM |
| **Authentication** | NextAuth.js v5 (Session JWT, Credentials Provider, Bcrypt) |
| **AI Inference** | Groq Cloud API (`openai/gpt-oss-120b`, ultra-low latency LPU) |
| **Analytics & Data Vis**| Recharts (Interactive Area & Bar Charts) |
| **Automation** | Python (Automated Deck generation `python-pptx`, Report generation `ReportLab`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **npm** or **pnpm**
- **Groq API Key** (Free tier available at [console.groq.com](https://console.groq.com))

### 1. Clone & Install
```bash
git clone https://github.com/Shaik673/Campus-IQ.git
cd Campus-IQ
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your configuration:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Secret (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Groq AI
GROK_API_KEY="gsk_your_groq_api_key_here"
GROK_API_URL="https://api.groq.com/openai/v1"
GROK_MODEL="openai/gpt-oss-120b"
```

### 3. Initialize Database & Seed
```bash
npx prisma db push
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student (Demo User)** | `demo@campusiq.edu` | `demo123` |
| **Administrator** | `admin@campusiq.edu` | `admin123` |

*(Quick 1-click login buttons are also provided directly on the Login page!)*

---

## 📁 Repository Structure

```
Campus-IQ/
├── prisma/
│   ├── schema.prisma       # Database schema (User, FAQ, Conversation, Enquiry, etc.)
│   ├── seed.ts             # Comprehensive 100+ FAQ and demo user dataset
│   └── seed-more.ts        # Extended dataset generator
├── public/                 # Static assets and icons
├── screenshots/            # 30 high-resolution feature screenshots
├── scripts/
│   ├── generate_presentation_pptx.py  # Automated PPTX slide deck generator
│   ├── generate_report_pdf.py         # Automated ReportLab PDF generator
│   └── organize_screenshots.py        # Screenshot organizer script
├── src/
│   ├── app/                # Next.js App Router (Main portal, Auth, Admin, APIs)
│   ├── components/         # Reusable UI components, modals, and charts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Prisma client, auth options, AI engine logic
│   └── types/              # TypeScript interface definitions
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json
└── README.md
```

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).
