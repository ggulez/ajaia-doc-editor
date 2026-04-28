# AI Workflow Note

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
