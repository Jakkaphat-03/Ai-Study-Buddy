# Database Design

# AI Study Buddy

---

# Database Overview

The application uses Supabase PostgreSQL.

Each user owns their own documents and AI-generated content.

---

# Tables

## users

Managed by Supabase Authentication.

Additional profile information can be stored if needed.

---

## documents

Store uploaded files.

Columns

- id
- user_id
- file_name
- file_type
- page_count
- file_url
- created_at

---

## summaries

Store AI-generated summaries.

Columns

- id
- document_id
- summary_type
- content
- created_at

---

## chats

Store AI chat history.

Columns

- id
- document_id
- role
- message
- created_at

---

## quizzes

Store generated quizzes.

Columns

- id
- document_id
- difficulty
- content
- created_at

---

## flashcards

Store generated flashcards.

Columns

- id
- document_id
- question
- answer
- created_at

---

# Relationships

users

↓

documents

↓

summaries

↓

chats

↓

quizzes

↓

flashcards

---

# Data Ownership

Every user can only access their own data.

This will be enforced using Supabase Row Level Security (RLS).

---

# Storage

Supabase Storage

Bucket

documents

Supported

- PDF
- DOCX
- PPTX

---

# Future Tables

Not included in this project

- notifications
- subscriptions
- teams
- payments