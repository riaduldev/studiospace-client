<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# StudioSpace client

Next.js 16.4.6 App Router frontend. Studio and booking data live in the separate `../studiospace-server` repo/deployment; the only server route in this repo is Better Auth.

## Commands

- Use npm (`package-lock.json` is the only lockfile).
- `npm run dev` — dev server (also regenerates the Next.js block above).
- `npm run build` — production build plus type check.
- `npm run lint` — ESLint. One file: `npm run lint -- src/app/page.tsx`.
- `npx tsc --noEmit` — standalone type check; lint does not type-check.
- No test runner is configured. Verify with `lint` → `tsc --noEmit` → `build`.
- API: `npm start` (or `npm run dev`) from `../studiospace-server`; it uses Node ≥20 and its own `package-lock.json`.

## Architecture

- `src/app` — App Router pages; `(auth)` is a route group for `/login` and `/register`.
- `src/lib/auth.ts` — Better Auth server config (MongoDB adapter, database `studio-space`, plus the `bearer()` plugin); exposed by `src/app/api/auth/[...all]/route.ts` with `runtime = "nodejs"`.
- `src/lib/auth-client.ts` — browser auth; use `authClient.useSession()` for the current user. There is no middleware; pages guard client-side and redirect to `/login`.
- External API: every fetch builds the URL inline as `` `${process.env.NEXT_PUBLIC_API_URL}/api/...` ``. There is no API helper module (`src/lib/api-url.ts` was removed) and no `/backend` rewrite. Do not hardcode hosts or add Next route handlers for studio/booking data.
- Auth-protected calls send `Authorization: Bearer <session token>` (taken from `session.session.token`) in addition to `credentials: "include"`. Session cookies are host-scoped, so the Vercel cookie can never reach the Render API — the Bearer header is what actually authenticates cross-origin requests. The API forwards `authorization` (and `cookie`) to Better Auth's `/api/auth/get-session`, which the `bearer()` plugin converts back into a session. CORS on the API must allow the deployed app origin or every browser fetch fails.
- Route contract: public `GET /api/studios` and `GET /api/studios/:id`; authenticated `GET /api/my-studios`, `GET /api/my-studios/:id`, `POST /api/studios`, `PATCH/DELETE /api/studios/:id`, `GET/POST /api/bookings`, `PATCH /api/bookings/:id/cancel`, and `POST /api/upload`.
- Ownership and booking identity come from the session server-side; never send or trust email path params. Booking creation sends only `studioId` + `bookingDate`; the API derives studio title/location and four-hour total, and rejects a second active (Pending/Confirmed) booking per studio per user. Any new protected fetch needs the same Bearer header.
- `studios/[id]` checks `/api/bookings` on load and again before POST; My Bookings hides Cancelled entries after fetching the list.
- Dynamic route pages receive `params` as a Promise; follow the existing `use(params)` pattern in `studios/[id]` and `studios/edit/[id]`.
- `Navbar` intentionally remounts its stateful content via `key={pathname}`; keep that instead of adding reset effects.
- `.github/copilot-instructions.md` has the fuller route/API inventory; keep it in sync when routes or API contracts change.

## UI / styling

- Tailwind v4 through `src/app/globals.css` and the Turbopack CSS loader in `next.config.ts`; there is no PostCSS config — don't add one.
- `components.json` uses shadcn style `base-nova`, built on `@base-ui/react` (not Radix); `src/components/ui` is CLI-generated.
- Import `cn` from the `cn` package (`@/lib/utils` only re-exports it). `@/` maps to `src/`.
- React Compiler is enabled in `next.config.ts`.

## Env

- `.env*` is gitignored except `.env.example`; auth needs `MONGODB_URI`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` (all required at startup by `src/lib/auth.ts`).
- `NEXT_PUBLIC_API_URL` is inlined into the client bundle at **build time**, so it must be set before `npm run build` and must be an absolute API origin the browser can reach: `http://localhost:8000` locally, the Render URL in production.
- Local overrides belong in `.env.local` (`BETTER_AUTH_URL=http://localhost:3000`, `NEXT_PUBLIC_API_URL=http://localhost:8000`); Vercel must define `NEXT_PUBLIC_API_URL=https://studiospace-server-bgs9.onrender.com` before building. Current production URLs: `https://studiospace-client-eta.vercel.app` and `https://studiospace-server-bgs9.onrender.com`.
- Keep secret values out of source control; `.env.example` contains placeholders only.
