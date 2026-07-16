# API Specification

# AI Study Buddy

Version: 3.0

---

# API Overview

AI Study Buddy uses Next.js Route Handlers as its backend API.

All endpoints require authentication unless explicitly stated otherwise.

Authentication is handled by Supabase Auth using the current user session.

---

# Base URL

Development

```
http://localhost:3000/api
```

Production

```
https://your-domain.vercel.app/api
```

---

# Authentication

Authentication Method

- Supabase Session
- HTTP Cookie

Unauthorized requests return

```
401 Unauthorized
```

---

# API List

| Method | Endpoint | Description |
|----------|----------------|------------------------------|
| POST | /api/upload | Upload study document |
| POST | /api/summary | Generate AI summary |
| GET | /api/documents | Get user documents *(Planned)* |
| DELETE | /api/documents/:id | Delete document *(Planned)* |
| POST | /api/quiz | Generate quiz *(Planned)* |

---

# POST /api/upload

Upload a study document.

---

## Authentication

Required

---

## Supported Files

- PDF
- DOCX
- PPTX

Maximum Size

20 MB

---

## Request

Content-Type

```
multipart/form-data
```

Field

```
file
```

---

## Processing Flow

```
Validate File

↓

Upload to Supabase Storage

↓

Insert documents row

↓

Extract Text

↓

Save extracted_text

↓

Return Success
```

---

## Success Response

Status

```
200 OK
```

Example

```json
{
  "success": true
}
```

---

## Error Response

```json
{
  "error": "Unauthorized"
}
```

```json
{
  "error": "Unsupported file type."
}
```

```json
{
  "error": "File size must not exceed 20 MB."
}
```

---

# POST /api/summary

Generate an AI summary from an uploaded document.

---

## Authentication

Required

---

## Request

Content-Type

```
application/json
```

Example

```json
{
  "documentId": "uuid",
  "summaryType": "short"
}
```

---

## Supported Summary Types

- short
- detailed
- bullet
- key-concepts

---

## Processing Flow

```
Authenticate User

↓

Verify Document Ownership

↓

Read extracted_text

↓

Build Prompt

↓

Gemini API

↓

Save summaries

↓

Return Summary
```

---

## Success Response

Status

```
200 OK
```

Example

```json
{
  "success": true,
  "summary": {
    "id": "...",
    "document_id": "...",
    "summary_type": "short",
    "content": "...",
    "created_at": "..."
  }
}
```

---

## Error Responses

Unauthorized

```json
{
  "error": "Unauthorized"
}
```

Document Not Found

```json
{
  "error": "Document not found."
}
```

Missing Text

```json
{
  "error": "Document has no extracted text."
}
```

Unexpected Error

```json
{
  "error": "Unexpected server error."
}
```

---

# GET /api/documents

Status

Planned

Purpose

Return all uploaded documents belonging to the authenticated user.

Future Response

```json
[
  {
    "id": "...",
    "file_name": "lecture.pdf",
    "file_type": "application/pdf",
    "created_at": "...",
    "summary_count": 2
  }
]
```

---

# DELETE /api/documents/:id

Status

Planned

Responsibilities

- Verify ownership
- Delete Storage file
- Delete summaries
- Delete document

---

# POST /api/quiz

Status

Planned

Purpose

Generate quizzes from existing summaries.

---

## Request

```json
{
  "summaryId": "uuid",
  "difficulty": "medium",
  "questionCount": 10
}
```

---

## Processing Flow

```
Read Summary

↓

Build Prompt

↓

Gemini API

↓

Generate Quiz

↓

Save quizzes

↓

Return Quiz
```

The Quiz Generator intentionally uses the stored summary instead of the original extracted document to reduce token usage and improve response speed.

---

# Error Codes

| Status | Description |
|---------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

# AI Integration

Provider

Google Gemini API

SDK

```
@google/genai
```

Current Model

```
gemini-flash-latest
```

Retry Strategy

- Retry on HTTP 429
- Retry on HTTP 503
- Exponential Backoff

---

# Security

Every protected endpoint

- Authenticates the user
- Verifies resource ownership
- Uses Row Level Security (RLS)
- Never exposes another user's data

---

# Current API Status

Completed

- POST /api/upload
- POST /api/summary

Planned

- GET /api/documents
- DELETE /api/documents/:id
- POST /api/quiz

---

# Next Development

Task 08

Document Library API

Task 09

Quiz Generator API

Task 10

Image Analysis API