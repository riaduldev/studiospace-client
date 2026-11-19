# StudioSpace

A full-stack studio discovery and booking platform. Creators find and reserve professional soundstages, cyclorama lofts, podcast rooms, and recording suites; hosts list and manage their spaces. Built with **Next.js 16** (App Router) on the frontend and an **Express + MongoDB** API on the backend, with **Better Auth** for authentication.

## Live

- Client: https://studiospace-client-eta.vercel.app
- API: https://studiospace-server-bgs9.onrender.com

## Tech stack

**Client** (`studiospace-client`)
- Next.js 16.4.6 (App Router, React 19.3, React Compiler enabled)
- Tailwind CSS v4 (via `@tailwindcss/turbopack`, no PostCSS config)
- shadcn/ui (`base-nova`, built on `@base-ui/react`)
- Better Auth (MongoDB adapter) + `bearer()` plugin
- Sonner toasts, `cn` package, `next-themes`

**Server** (`studiospace-server`)
- Express 5, MongoDB (Atlas), Multer (10 MB limit)
- Better Auth session validation via `/api/auth/get-session`
- ImgBB for image uploads

## Repository layout

```
studio-space/
├── studiospace-client/   # Next.js app (this repo)
└── studiospace-server/   # Express API (separate repo/deployment)
```

## Prerequisites

- Node.js >= 20
- npm (lockfile: `package-lock.json`)
- A MongoDB instance (Atlas or local)
- Google OAuth credentials (optional, for Google sign-in)
- An ImgBB API key (for image uploads)

## Environment variables

### Client (`studiospace-client/.env.local`)

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
MONGODB_URI=mongodb://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` is inlined into the client bundle at **build time**, so it must be an absolute origin the browser can reach. Use `http://localhost:8000` locally and the Render URL in production.

### Server (`studiospace-server/.env`)

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://...
BETTER_AUTH_URL=http://localhost:3000
CLIENT_ORIGINS=http://localhost:3000
IMGBB_API_KEY=...
```

`BETTER_AUTH_URL` must point at the deployed client origin in production so the API can verify sessions.

## Getting started

```bash
# 1. Start the API
cd ../studiospace-server
npm install
npm start          # or: npm run dev

# 2. Start the client
cd ../studiospace-client
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server (regenerates the Next.js agent block) |
| `npm run build` | Production build + type check |
| `npm run lint` | ESLint (0 errors expected; `<img>` warnings are pre-existing) |
| `npx tsc --noEmit` | Standalone TypeScript check |

Verification order: `lint` → `tsc --noEmit` → `build`.

## Architecture notes

- Studio/booking data come from the external API, not Next.js route handlers. Every fetch builds its URL inline from `process.env.NEXT_PUBLIC_API_URL`.
- Auth-protected calls send `Authorization: Bearer <session token>` (from `session.session.token`) **plus** `credentials: "include"`. Session cookies are host-scoped and cannot cross from the Vercel domain to the Render domain, so the Bearer header is what authenticates cross-origin requests.
- The API validates sessions by forwarding `authorization` (and `cookie`) to Better Auth's `/api/auth/get-session`; the `bearer()` plugin converts the token back into a session.
- Ownership and booking identity are derived server-side from the session. Never send or trust email path params.
- Booking creation sends only `studioId` + `bookingDate`; the API derives studio title/location and the four-hour total, and rejects a second active (Pending/Confirmed) booking per studio per user.
- Dynamic route pages receive `params` as a Promise — follow the existing `use(params)` pattern.
- `Navbar` remounts its stateful content via `key={pathname}`; keep that instead of reset effects.

## API route contract

Public:
- `GET /api/studios`, `GET /api/studios/:id`

Authenticated (Bearer token required):
- `GET /api/my-studios`, `GET /api/my-studios/:id`
- `POST /api/studios`, `PATCH /api/studios/:id`, `DELETE /api/studios/:id`
- `GET /api/bookings`, `POST /api/bookings`, `PATCH /api/bookings/:id/cancel`
- `POST /api/upload`

## Deployment

- **Client (Vercel):** set `NEXT_PUBLIC_API_URL=https://studiospace-server-bgs9.onrender.com` (and the auth secrets) **before** building, because it is inlined into the bundle. Redeploy after changing it.
- **API (Render):** set `BETTER_AUTH_URL` to the deployed client origin and `CLIENT_ORIGINS` to include it. CORS must allow the client origin or every browser fetch fails.
- Production URLs: client `https://studiospace-client-eta.vercel.app`, API `https://studiospace-server-bgs9.onrender.com`.

## Responsive design

Audited across 320–1440 px. Layouts use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) with mobile-first grids that collapse to a single column on phones. Tap targets are at least 44 px, ambient glows are clamped to the viewport, and no horizontal scroll occurs on any page.

## License

Private project. All rights reserved.
