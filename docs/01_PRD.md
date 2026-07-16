# Product Requirement Document (PRD)

# AI Study Buddy

Version: 3.0

---

# 1. Project Overview

AI Study Buddy is an AI-powered web application that helps university students learn more effectively from their study materials.

Users can upload study documents, automatically extract text, generate AI-powered summaries, and create quizzes from those summaries.

The application focuses on simplicity, modern UI, fast performance, secure authentication, and an efficient AI workflow that minimizes token usage.

---

# 2. Project Goal

Develop a modern AI-powered learning assistant that demonstrates the practical integration of Artificial Intelligence into a real-world web application.

The project is designed as a university final project while following professional software engineering practices and production-style architecture.

---

# 3. Target Users

- University students
- College students
- Self-learners
- Anyone studying from digital documents

---

# 4. Core Features

## 4.1 Authentication

Users can

- Register
- Login
- Logout
- Verify email
- Maintain authenticated sessions

Powered by Supabase Authentication.

---

## 4.2 User Profile

Users can

- View profile information
- View registered email
- View account information

---

## 4.3 Document Management

Supported File Types

- PDF
- DOCX
- PPTX

Maximum File Size

- 20 MB

Uploaded documents are stored securely in Supabase Storage.

Each uploaded document stores

- File metadata
- Extracted text
- Upload timestamp

---

## 4.4 AI Summary

Users can generate

- Short Summary
- Detailed Summary
- Bullet Summary
- Key Concepts

Summaries are generated using Google Gemini and stored for future use.

---

## 4.5 AI Quiz Generator

Users can generate quizzes automatically from previously generated AI summaries.

Supported Question Types

- Multiple Choice
- True / False
- Short Answer

Difficulty Levels

- Easy
- Medium
- Hard

Question Count

- User selectable

Quiz Generation Flow

```
Upload Document

↓

Extract Text

↓

Generate Summary

↓

Generate Quiz from Summary

↓

Save Quiz
```

Using summaries instead of full documents significantly reduces AI token consumption.

---

## 4.6 Image Analysis

Google Gemini Vision can explain supported visual content such as

- Charts
- Graphs
- Tables
- Diagrams
- Images inside uploaded documents

This feature will be implemented after the core MVP.

---

## 4.7 Learning History

Users can review

- Uploaded documents
- Generated summaries
- Generated quizzes

This enables students to revisit previous study sessions.

---

# 5. Non Functional Requirements

The application should be

- Fast
- Responsive
- Secure
- Mobile Friendly
- Easy to use
- Modern UI
- Dark Theme
- Scalable
- Maintainable

---

# 6. Out of Scope

The following features are NOT included in this project.

- AI Chat
- Flashcards
- Team Collaboration
- Admin Dashboard
- Payment System
- Email Notifications
- OCR for handwritten documents
- Real-time collaboration
- Multi-language translation

---

# 7. Technology Stack

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

## Deployment

- Vercel

---

# 8. Success Criteria

The project is considered complete when users can

✅ Register and verify email

✅ Login securely

✅ Upload PDF, DOCX and PPTX documents

✅ Automatically extract document text

✅ Generate AI summaries

✅ Generate AI quizzes from summaries

✅ Explain charts, graphs and tables (future feature)

✅ View learning history

✅ Manage profile information

✅ Deploy successfully on Vercel

---

# 9. Future Improvements

- AI Mind Map
- OCR
- AI Presentation Generator
- AI Study Planner
- Multi-document Analysis
- Mobile Application
- Voice Assistant

---

# 10. Current Progress

## Completed

### Authentication

- User Registration
- Login
- Logout
- Email Verification
- Protected Dashboard
- Session Management

---

### Dashboard

Implemented

- Dashboard
- Upload Page
- Documents Page
- Summary Page

Navigation

- Dashboard
- Documents
- Summary

---

### Document Upload

Supported

- PDF
- DOCX
- PPTX

Validation

- Maximum file size (20 MB)
- MIME Type Validation
- Extension Validation

Storage

- Supabase Storage

Metadata

- File Name
- File Type
- File Size
- Upload Date

---

### Document Processing

Automatic Text Extraction

Supported

- PDF (pdf2json)
- DOCX (mammoth)
- PPTX (jszip + xml2js)

The extracted text is automatically stored in the database.

---

### AI Summary

Completed

Summary Types

- Short Summary
- Detailed Summary
- Bullet Summary
- Key Concepts

Implementation

- Summary UI
- Summary API
- Prompt Templates
- Gemini Integration
- Database Persistence
- Retry Mechanism
- Exponential Backoff

Current Model

- gemini-flash-latest

---

## Planned (MVP)

### AI Quiz Generator

Generate quizzes from previously generated summaries.

Benefits

- Faster generation
- Lower token usage
- Lower AI cost
- Better scalability

Supported

- Multiple Choice
- True / False
- Short Answer

Difficulty

- Easy
- Medium
- Hard

---

### Image Analysis

Google Gemini Vision

Support

- Charts
- Graphs
- Tables
- Diagrams
- Images

---

## Current MVP Scope

Implemented

- Authentication
- Dashboard
- User Profile
- Document Upload
- Document Management
- Document Text Extraction
- AI Summary

Planned

- AI Quiz Generator
- Image Analysis

Excluded

- AI Chat
- Flashcards
- Team Collaboration
- Admin Dashboard
- Payment System

---

# 11. Overall Progress

| Task | Status |
|------|--------|
| Task 01 — Project Foundation | ✅ Complete |
| Task 02 — Authentication | ✅ Complete |
| Task 03 — Dashboard | ✅ Complete |
| Task 04 — Upload UI | ✅ Complete |
| Task 05 — Upload Backend | ✅ Complete |
| Task 06 — Document Text Extraction | ✅ Complete |
| Task 07 — AI Summary | ✅ Complete |
| Task 08 — Document Library | 🚧 Next |
| Task 09 — AI Quiz Generator | ⏳ Planned |
| Task 10 — Image Analysis | ⏳ Planned |

---

# 12. Project Status

Approximately **75% of the Minimum Viable Product (MVP)** has been completed.

The application can now

- Authenticate users
- Upload study documents
- Extract document text
- Generate AI summaries
- Store summaries in the database

The next development phase focuses on the Document Library, AI Quiz Generator, and Image Analysis.