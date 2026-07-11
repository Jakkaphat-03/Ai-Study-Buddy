# System Architecture

# AI Study Buddy

---

# Architecture Overview

AI Study Buddy is a modern AI-powered web application built with Next.js and Supabase.

The system follows a simple architecture suitable for a university project while remaining scalable.

```
Browser
    │
    ▼
Next.js Web Application
    │
    ├── Authentication
    ├── Dashboard
    ├── Document Workspace
    ├── AI Services
    │
    ▼
Next.js Route Handlers
    │
    ├── Gemini API
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

---

# Application Flow

```
User Login

↓

Dashboard

↓

Upload Document

↓

Document Processing

↓

Choose AI Feature

↓

Summary
Chat
Quiz
Flashcards
Image Analysis

↓

Save History
```

---

# Pages

## Landing Page

Introduce the application.

---

## Login Page

User authentication.

---

## Register Page

Create account.

---

## Dashboard

Recent documents

Quick actions

Statistics

---

## Workspace

The main learning page.

Contains

- Document Viewer
- AI Chat
- Summary
- Quiz
- Flashcards

---

## Profile

Manage account.

---

# Main Modules

Authentication

Document Management

AI Processing

Learning History

User Profile

---

# Deployment

Frontend

Vercel

Backend

Next.js Route Handlers

Database

Supabase

Storage

Supabase Storage

AI

Google Gemini API

---

# Design Principles

- Clean Architecture
- Reusable Components
- Responsive Design
- Dark Theme
- Simple Navigation
- Production-ready Structure