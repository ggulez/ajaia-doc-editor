import os

files = {}

files['README.md'] = """# DocEditor — Collaborative Document Editor

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
"""

files['ARCHITECTURE.md'] = """# Architecture Note

## What I Built
A full stack collaborative document editor with Firebase as the backend, React/TipTap as the frontend, deployed on Vercel.

## Key Decisions

### Firebase over a custom backend
I initially planned a FastAPI Python backend but made a deliberate decision to use Firebase directly from the frontend. The rationale: all required functionality (auth, persistence, sharing, real-time queries) is natively supported by Firebase SDK. Adding a REST API layer would have consumed 45-60 minutes with no meaningful feature gain within the timebox. This is documented as an intentional scope cut, not an oversight.

### TipTap for rich text editing
TipTap is built on ProseMirror and provides a production-grade editing experience with a clean React integration. It handles bold, italic, underline, headings, and lists out of the box. Alternative considered: Quill.js, but TipTap has better React support and a more maintainable extension model.

### Sharing model
Sharing is implemented as an array field sharedWith: [email] on each document. When a user loads the dashboard, two Firestore queries run in parallel — one for owned documents, one for documents where their email appears in sharedWith. This is simple, readable, and sufficient for the scope. A production system would use a separate permissions collection for scale.

### Simulated auth
Two pre-seeded Firebase Auth accounts replace a full registration flow. The assessment explicitly permits this approach and it saved significant time while still demonstrating a real auth system.

### File upload
File processing is handled client-side — the browser reads the file text and converts it to HTML before storing in Firestore. This avoids the need for a backend file processing endpoint.

## What I Would Build Next (with 2-4 more hours)
- Real-time collaborative editing using Firestore onSnapshot on the document content
- Document version history using a versions subcollection
- Role-based sharing (viewer vs editor)
- Export to Markdown or PDF
- Full registration flow replacing seeded accounts
"""

files['AI_WORKFLOW.md'] = """# AI Workflow Note

## Tools Used
- Claude (Anthropic) — primary AI assistant throughout the build

## Where AI Materially Sped Up My Work

### Scaffolding and boilerplate
Claude generated the initial file structure, all React component shells, Firebase configuration wiring, and routing setup. This saved approximately 60-90 minutes of setup time.

### TipTap integration
I had not used TipTap before. Claude provided working integration code including toolbar button patterns, extension imports, and the auto-save interval pattern. I verified it worked by testing each formatting button manually.

### Firestore query patterns
Claude provided the parallel query pattern for owned vs shared documents using onSnapshot. I reviewed the logic to confirm it correctly handled the two separate collections and would not cause permission errors in test mode.

### Debugging
When files were not saving correctly from VSCode, Claude identified the issue and suggested writing files via Python script instead — which resolved the problem immediately. When the Vercel build failed due to folder casing (Components vs components), Claude diagnosed it from the error output and provided the git fix.

## What I Changed or Rejected

### Rejected: FastAPI backend
Claude initially proposed a Python FastAPI backend. I evaluated this against the timebox and determined it added complexity without meaningful feature gain. I made the call to go Firebase-only and had Claude document this as a deliberate architecture decision.

### Modified: Auto-save behavior
Claude's initial save implementation only triggered on button click. I directed Claude to add a 5-second interval auto-save in addition to the manual save button, which is more aligned with real document editor UX.

### Modified: Scope cuts
I directed the overall prioritization — what to build, what to cut, and what to document. Claude executed on those decisions but the judgment calls were mine.

## How I Verified Correctness
- Tested every feature manually on localhost before deploying
- Verified login, document creation, rename, edit, save, reopen, file upload, sharing, and cross-user access
- Confirmed persistence by refreshing the page and verifying documents and content survived
- Tested the live Vercel deployment end-to-end after deploy
"""

files['SUBMISSION.md'] = """# Submission

## Candidate
Gokce (Gio) Gulez — giogulez@gmail.com

## Live URL
https://ajaia-doc-editor-chi.vercel.app/

## Test Credentials
- user1@ajaia.test / Test1234! (primary owner account)
- user2@ajaia.test / Test1234! (secondary account for sharing demo)

## Contents of This Submission
| File | Description |
|------|-------------|
| README.md | Setup instructions, tech stack, feature list |
| ARCHITECTURE.md | Architecture decisions and tradeoffs |
| AI_WORKFLOW.md | AI tool usage documentation |
| SUBMISSION.md | This file |
| frontend/ | Full React/Vite source code |
| video.txt | Walkthrough video URL |

## What Is Working
- User authentication (login/logout)
- Document creation, rename, edit, save, reopen
- Rich text formatting: bold, italic, underline, H1, H2, bullet and numbered lists
- Auto-save every 5 seconds
- File upload (.txt and .md) converted to editable documents
- Document sharing by email
- Owned vs shared document distinction on dashboard
- Full persistence via Firestore
- Live deployment on Vercel

## What Is Incomplete
- No Python/FastAPI backend (deliberately cut — see ARCHITECTURE.md)
- File upload limited to .txt and .md (no .docx parsing)
- No real-time collaborative editing (single user at a time)
- No document version history
- Simulated auth with seeded accounts (no registration flow)

## What I Would Build Next (2-4 more hours)
1. Real-time collaboration using Firestore live listeners on document content
2. Document version history
3. Role-based sharing permissions (viewer vs editor)
4. Export to PDF or Markdown
5. Full registration flow
"""

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)
    print(f"Written: {path}")

print("All docs written!")