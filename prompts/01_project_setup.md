# Task 01 — Project Foundation

You are a senior full-stack software engineer.

Read these documents first before making any changes:

- AGENTS.md
- docs/01_PRD.md
- docs/02_ARCHITECTURE.md
- docs/03_DATABASE.md

Goal:
Create the complete project foundation for AI Study Buddy.

Requirements:

1. Initialize a Next.js 15 project using:
   - App Router
   - TypeScript
   - Tailwind CSS
   - ESLint

2. Install and configure:

   - shadcn/ui
   - Framer Motion
   - Lucide React
   - React Hook Form
   - Zod
   - @supabase/supabase-js

3. Create this folder structure:

src/
    app/
    components/
        ui/
        common/
        layout/
    features/
        auth/
        dashboard/
        upload/
        summary/
        chat/
        quiz/
        flashcards/
    lib/
    hooks/
    services/
    types/
    utils/

4. Create:

- .env.example
- lib/supabase.ts
- lib/utils.ts

5. Configure:

- Path alias (@/*)
- Tailwind
- ESLint

6. Create a beautiful placeholder Landing Page.

The Landing Page should contain:

- Project Logo
- Hero Section
- CTA Button
- Feature Cards
- Footer

Theme:

Dark

Primary Color:

Emerald

Accent:

Cyan

Style:

Modern SaaS

Responsive.

7. Do NOT implement authentication.

8. Do NOT implement AI.

9. Do NOT implement database.

10. The project must build successfully.

At the end:

Explain every file created.