# Submission

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
