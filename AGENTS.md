<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace client

Next.js 16.4.6 App Router frontend. Studio and booking data come from a separate `studiospace-server` API; the only server route in this repo is Better Auth.

## Commands

- Use npm (`package-lock.json` is the only lockfile).
- `npm run dev` — dev server (also regenerates the Next.js block above).
- `npm run build` — production build plus type check.
- `npm run lint` — ESLint. One file: `npm run lint -- src/app/page.tsx`.
- `npx tsc --noEmit` — standalone type check; lint does not type-check.
- No test runner is configured. Verify with lint + `tsc --noEmit`, or `npm run build`.

## Architecture

- `src/app` — App Router pages; `(auth)` is a route group for `/login` and `/register`.
- `src/lib/auth.ts` — Better Auth server config (MongoDB adapter, database `studio-space`); exposed by `src/app/api/auth/[...all]/route.ts` with `runtime = "nodejs"`.
- `src/lib/auth-client.ts` — browser auth; use `authClient.useSession()` for the current user. There is no middleware; pages guard client-side and redirect to `/login`.
- External API: build every URL with `getApiUrl()` (reads `NEXT_PUBLIC_API_URL`); uploads go through `uploadImageToServer()` → `POST /api/upload` expecting `{ success: true, url }`. Do not hardcode API hosts or add Next route handlers for studio/booking data.
- Ownership is keyed by the session user. User-specific collection GETs are `/api/my-studios` and `/api/bookings` (session cookies, `credentials: "include"`), not email path params. Never use hardcoded account fallbacks; gate on the session and show a `/login` prompt (as dashboard, my-listings, and my-bookings do).
- One active (Pending/Confirmed) booking per studio per user: `studios/[id]` checks `/api/bookings` on load and again before POST. My Bookings hides Cancelled entries after filtering the fetched list.
- Dynamic route pages receive `params` as a Promise; follow the existing `use(params)` pattern in `studios/[id]` and `studios/edit/[id]`.
- `Navbar` intentionally remounts its stateful content via `key={pathname}`; keep that instead of adding reset effects.
- `.github/copilot-instructions.md` has a fuller route/API inventory; keep it in sync when routes or API contracts change.

## UI / styling

- Tailwind v4 through `src/app/globals.css` and the Turbopack CSS loader in `next.config.ts`; there is no PostCSS config — don't add one.
- `components.json` uses shadcn style `base-nova`, built on `@base-ui/react` (not Radix); `src/components/ui` is CLI-generated.
- Import `cn` from the `cn` package (`@/lib/utils` only re-exports it). `@/` maps to `src/`.
- React Compiler is enabled in `next.config.ts`.

## Env

- `.env*` is gitignored; auth needs `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (all required at startup by `src/lib/auth.ts`).
- `NEXT_PUBLIC_API_URL` is inlined at build time — set it before `npm run build`, and it must be reachable from the browser.
