# Abricot — front-end

Front-end of Abricot, a project management SaaS for freelancers (training project).
The back-end is provided and must not be modified.

## Stack

- Next.js 16 (App Router, Turbopack), React, TypeScript (strict)
- Tailwind CSS v4 (theme variables in `app/globals.css`)
- `use-debounce` (delayed search)

## Getting started

Requirements: Node.js, and the provided back-end running on port 8000.

```bash
# Back-end (port 8000)
cd back-end
npm install
npm run dev

# Front-end (port 3000)
cd front-end
npm install
npm run dev
```

Other commands (from `front-end/`): `npm run lint`, `npx tsc --noEmit`, `npm run build`.

## Environment variables

Create `front-end/.env.local` (never committed):

| Variable | Purpose |
|---|---|
| `API_URL` | Base URL of the back-end API (e.g. `http://localhost:8000`). Server-side only: no `NEXT_PUBLIC_` prefix. |

## Architecture

```
app/            routes: (auth) public pages, (main) pages for signed-in users
components/     Atomic Design: Atoms, Molecules, Organisms, Modales (+ Providers for React contexts)
lib/            session cookie, API client (apiFetch), validation, utils, Server Actions
types/api.ts    types of the API responses, built from real responses
proxy.ts        route protection
```

Main choices:

- **The browser never calls the API.** Only the Next server does (server components, Server Actions, proxy).
- **Authentication:** the JWT is stored in an `httpOnly` cookie. `proxy.ts` only checks that the cookie exists; the API checks that the token is valid.
- **Server components by default.** `"use client"` is used as low as possible, only for interactivity.
- **Forms:** Server Action + `useActionState`; all validation is done in the Server Action.

## Features

- Sign up, sign in, edit profile
- Project list and project creation
- Project page: contributors, task cards (description, due date, assignees, comment count) sorted by priority
- Task creation in a modal (title, description, due date, assignees, status), with validation in the Server Action
- Task edition and deletion from a "…" menu on each task card (native Popover API), with a confirmation modal before deleting
- Task search (by title) and status filter on the project page: the filters live in the URL (`?query=...&status=...`), the server filters the list, the search waits 300 ms and 3 characters
- Task comments: a native `<details>` on each card unfolds the comments (author, date, text) and a form to add one; the text is always displayed as plain text, never as HTML
- Generic `Modal` component built on the native `<dialog>` element (used for projects and tasks)
- Shared confirmation message (`FlashMessageProvider`): centered, dismissible and self-closing, announced to screen readers

## Accessibility

Target: WCAG 2.1 level AA.

- Semantic structure (one `<h1>` per page, logical heading order, lists for lists)
- Keyboard navigation and visible focus; icon-only controls have an accessible name
- Status is always written in full, never conveyed by color alone
- Text colors checked against the 4.5:1 contrast ratio (some colors are darker than the mockup for this reason)
