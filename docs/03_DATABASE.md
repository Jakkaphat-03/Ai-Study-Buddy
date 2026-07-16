# Database Design

# AI Study Buddy

Version: 3.0

---

# Database Overview

AI Study Buddy uses Supabase PostgreSQL as its primary database.

Authentication is managed by Supabase Auth.

Each authenticated user owns their uploaded study documents, generated summaries, and generated quizzes.

Row Level Security (RLS) is enabled to ensure every user can only access their own data.

---

# Database Architecture

```
Supabase Auth

↓

profiles

↓

documents

├── summaries

└── quizzes
```

---

# Tables

## auth.users

Managed automatically by Supabase Authentication.

Stores

- User accounts
- Email
- Password
- Authentication information

This table is never modified directly by the application.

---

## profiles

Stores user profile information.

A profile is automatically created after registration using a PostgreSQL trigger.

Columns

- id (UUID, Primary Key)
- email
- created_at

Relationship

```
profiles.id

↓

auth.users.id
```

---

## documents

Stores uploaded document metadata.

Columns

- id (UUID)
- user_id (UUID)
- file_name
- file_type
- file_size
- file_url
- extracted_text
- created_at

Relationship

```
user_id

↓

profiles.id
```

Description

Each uploaded document has

- File metadata
- Storage location
- Extracted text

The actual file is stored inside Supabase Storage.

The database stores only metadata and extracted content.

---

## summaries

Stores AI-generated summaries.

Columns

- id (UUID)
- document_id (UUID)
- summary_type
- content
- created_at

Relationship

```
document_id

↓

documents.id
```

Supported Summary Types

- short
- detailed
- bullet
- key-concepts

Description

Each document may have multiple summaries.

Example

- Short Summary
- Detailed Summary
- Bullet Summary

---

## quizzes

Stores AI-generated quizzes.

Columns

- id (UUID)
- document_id (UUID)
- difficulty
- content
- created_at

Relationship

```
document_id

↓

documents.id
```

Supported Difficulty

- Easy
- Medium
- Hard

Description

Quizzes are generated from previously generated summaries to reduce AI token usage.

---

# Entity Relationship

```
auth.users

↓

profiles

↓

documents

├── summaries

└── quizzes
```

---

# Row Level Security (RLS)

Enabled on every application table.

Policies

Users can

- View their own data
- Insert their own data
- Update their own data
- Delete their own data

Users cannot

- View another user's documents
- View another user's summaries
- View another user's quizzes

---

# Storage

Provider

Supabase Storage

Bucket

documents

Visibility

Private

Supported File Types

- PDF
- DOCX
- PPTX

Maximum File Size

20 MB

Storage policies restrict file access to the authenticated owner.

---

# AI Data Flow

```
Upload Document

↓

Supabase Storage

↓

Extract Text

↓

documents.extracted_text

↓

Generate Summary

↓

summaries

↓

Generate Quiz

↓

quizzes
```

The extracted text is generated only once.

Future AI features reuse existing summaries whenever possible to minimize API token usage.

---

# Current Database Status

Completed

- profiles
- documents
- summaries
- Authentication
- RLS Policies
- Storage Policies
- extracted_text

Planned

- quizzes
- Learning History improvements

---

# Future Tables

Not included in this project

- notifications
- subscriptions
- teams
- payments
- embeddings
- vector_documents

---

# Data Ownership

One User

↓

Many Documents

↓

Many Summaries

↓

Many Quizzes

```
User (1)

↓

Documents (N)

↓

Summaries (N)

↓

Quizzes (N)
```

---

# Token Optimization

The application avoids repeatedly sending the full document to Gemini.

Instead

```
Document

↓

Extract Text

↓

Summary

↓

Quiz
```

Benefits

- Lower API cost
- Faster response time
- Smaller prompt size
- Better scalability

---

# Current Progress

Completed

- User Authentication
- User Profiles
- Document Upload
- Supabase Storage
- Document Text Extraction
- AI Summary Storage

Next

- Quiz Storage
- Learning History
- Image Analysis