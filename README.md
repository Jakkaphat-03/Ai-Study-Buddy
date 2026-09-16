# AI Study Buddy

AI-powered document learning web application for university students. Upload a
study document, extract its text, and use Google Gemini to generate summaries,
quizzes and answers to follow-up questions.

## Tech stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS + shadcn/ui + Framer Motion
- Supabase (Auth, PostgreSQL, Storage)
- Google Gemini via `@google/genai`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

### Environment variables

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | no | Fallback origin for confirmation emails |
| `GEMINI_API_KEY` | yes | Server-only. Never prefix with `NEXT_PUBLIC_` |
| `GEMINI_MODEL` | no | Defaults to `gemini-flash-latest` |

## Database

Migrations live in `supabase/migrations/` and are applied in filename order.

```bash
supabase db push
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/          routes and API route handlers
├── components/   shared UI, layout and common components
├── features/     feature modules (auth, document, summary, quiz, chat, …)
└── lib/          Supabase clients and shared helpers
```
