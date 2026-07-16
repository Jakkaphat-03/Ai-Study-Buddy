# PROJECT_CONTEXT.md

# AI Study Buddy

Last Updated: July 2026

---

# Project Overview

AI Study Buddy is an AI-powered web application that helps students learn from study materials using Google Gemini.

The application allows users to upload study documents, automatically extract text, generate AI summaries, and (next) generate quizzes based on those summaries.

This project is being developed as a university final project using production-style architecture and modern full-stack development practices.

---

# Current Tech Stack

Frontend

- Next.js 15 (App Router)
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend

- Next.js Route Handlers

Authentication

- Supabase Auth

Database

- Supabase PostgreSQL

Storage

- Supabase Storage

AI

- Google Gemini API
- @google/genai

Deployment

- Vercel

---

# Current Folder Structure

```
src

├── app
│   ├── api
│   ├── dashboard
│   ├── documents
│   ├── summary
│   ├── upload
│   └── profile
│
├── features
│   ├── auth
│   ├── document
│   ├── summary
│   ├── quiz
│   └── upload
│
├── components
│
└── lib
```

---

# Completed Features

## Authentication

Completed

- Register
- Login
- Logout
- Email Verification
- Protected Dashboard
- Session Management

---

## Dashboard

Completed

- Dashboard
- Upload Page
- Documents Page
- Summary Page

Navigation currently includes

- Dashboard
- Documents
- Summary

Removed from MVP

- AI Chat
- Flashcards

Quiz remains in the project and will be implemented after the Document Library.

---

## Upload

Completed

Supports

- PDF
- DOCX
- PPTX

Validation

- MIME Type
- File Extension
- Maximum Size (20 MB)

Files are uploaded to Supabase Storage.

---

## Document Extraction

Completed

PDF

- pdf2json

DOCX

- mammoth

PPTX

- jszip
- xml2js

Dispatcher

```
extract-document.ts
```

Output

```
string
```

The extracted text is stored in

```
documents.extracted_text
```

---

## AI Summary

Completed

Supported Types

- Short Summary
- Detailed Summary
- Bullet Summary
- Key Concepts

Implemented

- Summary UI
- Summary API
- Prompt Builder
- Gemini Integration
- Database Persistence

Current Gemini Model

```
gemini-flash-latest
```

Retry Strategy

- Retry on 429
- Retry on 503
- Exponential Backoff

---

# Current Database

Implemented

profiles

documents

summaries

Authentication

RLS Policies

Storage Policies

Current Flow

```
Upload

↓

Extract Text

↓

documents.extracted_text

↓

Generate Summary

↓

summaries
```

---

# Token Optimization Strategy

The application intentionally avoids sending the entire document multiple times.

Workflow

```
Document

↓

Extract Text

↓

Generate Summary

↓

Store Summary

↓

Generate Quiz from Summary
```

Benefits

- Lower token usage
- Faster responses
- Lower API cost
- Better scalability

---

# Current API Routes

Completed

POST

```
/api/upload
```

Responsibilities

- Validate upload
- Upload Storage
- Extract text
- Save extracted_text

Completed

POST

```
/api/summary
```

Responsibilities

- Read extracted_text
- Generate summary
- Save summary

---

# Current Progress

## Task 01

Project Foundation

Completed

---

## Task 02

Authentication

Completed

---

## Task 03

Dashboard

Completed

---

## Task 04

Upload UI

Completed

---

## Task 05

Upload Backend

Completed

---

## Task 06

Document Extraction

Completed

---

## Task 07

AI Summary

Completed

---

# Next Task

Task 08

Document Library

Goals

- Display uploaded documents
- Show upload history
- Search documents
- Delete documents
- Open Summary page

---

Future

Task 09

AI Quiz Generator

Quiz will be generated from saved summaries instead of the original document to reduce Gemini token usage.

---

Task 10

Image Analysis

Google Gemini Vision

Support

- Charts
- Tables
- Graphs
- Diagrams

---

# Notes

The previous Gemini integration issue has been resolved.

Final implementation

- SDK: @google/genai
- Model: gemini-flash-latest
- Retry mechanism
- Exponential backoff

The AI Summary feature is now functioning correctly and summaries are successfully stored in the Supabase database.

---

# Instructions for Future AI Assistant

When continuing development:

1. Do not reintroduce AI Chat or Flashcards.
2. Keep Quiz in the project.
3. Generate quizzes from summaries instead of the original document.
4. Reuse existing summaries whenever possible to minimize Gemini token usage.
5. Follow the existing feature-based folder structure.
6. Prefer Server Components and Route Handlers.
7. Maintain the current dark SaaS UI design.
8. Continue with **Task 08 – Document Library** before implementing the Quiz Generator.