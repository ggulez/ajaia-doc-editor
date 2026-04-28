# Architecture Note

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
