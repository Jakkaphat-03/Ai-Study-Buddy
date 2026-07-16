# System Architecture

# AI Study Buddy

Version: 3.0

---

# Architecture Overview

AI Study Buddy is a modern AI-powered web application built with Next.js, Supabase, and Google Gemini.

The system follows a clean, modular, and scalable architecture suitable for a university final project while maintaining production-style development practices.

```
Browser
    │
    ▼
Next.js Web Application
    │
    ├── Authentication
    ├── Dashboard
    ├── Profile
    ├── Upload
    ├── Documents
    ├── AI Summary
    ├── Quiz Generator
    └── Learning History
    │
    ▼
Next.js Route Handlers
    │
    ├── Google Gemini API
    ├── Supabase Database
    └── Supabase Storage
```

---

# Technology Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

---

## Backend

- Next.js Route Handlers

---

## Database

- Supabase PostgreSQL

---

## Authentication

- Supabase Auth

---

## Storage

- Supabase Storage

---

## AI

- Google Gemini API
- @google/genai SDK

---

# Application Flow

```
User Login

↓

Dashboard

↓

Upload Document

↓

Supabase Storage

↓

Document Text Extraction

↓

Save extracted_text

↓

Generate AI Summary

↓

Save Summary

↓

Generate Quiz (from Summary)

↓

Save Quiz

↓

Learning History
```

---

# AI Processing Flow

```
PDF / DOCX / PPTX

↓

Document Extraction

↓

documents.extracted_text

↓

Prompt Builder

↓

Google Gemini

↓

AI Summary

↓

summaries Table

↓

Quiz Generator

↓

quizzes Table
```

The Quiz Generator uses previously generated summaries instead of the original document to reduce AI token usage and improve response speed.

---

# Pages

## Landing Page

Introduce the application and its features.

---

## Login Page

Authenticate existing users.

---

## Register Page

Create a new account with email verification.

---

## Dashboard

Display

- Recent documents
- Quick actions
- Learning overview

---

## Upload Page

Allow users to

- Upload PDF
- Upload DOCX
- Upload PPTX

Validate files before uploading.

---

## Documents Page

Display

- Uploaded documents
- Upload date
- File information
- Quick actions

Users can navigate to AI Summary generation.

---

## Summary Page

Allow users to

- Select summary type
- Generate AI summaries
- View generated summaries

---

## Profile Page

Display

- User information
- Email
- Account details

---

# Main Modules

## Authentication

- Register
- Login
- Logout
- Email Verification
- Session Management

---

## User Profile

- View profile
- Display account information

---

## Document Management

Responsibilities

- Upload documents
- Store metadata
- Secure file storage
- List uploaded documents

---

## Document Processing

Responsibilities

- Extract text from uploaded files
- Normalize extracted content
- Store extracted_text in database

Supported formats

- PDF (pdf2json)
- DOCX (mammoth)
- PPTX (jszip + xml2js)

---

## AI Summary

Responsibilities

- Build prompts
- Call Gemini API
- Generate summaries
- Save summaries

Supported Types

- Short Summary
- Detailed Summary
- Bullet Summary
- Key Concepts

Current Model

- gemini-flash-latest

Reliability

- Retry mechanism
- Exponential backoff

---

## Quiz Generator

Responsibilities

- Generate quizzes from saved summaries
- Save quizzes
- Reduce token usage

Supported Questions

- Multiple Choice
- True / False
- Short Answer

Difficulty

- Easy
- Medium
- Hard

---

## Learning History

Store

- Uploaded documents
- AI summaries
- AI quizzes

---

# Folder Structure

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

# Summary Services

Location

```
src/features/summary/services
```

Files

- gemini.ts
- generate-summary.ts
- prompts.ts

Workflow

```
documents.extracted_text

↓

Prompt Builder

↓

Gemini API

↓

Generated Summary

↓

summaries Table
```

---

# Document Services

Location

```
src/features/document/services
```

Files

- extract-document.ts
- extract-pdf.ts
- extract-docx.ts
- extract-pptx.ts

Responsibilities

- Detect document type
- Extract text
- Return normalized string

---

# API Routes

## POST /api/upload

Responsibilities

- Validate file
- Upload to Storage
- Insert document metadata
- Extract text
- Save extracted_text

---

## POST /api/summary

Responsibilities

- Validate ownership
- Read extracted_text
- Generate summary
- Save summary
- Return generated summary

---

# Token Optimization Strategy

To reduce AI cost and improve performance, the application avoids sending the original document multiple times.

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

# Deployment

Frontend

- Vercel

Backend

- Next.js Route Handlers

Database

- Supabase PostgreSQL

Storage

- Supabase Storage

AI

- Google Gemini API

---

# Design Principles

- Clean Architecture
- Feature-based Structure
- Reusable Components
- Server Components whenever possible
- Responsive Design
- Dark Theme
- Modern SaaS UI
- Secure Authentication
- Production-ready Folder Organization

---

# Current Progress

Completed

- Authentication
- Dashboard
- Upload
- Document Extraction
- Documents Page
- AI Summary
- Gemini Integration
- Summary Persistence

Next

- Document Library Improvements
- AI Quiz Generator
- Image Analysis