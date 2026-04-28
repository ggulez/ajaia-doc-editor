# DocEditor — Collaborative Document Editor

A lightweight collaborative document editor built for the Ajaia TPM assessment.

## Live Demo
https://ajaia-doc-editor-chi.vercel.app/

## Test Credentials
| User | Email | Password |
|------|-------|----------|
| User 1 | user1@ajaia.test | Test1234! |
| User 2 | user2@ajaia.test | Test1234! |

To demo sharing: log in as user1, create a document, click Share, enter user2@ajaia.test. Log out and log in as user2 to see the shared document.

## Tech Stack
- Frontend: React + Vite + TipTap rich text editor
- Database & Auth: Firebase Firestore + Firebase Authentication
- Deployment: Vercel

## Local Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at http://localhost:5173

## Supported File Upload Types
.txt and .md files only. Files are converted into editable documents on import.

## Features
- Create, rename, edit, and save documents
- Rich text formatting: bold, italic, underline, H1, H2, bullet lists, numbered lists
- Auto-save every 5 seconds + manual save button
- File upload (.txt, .md) converted to editable documents
- Document sharing by email with owner/shared distinction
- Persistent storage via Firestore
- Protected routes — unauthenticated users redirected to login
