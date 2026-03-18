# FutureEngineer Academy — Product Requirements Document
**Version:** 3.0  
**Revenue Target:** $30,000 in 60 days  
**Status:** Active — ready for Claude Code implementation  

---

## Context for Claude Code

You are building the FutureEngineer Academy platform. Read this entire file before writing any code.

**Two repos, two deployments:**
- `futureengineer-frontend` — React + Vite SPA → hosted on Cloudflare Pages
- `futureengineer-backend` — Node.js API (Vercel Serverless Functions) → already deployed on Vercel

**Existing backend files (DO NOT REWRITE — call them as API endpoints):**
- `/api/_utils.js` — shared helpers
- `/api/generate-questions.js` — returns 5 personalised assessment questions
- `/api/score-answers.js` — scores answers, maps to tier
- `/api/generate-report.js` — Maya agent generates creator profile
- `/api/generate-portfolio.js` — Atlas generates portfolio entry
- `/api/create-checkout.js` — used for Creator Pro subscription only (NOT assessment)
- `/api/verify-payment.js` — used for subscription verification only (NOT assessment)
- `/api/webhook.js` — handles Stripe webhooks for subscriptions

**All frontend API calls go to:** `process.env.VITE_API_BASE_URL` (the Vercel backend URL)

---

## The Mission

A global learning platform where kids aged 8–18 build real digital products using AI.  
Parents see measurable growth. The platform scales to 10,000+ students worldwide.

**North star:** Kids create once → AI amplifies → Parents see growth → Platform scales globally

---

## The Fourth Age Narrative

Embed this in every page, email, and piece of copy:

- **Radio** democratized voice
- **Television** democratized visual storytelling  
- **Computers** democratized creation
- **AI democratizes intelligence** — this is the age your child grows up in

---

## The Five AI Agents

| Agent | Role | Creates | Tone |
|-------|------|---------|------|
| Larry | Marketing Director | Campaigns, landing copy, emails, social scripts, ads | Confident, creative, data-driven |
| Maya | Curriculum Architect | Lessons, projects, learning paths, challenge briefs | Warm, encouraging, detailed |
| Atlas | Engineering Lead | Code, scaffolds, APIs, reviews, debugging help | Precise, pragmatic, mentoring |
| Nova | Community Manager | Challenge briefs, community posts, event copy | Energetic, inclusive, hype |
| Echo | Parent Success Agent | Progress reports, welcome emails, parent Q&A | Warm, clear, reassuring |

### Agent Collaboration Patterns

**PUBLISH_FLOW** — fires when student publishes a project:
1. Atlas reviews code quality + generates documentation
2. Nova creates community feed post
3. Echo notifies parent with milestone message
4. Maya logs progress + unlocks next lesson

**NEW_CHALLENGE** — fires when Nova creates a weekly challenge:
1. Maya validates curriculum alignment
2. Larry writes public announcement copy
3. Atlas scaffolds starter template for participants

**WEEKLY_DIGEST** — fires every Sunday 08:00 UTC via Vercel Cron:
1. Maya pulls full curriculum progress per kid
2. Nova pulls community highlights
3. Echo synthesises into parent report (under 200 words)
4. Resend delivers report email to parent

---

## Revenue Model — $30,000 in 60 Days

### Assessment Is Now Free (Lead Generation, Not Revenue)
The assessment is free with an email gate before results. Its job is to generate
qualified leads at volume — not to generate direct revenue. Every completed
assessment feeds the email nurture sequence and the upsell to Creator Pro.

**Expected funnel performance (free assessment):**
- 1,000 visitors → 400 start assessment → 200 complete → 200 emails captured
- 200 emails × 15% conversion via nurture = 30 new Creator Pro subscribers
- 30 × $19/mo = $570 MRR from every 1,000 visitors

### Revenue Streams

| Stream | Price | 60-day target | Path to $30k |
|--------|-------|---------------|--------------|
| Creator Pro | $19/mo | 350 subscribers | $6,650 |
| Family Plan | $29/mo | 150 families | $4,350 |
| School License | $499 flat | 15 schools | $7,485 |
| Accelerator Program | $497 one-time | 12 students | $5,964 |
| Group Cohort (8 kids) | $199/mo per family | 3 cohorts × 8 | $4,776 |
| Corporate Sponsorship | $1,000 flat | 2 sponsors | $2,000 |
| **Total** | | | **$31,225** |

### Why Removing $9.99 Increases Revenue
Free assessment → 40% completion rate → 200 leads per 1,000 visitors  
Paid assessment → 3% completion rate → 30 leads per 1,000 visitors  
Free model generates 7.5× more subscribers from the same traffic.  
The $19/mo Creator Pro subscription earns back the lost $9.99 in 16 days.

### Key Insight — School Licenses Are the Fastest Path
A single school demo that converts at $499 equals 26 Creator Pro subscribers.  
Priority: book 20 demos in week 1–2. Convert 15. That alone = $7,485.

### Accelerator Program
- 6-week intensive cohort
- 8 students max per cohort
- Weekly live session with Atlas (AI engineering mentor)
- Students ship a real product by week 6
- Price: $497 per student
- Target: 2 cohorts in 60 days = $5,964

---

## Tech Stack

### Frontend (futureengineer-frontend)
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v3
- **State:** Zustand (global) + React Query (server state)
- **Forms:** React Hook Form + Zod
- **Auth:** Supabase Auth (@supabase/supabase-js)
- **Payments:** Stripe.js
- **Language:** TypeScript (strict)
- **Hosting:** Cloudflare Pages (free tier, global CDN, instant deploys)

### Backend (futureengineer-backend — existing on Vercel)
- **Runtime:** Node.js Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL + RLS)
- **AI:** Anthropic SDK (claude-sonnet-4-20250514)
- **Payments:** Stripe
- **Email:** Resend API
- **Cron:** Vercel Cron Jobs

### Environment Variables — Frontend (.env)
```
VITE_API_BASE_URL=https://futureengineer-backend.vercel.app
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
VITE_APP_URL=https://futureengineracademy.com
```

### Environment Variables — Backend (Vercel dashboard)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
CRON_SECRET=
```

---

## Frontend Folder Structure

```
futureengineer-frontend/
├── public/
├── src/
│   ├── pages/
│   │   ├── public/
│   │   │   ├── LandingPage.tsx       ← Section 1 build priority
│   │   │   ├── AssessPage.tsx        ← Pre-screen (age + interests)
│   │   │   ├── QuestionsPage.tsx     ← 5 AI questions
│   │   │   ├── EmailGatePage.tsx     ← Email capture before results
│   │   │   ├── ResultsPage.tsx       ← Creator profile + upsell
│   │   │   ├── PricingPage.tsx
│   │   │   ├── SchoolsPage.tsx
│   │   │   └── PortfolioPage.tsx     ← Public portfolio [username]
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   └── OnboardingPage.tsx
│   │   ├── kid/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CreatePage.tsx
│   │   │   ├── ProjectPage.tsx       ← Guided build [projectId]
│   │   │   ├── CommunityPage.tsx
│   │   │   └── PortfolioEditPage.tsx
│   │   ├── parent/
│   │   │   ├── ParentDashboard.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   └── admin/
│   │       ├── MarketingPage.tsx     ← Larry agent UI
│   │       └── ModerationPage.tsx
│   ├── components/
│   │   ├── ui/                       ← Button, Card, Input, Badge, Modal
│   │   ├── landing/                  ← Hero, FourthAge, Tiers, HowItWorks
│   │   ├── assess/                   ← QuestionCard, ProgressBar, ResultCard
│   │   ├── dashboard/                ← KidHeader, ActiveProjects, AgentChat
│   │   ├── agents/                   ← AgentSelector, AgentChat, AgentBadge
│   │   └── portfolio/                ← PortfolioCard, ShareButton
│   ├── lib/
│   │   ├── supabase.ts               ← Supabase client
│   │   ├── api.ts                    ← fetch wrappers for backend endpoints
│   │   ├── stripe.ts                 ← Stripe.js helpers
│   │   └── agents/
│   │       ├── larry.ts
│   │       ├── maya.ts
│   │       ├── atlas.ts
│   │       ├── nova.ts
│   │       └── echo.ts
│   ├── store/
│   │   ├── authStore.ts              ← Zustand auth state
│   │   └── assessStore.ts            ← Assessment state: age, interests, answers[], email, tier, report
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx                       ← Router setup
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env
```

---

## Landing Page — Complete Spec (Section by Section)

### Design Direction
- Dark, bold, energetic — not academic, not corporate
- Think: Figma meets YCombinator meets Duolingo energy
- Typography: large display font for headlines, clean sans for body
- Color: deep navy/black background on hero, clean white on content sections
- Mobile first — 60% of traffic will be mobile

### Section 1 — Hero (full viewport height)
- **Headline:** "The tools to build anything. At any age."
- **Sub:** "AI-powered creation platform for kids who make real things — apps, games, AI agents, products that actually work."
- **CTA 1 (primary, large):** "Take the Creator Assessment — $9.99" → /assess
- **CTA 2 (ghost):** "I'm a parent — show me more" → scrolls to #parent-section
- **Background:** Dark with subtle animated grid or particle effect

### Section 2 — The Fourth Age
- Four cards: Radio (1920s) / TV (1950s) / Computers (1980s) / AI (NOW)
- Each card: era name, what it democratized, decade
- AI card highlighted with brand accent border + "Your child's age" label

### Section 3 — Three Tiers
- Spark (8–12) / Maker (12–15) / Creator (15–18)
- Creator card highlighted — this is the primary audience
- Each: age range, what they build, one example project

### Section 4 — How It Works
- Four steps: Create → Publish → Showcase → Evolve
- Each step: number, name, one sentence, agent name badge

### Section 5 — Agent Team
- Five agent cards: Larry / Maya / Atlas / Nova / Echo
- Each: initial avatar, name, role, one-line description

### Section 6 — Parent Trust (id="parent-section")
- Three columns: Safety / Progress / Portfolio
- Safety: COPPA, moderation, no direct messaging
- Progress: Echo weekly reports, skill tracking, visibility
- Portfolio: real public URL, college-ready, actual built things

### Section 7 — Assessment CTA (full-width dark section)
- **Headline:** "Find out what your child should build first."
- **Sub:** "5-minute AI assessment. Personalised creator profile. $9.99 — credited to your first month if you enrol."
- **CTA:** "Start the assessment" → /assess
- **Trust line:** "Instant results · No subscription required · $9.99 credited on enrolment"

### Section 8 — Pricing Teaser
- Three plan cards: Creator Pro $19/mo · Family $29/mo · School from $499
- Link to /pricing for full details

---

## Assessment Flow — Free with Email Gate

### Why Free
- Free → 40% of visitors start → 200 leads per 1,000 visitors
- Paid → 3% of visitors pay → 30 leads per 1,000 visitors
- Free generates 7.5× more leads. More leads = more subscribers = more revenue.

### Step-by-Step

1. `/assess` — Pre-screen: age slider + interest chips (no payment, no friction)
2. `/assess/questions` — Calls `POST ${VITE_API_BASE_URL}/api/generate-questions`
   - 5 AI-personalised questions, one screen at a time, progress bar
   - Answers stored in Zustand assessStore
3. `/assess/email` — **Email gate** before results
   - Headline: "Your Creator Profile is ready"
   - Sub: "Where should we send it? You'll also get your personalised 7-day build plan."
   - Single email input field + "Show my results" button
   - Email stored in assessStore, POST to `/api/schedule-nurture` fires immediately
4. `/assess/results` — Calls score-answers then generate-report
   - Shows full creator profile immediately (no token, no payment)
   - **Left side:** tier badge, headline, 3 project ideas, skills, first step
   - **Right side:** upsell card — "Start building today — $19/mo, cancel anytime"

### Email Gate Design Principles
- Place the gate AFTER all 5 questions, not before
- Person has already invested time — completion rate at this point is ~85%
- They WANT the result — email feels like a fair exchange, not a barrier
- Never use the word "subscribe" — say "send my results" or "show my profile"
- Single field only — just email, no name, no phone

### The Five Questions
1. How old are you? (slider 8–18)
2. What do you want to build? (chips — pick up to 3: Games / Apps / AI tools / Stories / Simulations / SaaS)
3. What is your experience level? (Never coded / Tried a bit / Some experience / Comfortable)
4. What is your biggest goal? (Get a job / Build my idea / Impress colleges / Just curious / Earn money)
5. Describe your dream project in one sentence (text, 10–200 chars)

### Results Page Layout
**Left side (60%):**
- Large tier badge (Spark / Maker / Creator) with color
- Headline: "[Name], you're a [Tier]-tier builder."
- Top 3 project ideas (cards with title + description + time estimate)
- Skills you will earn (tag cloud)
- Your first step (one clear action)

**Right side (40%) — Upsell card:**
- Headline: "Start building today"
- Price: **$19/month**
- Sub: "Access all projects, AI mentor, community challenges, and your portfolio. Cancel anytime."
- CTA button: "Start building now →"
- Below: "Cancel anytime · No commitment · Takes 5 minutes to set up"
- Trust line: "Join 200+ creators already building"

---

## Email Nurture Sequence (7 emails over 14 days)

All emails personalised with: first name, tier, top project idea from assessment.
All copy generated by Larry + Echo agents. Sent via Resend API.
Email captured at the gate before results — already a warm lead when email 1 arrives.

| Day | Subject | Goal |
|-----|---------|------|
| 0 | Your Creator Profile is ready | Deliver full results to inbox — tier, 3 project ideas, skills. Reinforces value already seen. |
| 2 | Atlas mapped your first 3 builds | Show what Atlas generates for their profile. Platform feels real and personal. |
| 4 | A creator your age just shipped their first app | Social proof — same age, same tier, real portfolio link. |
| 7 | Quick question | One line: "What's stopping you?" — invite reply. Surfaces objections. |
| 9 | Your build plan expires in 48 hours | Soft urgency — personalised plan saved for 14 days then archived. |
| 12 | First month free — 48 hours only | "Try Creator Pro free for 30 days, cancel anytime." No credit card friction framing. |
| 14 | Last message from me | Soft close — warm, no pitch, door stays open. |

---

## Social Media Setup (Before Launch)

| Platform | Handle | Audience | Content |
|----------|--------|----------|---------|
| TikTok | @futureengineer | Teens 15–18 | Screen recordings, real builds, raw + authentic |
| Instagram | @futureengineerapp | Teens + parents | Portfolio carousels, before/after stories |
| YouTube | @FutureEngineer | Parents + SEO | 8–12 min videos — "I gave my kid AI coding for 7 days" |
| Facebook Page | FutureEngineer Academy | Parents | Progress stories, Echo highlights, retargeting pixel |
| LinkedIn | FutureEngineer Academy | Schools + corporates | School partnership posts, outcome data |

---

## $30k in 60 Days — Week by Week

| Week | Action | Revenue target |
|------|--------|----------------|
| 1 | Launch TikTok + Instagram. 3 videos. Reddit posts. | $2,000 assessments |
| 2 | Email 50 school IT directors. Book 10 demos. Facebook parent groups. | $2,500 subscriptions |
| 3 | Run school demos — convert 5 licenses. ProductHunt launch. | $5,000 school licenses |
| 4 | YouTube video goes live. Launch accelerator cohort 1 (8 students). | $4,000 accelerator |
| 5 | Corporate outreach — 2 sponsors. Run school demos batch 2. | $5,000 schools + sponsors |
| 6–8 | Referral loop compounds. Cohort 2 accelerator. Nurture emails convert. | $12,000 compounding |

---

## Claude Code Build Sessions

### Session A — Frontend Scaffold
```
Read prd.md. Create a new React + Vite + TypeScript + Tailwind project called 
futureengineer-frontend with the folder structure defined in the PRD.

Run:
npm create vite@latest futureengineer-frontend -- --template react-ts
cd futureengineer-frontend
npm install tailwindcss @tailwindcss/vite react-router-dom @supabase/supabase-js 
  zustand @tanstack/react-query react-hook-form @hookform/resolvers zod 
  lucide-react @stripe/stripe-js

Set up:
- vite.config.ts with Tailwind plugin
- tailwind.config.ts 
- App.tsx with React Router — all routes from PRD structure
- Placeholder pages for every route (just renders the page name)
- .env with all VITE_ variables from PRD (empty values)
- lib/supabase.ts — Supabase client using VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
- lib/api.ts — fetch wrappers for all 8 backend endpoints using VITE_API_BASE_URL
- store/authStore.ts — Zustand store: user, session, isLoading, signIn, signOut
- store/assessStore.ts — Zustand store: age, interests, answers[], tier, report
```

### Session B — Landing Page
```
Read prd.md. Build the complete landing page at src/pages/public/LandingPage.tsx.

Build each section as a separate component in src/components/landing/:
- HeroSection.tsx — dark background, headline, two CTAs, animated grid
- FourthAgeSection.tsx — four cards, AI card highlighted
- TiersSection.tsx — Spark/Maker/Creator, Creator highlighted
- HowItWorksSection.tsx — four steps with agent badges
- AgentTeamSection.tsx — five agent cards with initials avatars
- ParentTrustSection.tsx — three columns, id="parent-section"
- AssessmentCTA.tsx — full-width dark section, $9.99 CTA
- PricingTeaser.tsx — three plan cards

Design: dark navy hero, clean white content sections, bold typography.
Not academic. Not corporate. Energetic and empowering.
The Fourth Age narrative must be felt throughout — not just stated.
All copy from the PRD. Mobile responsive.
```

### Session C — Assessment Funnel (free, email-gated)
```
Read prd.md. Build the free assessment flow with email gate before results.
No payment. No Stripe. Just questions → email capture → results → upsell.

Pages to build:
1. src/pages/public/AssessPage.tsx
   Age slider (8-18) + interest chips. On submit → /assess/questions

2. src/pages/public/QuestionsPage.tsx
   Call lib/api.ts → generateQuestions(age, interests)
   Show 5 questions one at a time. Progress bar 1/5 to 5/5.
   Store each answer in assessStore.
   On completion → redirect to /assess/email

3. src/pages/public/EmailGatePage.tsx (/assess/email)
   Headline: "Your Creator Profile is ready"
   Sub: "Where should we send it? You'll also get your personalised 7-day build plan."
   Single email input + "Show my results" button.
   On submit:
     - Store email in assessStore
     - Call lib/api.ts → scoreAnswers() + generateReport()
     - POST to /api/schedule-nurture with { email, answers, tier, topProjectIdea }
     - Redirect to /assess/results
   NEVER use the word "subscribe" — say "Show my results"

4. src/pages/public/ResultsPage.tsx (/assess/results)
   Read from assessStore.report — no token, no payment check needed.
   Left side (60%): tier badge, personalised headline, 3 project ideas,
     skills tag cloud, single first step.
   Right side (40%): upsell card — Creator Pro $19/mo, cancel anytime.
     CTA: "Start building now →" → Stripe subscription checkout.
   If assessStore is empty (direct URL access) → redirect to /assess.

5. lib/api.ts — add:
   generateQuestions(age, interests) → POST VITE_API_BASE_URL/api/generate-questions
   scoreAnswers(answers) → POST VITE_API_BASE_URL/api/score-answers
   generateReport(scores) → POST VITE_API_BASE_URL/api/generate-report
   scheduleNurture(email, data) → POST VITE_API_BASE_URL/api/schedule-nurture
```

### Session D — Agent Chat System
```
Read prd.md. Build the agent chat system used throughout the platform.

1. src/lib/agents/base.ts
   AgentChat class: constructor(agentId), sendMessage(message, history), 
   streamMessage(message, history) — calls VITE_API_BASE_URL/api/agents/chat
   
2. src/lib/agents/ — larry.ts, maya.ts, atlas.ts, nova.ts, echo.ts
   Each exports a pre-configured AgentChat instance with system prompt preview

3. src/components/agents/AgentChat.tsx
   Full chat panel component. Props: agentId, context, suggestedActions.
   Streaming text display (tokens appear as they arrive).
   Message history. Suggested action chips below input.
   
4. src/components/agents/AgentSelector.tsx
   Row of 5 agent avatar buttons. Click to switch active agent.
   Each shows: initial, name, indicator dot when active.

5. src/components/agents/AgentBadge.tsx
   Small inline badge showing which agent generated a piece of content.
   Used throughout the platform wherever agent output appears.
```

### Session E — Kid Dashboard
```
Read prd.md. Build the complete kid dashboard.

src/pages/kid/DashboardPage.tsx — assembles these components:

src/components/dashboard/CreatorHeader.tsx
  - Avatar, handle, tier badge, streak counter
  - "Start building" CTA → /create
  - Tagline: "You don't just use the future. You build it."

src/components/dashboard/ActiveProjects.tsx
  - Cards for in-progress projects from Supabase
  - Each: title, current step, % complete, last active, Continue button
  - Empty state: Atlas speaks — "Tell me what you want to build."

src/components/dashboard/Achievements.tsx
  - Skills earned, projects published, challenge entries, portfolio views

src/components/dashboard/AgentMentorWidget.tsx
  - Collapsed chat bubble, opens to full AgentChat panel
  - Auto-routes to correct agent based on message content
  - Persists conversation history in localStorage

src/components/dashboard/CommunityPulse.tsx
  - Active challenge card with countdown timer
  - Recent community feed entries (approved only)
  - Join challenge CTA
```

### Session F — Parent Dashboard  
```
Read prd.md. Build the parent dashboard.

src/pages/parent/ParentDashboard.tsx assembles:

src/components/dashboard/ParentHeader.tsx
  - Child name, tier, last active, quick stats

src/components/dashboard/WeeklyReport.tsx
  - Echo-generated report card
  - Sections: highlights, progress, next steps, parent actions
  - "Send to email" button → POST /api/agents/echo/weekly-report

src/components/dashboard/ProjectTimeline.tsx
  - Chronological project cards
  - Filter: all / in-progress / published / this week

src/components/dashboard/SkillsMap.tsx
  - Grid of earned skills grouped by category
  - Engineering / Design / AI / Product / Business

src/components/dashboard/EchoChat.tsx
  - Chat with Echo agent
  - Echo has full child progress context
  - Suggested: "Explain this week", "What next?", "How do I help at home?"
```

---

## Cloudflare Pages Deployment

### Why Cloudflare Pages
- Free forever for static/SPA hosting
- Global CDN — faster than Vercel for static assets
- Instant deploys from GitHub
- Free custom domain with SSL
- Unlimited bandwidth on free tier

### Setup Steps (after frontend is built)
1. Push futureengineer-frontend to GitHub
2. Go to dash.cloudflare.com → Pages → Create a project
3. Connect GitHub repo
4. Build settings: `npm run build` / output: `dist`
5. Add all VITE_ environment variables
6. Click Deploy
7. Add custom domain in Pages → Custom domains

---

## Design System

### Colors
```
--navy: #1a1a2e
--teal: #0f6e56  
--amber: #ba7517
--white: #ffffff
--off-white: #f8f8f5
--gray-100: #f1f1ee
--gray-400: #888780
--gray-900: #1a1a18
```

### Typography
- Display: use a bold, distinctive font (Syne, Space Grotesk, or Clash Display from CDN)
- Body: system-ui or Inter for readability
- Mono: JetBrains Mono for code blocks

### Tailwind Custom Config
```js
theme: {
  extend: {
    colors: {
      navy: '#1a1a2e',
      teal: { DEFAULT: '#0f6e56', light: '#1d9e75' },
      amber: { DEFAULT: '#ba7517', light: '#ef9f27' }
    },
    fontFamily: {
      display: ['Syne', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    }
  }
}
```

---

## Child Safety (Non-Negotiable)

- COPPA compliant — under 13 requires verifiable parental consent
- No direct kid-to-kid messaging without parent opt-in
- All kid content moderated before going public
- No third-party tracking pixels on kid-facing routes
- Parent notified: account creation / first publish / weekly digest
- Content moderation via Anthropic API before any content publishes

---

## Success Metrics — $30k in 60 Days

| Metric | Target | Measured by |
|--------|--------|-------------|
| Assessment sales | 500 | Stripe payments |
| Assessment → enrol rate | 15% | Supabase subscriptions |
| Creator Pro subscribers | 200 | Stripe |
| Family plan subscribers | 100 | Stripe |
| School licenses | 15 at $499 | Stripe + CRM |
| Accelerator students | 16 (2 cohorts) | Manual |
| Corporate sponsors | 2 at $1,000 | Manual |
| Email open rate | 40%+ | Resend dashboard |
| Email → conversion | 8%+ | Stripe |
| **Total revenue** | **$30,000+** | Stripe dashboard |
