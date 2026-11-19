# Copilot Instructions

## Commands

- `npm run dev` starts the Next.js development server.
- `npm run build` creates a production build and runs the TypeScript checks.
- `npm start` serves the production build.
- `npm run lint` lints the repository.
- To lint one file, use `npm run lint -- src/app/my-listings/page.tsx` (replace the path as needed).
- To run a standalone type check, use `npx tsc --noEmit`.
- No test runner or test files are configured, so there is no single-test command.

## Architecture

- This is a Next.js 16 App Router application. Pages and route handlers live in `src/app`; `(auth)` groups `/login` and `/register` without adding a URL segment. Studio discovery, details, editing, host listings, and bookings are separate route segments under `src/app`.
- `src/app/layout.tsx` is the server root layout: it defines site metadata and the font, imports global styles, and wraps the shared Navbar and Footer in the theme provider.
- Authentication uses Better Auth with the MongoDB adapter. `src/lib/auth.ts` configures the server, database, and the `bearer()` plugin, `src/app/api/auth/[...all]/route.ts` exposes Better Auth's GET/POST handlers, and `src/lib/auth-client.ts` provides the browser client and session hook.
- Studio and booking data are served by an external API, not Next.js route handlers in this repository. Every fetch builds its URL inline from `` `${process.env.NEXT_PUBLIC_API_URL}/api/...` `` — there is no API helper module and no rewrite. `src/lib/uploadHelper.ts` posts images to `/api/upload` and expects a successful JSON response with a string `url`.
- `src/app/add-studio/page.tsx` submits new studio data; `/studios`, `/studios/[id]`, and `/studios/edit/[id]` cover discovery, details/booking, and editing. `/my-listings` and `/my-bookings` request user-specific data from the external API.
- The client consumes these external API operations: `GET /api/studios` (with search query parameters), `GET /api/studios/:id`, `POST /api/studios`, `PATCH` and `DELETE /api/studios/:id`, `GET /api/my-studios`, `GET /api/my-studios/:id`, `POST /api/bookings`, `GET /api/bookings`, `PATCH /api/bookings/:id/cancel`, and `POST /api/upload`. Auth-protected calls send `Authorization: Bearer <session token>` (from `session.session.token`) plus `credentials: "include"`; session cookies are host-scoped and cannot cross from the Vercel domain to the Render domain, so the Bearer header is what authenticates them. The external API verifies it against Better Auth's `/api/auth/get-session` endpoint. Preserve the response shapes expected by the calling pages when changing these integrations.
- Shared site components are under `src/components/shared`; reusable UI primitives are under `src/components/ui` and are configured through `components.json`.

## Repository conventions

- Use the `@/` alias for imports from `src` (for example, `@/components/ui/button`).
- TypeScript strict mode is enabled. Keep the root layout as a Server Component; put browser state, event handlers, and client hooks in Client Components.
- Dynamic route `params` use the Next.js 16 Promise shape; follow the existing `use(params)` pattern in studio detail/edit pages and check the local Next.js guides before changing it.
- Styling uses Tailwind CSS v4 through `src/app/globals.css`; the `dark:` variant is driven by a `.dark` class. Use `src/components/theme-provider.tsx` rather than mounting `next-themes` directly, and keep theme-dependent markup hydration-safe.
- Keep browser auth calls on the shared Better Auth client: email login uses `signIn.email`, Google OAuth uses `signIn.social`, and registration uses `signUp.email`. Registration currently redirects to `/login`; Google login returns to `/`.
- Use `authClient.useSession()` for the signed-in user's identity; do not introduce hardcoded account fallbacks for listing or booking ownership.
- Read the API origin from `process.env.NEXT_PUBLIC_API_URL` (inlined at build time) instead of hardcoding hosts. Use `uploadImageToServer` for studio image uploads so the URL and response handling stay consistent.
- `Navbar` remounts its stateful contents when the pathname changes. Preserve that route-change behavior rather than adding an effect that synchronously resets menu state.
- `next.config.ts` enables the React Compiler and the Tailwind Turbopack CSS loader.
- Authentication server configuration reads `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `MONGODB_URI`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`; every data fetch reads `NEXT_PUBLIC_API_URL`. `.env*` files are ignored by Git except `.env.example`. Keep secret values out of source control and provide required variables to the build/runtime environments.
- Production uses `npm run build` followed by `npm start`. Set `NEXT_PUBLIC_API_URL` to the absolute API origin **before** building, because it is inlined into the client bundle and the browser must be able to reach it directly. Do not put credentials in this URL.

## Next.js version guidance

This repository uses Next.js 16.4.6. Before changing Next.js APIs or conventions, read the relevant local guide under `node_modules/next/dist/docs/`; do not rely on assumptions from other Next.js versions.

The root `AGENTS.md` contains a Next.js instruction block that `next dev` regenerates. Preserve that generated block when editing `AGENTS.md`; `next dev` will re-add it if removed.
