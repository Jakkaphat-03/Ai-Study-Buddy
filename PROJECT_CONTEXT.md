# AI Study Buddy — Project Context

> Handoff reference for future development. This document reflects the repository at commit `c6f6989` (`feat: implement authentication system with supabase`).

## 1. Project Overview

AI Study Buddy is a production-style SaaS web application for university students and other learners. It will let users upload study materials and use AI to understand and study them through summaries, document-grounded chat, quizzes, flashcards, and image analysis.

The product goal is a clean, secure, responsive learning workspace that feels like a modern startup product rather than a CRUD application.

### Target users

- University and college students
- Self-learners
- Anyone studying from PDF, DOCX, or PPTX materials

### Product scope

Planned core capabilities:

- Authentication and session management
- Document upload and history
- AI-generated summaries and key concepts
- AI chat about a document
- Quiz generation
- Flashcard generation
- Image, chart, graph, table, and diagram explanation where Gemini Vision supports it

Explicitly out of scope: team collaboration, administration, payments, email notifications, handwritten-document OCR, real-time collaboration, and translation.

## 2. Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15.1.6 with the App Router |
| Language | TypeScript, strict mode |
| UI | React 19, Tailwind CSS 3, shadcn/ui-style local components |
| Animation | Framer Motion |
| Icons | Lucide React |
| Forms and validation | React Hook Form, Zod, `@hookform/resolvers` |
| Backend | Next.js Route Handlers and Server Actions |
| Auth / database / storage | Supabase Auth, PostgreSQL, and Storage |
| Supabase SSR integration | `@supabase/ssr` |
| Planned AI provider | Google Gemini API |
| Intended deployment | Vercel |

Useful commands:

```bash
npm run dev
npm run lint
npm run build
```

The `@/*` TypeScript alias maps to `src/*`. React strict mode is enabled in `next.config.ts`.

## 3. Current Progress

### Completed

- Next.js application foundation, TypeScript, Tailwind, ESLint, and shadcn configuration.
- Responsive dark-theme landing page with animated hero, feature cards, header, footer, and registration CTA.
- Shared visual design system: emerald primary color, cyan focus/accent color, translucent glass cards, reusable buttons, avatars, cards, and separators.
- Auth pages at `/login` and `/register`.
- Supabase email/password registration, sign-in, sign-out, email-confirmation callback, and session refresh middleware.
- Protected dashboard layout and responsive application shell with desktop and mobile navigation.
- Dashboard empty state and non-functional visual placeholders for future study-material statistics/upload.

### Not implemented yet

- Supabase database tables, migrations, RLS policies, generated database types, and Storage bucket configuration.
- Document upload, file validation, document processing, and document viewer.
- Gemini integration and all AI route handlers.
- Summaries, chat, quizzes, flashcards, image analysis, learning history, profile page, and the linked sidebar routes.
- Dashboard data queries and real statistics.

The existing sidebar deliberately contains links for future pages (`/documents`, `/summary`, `/chat`, `/quiz`, `/flashcards`, `/profile`), but only `/dashboard` currently exists. Do not treat those routes as implemented.

### Recent Git history

1. `c6f6989` — implemented Supabase authentication.
2. `22f9f09` — added the application layout and design system.
3. `50c8e91` — created the initial project foundation.

At the time this document was created, the working tree had no uncommitted changes.

## 4. Project Structure

```text
.
├── AGENTS.md                         # Mandatory project rules
├── docs/
│   ├── 01_PRD.md                     # Product requirements
│   ├── 02_ARCHITECTURE.md            # Intended high-level architecture
│   └── 03_DATABASE.md                # Intended logical database design
├── prompts/
│   └── 01_project_setup.md           # Completed foundation task prompt
├── src/
│   ├── app/
│   │   ├── auth/callback/route.ts    # Supabase email-confirmation exchange
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            # Server-side dashboard protection
│   │   │   └── page.tsx              # Dashboard placeholder
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── globals.css               # Global theme tokens
│   │   ├── layout.tsx                # Root layout and metadata
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── common/                   # Logo and motion wrapper
│   │   ├── layout/                   # Public and authenticated layouts
│   │   └── ui/                       # Reusable Button, Card, Avatar, Separator
│   ├── features/
│   │   ├── auth/                     # Complete auth feature
│   │   ├── chat/                     # Reserved; empty placeholder
│   │   ├── dashboard/                # Reserved; empty placeholder
│   │   ├── flashcards/               # Reserved; empty placeholder
│   │   ├── quiz/                     # Reserved; empty placeholder
│   │   ├── summary/                  # Reserved; empty placeholder
│   │   └── upload/                   # Reserved; empty placeholder
│   ├── hooks/                        # Reserved; empty placeholder
│   ├── lib/
│   │   ├── supabase/                 # Browser, server, and middleware clients
│   │   └── utils.ts                  # `cn()` class-name helper
│   ├── services/                     # Reserved; empty placeholder
│   ├── types/                        # Reserved; empty placeholder
│   └── utils/                        # Reserved; empty placeholder
├── src/middleware.ts                 # Invokes Supabase session middleware
├── .env.example                      # Required public Supabase configuration
├── components.json                   # shadcn component configuration
├── tailwind.config.ts
└── package.json
```

Keep feature-specific code under `src/features/<feature>/`; pages should primarily compose feature and shared components. Use Server Components by default and add `"use client"` only for client interactivity.

## 5. Database / API / Backend

### Supabase environment configuration

`.env.example` declares the required public values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` exists locally and is ignored; do not read, expose, or commit its values. The Supabase client helpers throw a clear error if either required Supabase setting is absent.

### Supabase client helpers

| File | Context and responsibility |
| --- | --- |
| `src/lib/supabase/client.ts` | Browser-only client via `createBrowserClient`. |
| `src/lib/supabase/server.ts` | Server Component, Server Action, and Route Handler client via `createServerClient`; reads and writes cookies when allowed. |
| `src/lib/supabase/middleware.ts` | Middleware client; refreshes the session and synchronizes auth cookies on the response. |
| `src/middleware.ts` | Applies session middleware to all application routes except Next static/image assets and common image files. |

Do not recreate Supabase clients ad hoc. Use the helper appropriate to the execution context.

### Completed authentication flow

1. `AuthForm` validates email and password with `authSchema`: valid email and password length of at least eight characters.
2. The form calls the `signIn` or `signUp` Server Action in `src/features/auth/actions/auth-actions.ts` inside a React transition.
3. Registration calls `supabase.auth.signUp` and sets `emailRedirectTo` to `/auth/callback?next=/dashboard`, using the request origin or `NEXT_PUBLIC_SITE_URL` fallback.
4. The user confirms their email; `GET /auth/callback` exchanges the returned code for a Supabase session and safely redirects only to a local path.
5. Sign-in uses `signInWithPassword`; unconfirmed users are immediately signed out and shown an error.
6. Middleware protects `/dashboard` and its descendants; unauthenticated or unconfirmed users go to `/login` with a `next` parameter. Confirmed users visiting `/login` or `/register` are redirected to `/dashboard`.
7. `src/app/dashboard/layout.tsx` performs a second server-side user/confirmation check before rendering the application shell. This defense in depth must remain when adding protected routes.
8. The sidebar sign-out form invokes the `signOut` Server Action, then redirects to `/login`.

### Planned database and storage model

`docs/03_DATABASE.md` is a logical design only; no physical schema has been created. Implement the schema/migrations and RLS before querying these resources.

| Resource | Intended fields / purpose |
| --- | --- |
| `users` | Managed by Supabase Auth; optional additional profile data. |
| `documents` | `id`, `user_id`, `file_name`, `file_type`, `page_count`, `file_url`, `created_at`. |
| `summaries` | `id`, `document_id`, `summary_type`, `content`, `created_at`. |
| `chats` | `id`, `document_id`, `role`, `message`, `created_at`. |
| `quizzes` | `id`, `document_id`, `difficulty`, `content`, `created_at`. |
| `flashcards` | `id`, `document_id`, `question`, `answer`, `created_at`. |
| Storage bucket | `documents`, containing PDF, DOCX, and PPTX uploads. |

Every user must be able to access only their own resources. Enforce this with Supabase Row Level Security based on the authenticated user ID. Since child records are owned through a document, policies must also ensure the referenced document belongs to `auth.uid()`.

### Planned backend shape

Use Next.js Route Handlers for server-only operations such as document processing and Gemini requests. Keep Gemini credentials server-only; never expose them with a `NEXT_PUBLIC_` prefix. Persist generated content through Supabase only after ownership/authorization is verified.

## 6. UI / UX Requirements

- Dark theme is mandatory; the root `<html>` uses the `dark` class.
- Visual language: minimal modern SaaS, glassmorphism, emerald primary, cyan accent, soft shadows, and subtle gradients.
- Responsive behavior is required. The authenticated desktop sidebar is visible from `lg`; smaller screens use the `MobileSidebar` dialog.
- Accessibility conventions already in use include semantic landmarks, labels for icon-only controls, focus rings, status messages, and descriptive `aria` attributes. Preserve and extend them.
- Reuse shared primitives from `src/components/ui` and `cn()` from `src/lib/utils.ts`; do not introduce duplicate styling/business logic.
- Use `MotionReveal` for restrained landing-page entrance animation when appropriate. Do not make routine application views depend on gratuitous animation.
- Keep the empty dashboard state honest until actual document data exists; the current upload button is intentionally disabled.

Theme tokens are defined in `src/app/globals.css` and exposed in `tailwind.config.ts` as semantic colors (`background`, `foreground`, `card`, `primary`, `accent`, and so on).

## 7. Important Code Context

### Routing

- `/` — public landing page.
- `/login` — login UI.
- `/register` — registration UI.
- `/auth/callback` — email confirmation code exchange Route Handler.
- `/dashboard` — protected placeholder dashboard.

When adding a new authenticated page, place it under the dashboard route or add equivalent server-side authorization and update the middleware policy deliberately. The existing sidebar currently points to top-level future routes; decide and implement a consistent protected route layout as part of the relevant future sprint rather than silently leaving broken links.

### Auth feature responsibilities

- `schemas/auth-schema.ts` owns auth input validation and exports `AuthCredentials`.
- `types/auth.ts` defines the compact Server Action result shape.
- `actions/auth-actions.ts` owns all current auth mutations and redirects.
- `components/auth-form.tsx` owns client form state and mutation feedback.
- `components/auth-page.tsx` owns shared auth-page presentation.

The form uses `noValidate` so Zod provides the displayed validation errors. Server Actions must still retain validation, as the current actions do.

### Shared layout details

- `AppShell` receives the authenticated user email from the server dashboard layout and passes it to navigation/header components.
- `AppSidebar` is a Client Component because it uses `usePathname`; it also owns the sign-out form.
- `MobileSidebar` owns drawer open/close state and reuses `AppSidebar`.
- `Logo` currently uses an anchor to `#top`, which is appropriate on the landing page but has no dedicated application-home behavior in the dashboard shell.

## 8. Problems & Solutions

| Situation | Current solution / required handling |
| --- | --- |
| Missing Supabase environment values | Client helper factories fail immediately with `Missing Supabase environment variables.` Add the values to local environment configuration; never hard-code secrets. |
| Expired or changed auth sessions | Middleware calls `supabase.auth.getUser()` and returns refreshed cookies through `updateSession`. Keep the middleware active. |
| Unconfirmed email account attempts to sign in | The action signs the user out and returns an explicit confirmation message; the dashboard layout and middleware also reject it. |
| Open redirect risk in confirmation callback | The callback accepts `next` only when it begins with `/`; otherwise it redirects to `/dashboard`. Preserve this behavior. |
| Future sidebar links return 404 | These routes are navigation placeholders only. Build their pages as part of their corresponding feature task, or revise navigation in that task. |
| No database schema despite Supabase integration | Authentication is integrated, but application tables, RLS, Storage, and types are absent. Create and validate these before implementing data-backed features. |
| Current dashboard values are unknown | The statistic values intentionally render as em dashes and upload is disabled. Replace them only with real, authorized data. |

## 9. Decisions Made

- Use the Next.js App Router, Server Components by default, Server Actions for auth mutations, and Route Handlers for callback/API endpoints.
- Use `@supabase/ssr` cookie-aware clients instead of the former single `src/lib/supabase.ts` helper. That legacy helper was removed in the authentication commit.
- Require confirmed email addresses before allowing dashboard access.
- Protect dashboard access in both middleware and the server layout.
- Keep auth code feature-local under `src/features/auth` while placing shared Supabase factories under `src/lib/supabase`.
- Keep the UI package-light: local shadcn-compatible primitives rather than adding unrelated dependencies.
- Keep the product visually dark-first, emerald-led, cyan-accented, responsive, and accessible.
- Reserve folders for future features without implementing them ahead of their sprint.

## 10. Next Steps

Follow the sprint/task prompt supplied for the next feature. In likely dependency order:

1. Define Supabase migrations for the documented tables, foreign keys, indexes, RLS policies, and `documents` Storage bucket policies; add safe typed database access.
2. Implement document upload with allowed file types (PDF, DOCX, PPTX), stated limits (PDF up to 100 pages, PPTX up to 100 slides, reasonable DOCX sizes), ownership-safe Storage paths, and document records.
3. Build protected document/workspace routes and replace placeholder navigation with real routes.
4. Add server-only document processing and Gemini integration.
5. Implement and persist summaries, document chat, quizzes, flashcards, and supported image analysis.
6. Query and render document/history data on the dashboard.
7. Run lint and production build after each implementation task; verify authentication redirects and RLS behavior with authenticated/unauthenticated users.

Do not implement these speculatively: only work on the feature authorized by the active sprint prompt.

## 11. Instructions for Future AI

1. Before changing code, read `AGENTS.md`, the relevant files in `docs/`, and the applicable task in `prompts/`. Follow their scope exactly.
2. Implement only the requested task. Do not redesign the architecture, add future features, install unnecessary packages, or modify unrelated files.
3. Use TypeScript, Tailwind CSS, reusable small components, and Server Components whenever possible.
4. Preserve the existing Supabase SSR client split and authentication guards. Use the browser, server, or middleware helper appropriate to the execution environment.
5. Treat all user-owned data, Storage objects, and AI operations as authorization-sensitive. Enforce ownership in RLS and on the server; do not trust a client-provided user ID or document ID without verifying it.
6. Keep secrets server-only. Do not inspect, print, commit, or document values from `.env.local`.
7. Preserve the dark, accessible, responsive design system and use existing shared UI primitives before creating new ones.
8. Update documentation only when an architecture change warrants it, and explain major file changes in the final handoff.
9. Run relevant validation (`npm run lint` and/or `npm run build`) after code changes, proportionate to the task, and report results accurately.
10. Keep Git changes focused. Do not reset, overwrite, or discard user changes that are unrelated to the requested task.
