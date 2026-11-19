# StudioSpace — Creative Studio Discovery & Booking Platform

**Live site (client):** https://studiospace-client-eta.vercel.app

StudioSpace connects creators (filmmakers, photographers, podcasters, musicians) with verified professional soundstages, cyclorama lofts, podcast rooms, and recording suites. Hosts list their spaces; creators search, book, and manage reservations — all from one modern, responsive web app.

## ✨ Key Features

- 🔍 **Discover & filter studios** by category, location, and keyword with instant search.
- 📅 **4-hour session booking** with transparent hourly rates and refundable security deposits.
- ❤️ **Saved Studios wishlist** — heart any studio to save it for later (per-user, MongoDB-backed).
- 📄 **Downloadable PDF invoices** for confirmed bookings, generated client-side with full booking details.
- 📊 **Creator & host dashboards** to manage listings, bookings, cancellations, and earnings.
- 🌗 **Light/dark theme**, fully responsive across mobile, tablet, and desktop (320px → 1440px).
- 🔐 **Secure authentication** via Better Auth (email/password + Google OAuth) with cross-origin Bearer sessions.

## 🛠 Tech Stack

**Frontend (this repo — `studiospace-client`)**
- Next.js 16.4.6 (App Router, React 19.3, React Compiler)
- TypeScript, Tailwind CSS v4
- shadcn/ui (`base-nova`, built on `@base-ui/react`)
- Better Auth (MongoDB adapter) + `bearer()` plugin
- jsPDF (invoice generation), Sonner (toasts)

**Backend (`studiospace-server`)**
- Node.js ≥ 20, Express 5
- MongoDB (Atlas)
- Better Auth session validation via `/api/auth/get-session`
- Multer (10 MB) + ImgBB for image uploads

## 🚀 Local Setup

### 1. Start the API server
```bash
cd ../studiospace-server
npm install
# create .env with PORT, MONGODB_URI, BETTER_AUTH_URL, CLIENT_ORIGINS, IMGBB_API_KEY
npm start          # or: npm run dev
```
The API runs on `http://localhost:8000`.

### 2. Start the client
```bash
cd ../studiospace-client
npm install
# create .env.local with BETTER_AUTH_URL, MONGODB_URI, BETTER_AUTH_SECRET,
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```
Open http://localhost:3000.

### 3. Verify
```bash
npm run lint        # 0 errors (pre-existing <img> warnings only)
npx tsc --noEmit    # type check
npm run build       # production build
```

> Both servers must run together — the client fetches all studio/booking data from the API on port 8000.

## 🔑 Examiner Test Credentials

Use these to log in and explore the app:

- **Email:** `examiner@studiospace.test`
- **Password:** `Examiner123`

This account can browse studios, save favorites to the wishlist, create bookings, view the My Bookings page, and download PDF invoices for confirmed bookings.

## 📡 API Route Contract

Public:
- `GET /api/studios`, `GET /api/studios/:id`

Authenticated (Bearer token required):
- `GET /api/my-studios`, `GET /api/my-studios/:id`
- `POST /api/studios`, `PATCH /api/studios/:id`, `DELETE /api/studios/:id`
- `GET /api/bookings`, `POST /api/bookings`, `PATCH /api/bookings/:id/cancel`
- `POST /api/upload`
- `GET /api/favorites`, `GET /api/favorites/ids`, `POST /api/favorites/:studioId`, `DELETE /api/favorites/:studioId`

## 🌐 Deployment

- Client (Vercel): https://studiospace-client-eta.vercel.app
- API (Render): https://studiospace-server-bgs9.onrender.com

Set `NEXT_PUBLIC_API_URL=https://studiospace-server-bgs9.onrender.com` on Vercel **before** building (it is inlined into the bundle).

## 📱 Responsive Design

Audited across 320px–1440px. Mobile-first grids collapse to a single column on phones; tap targets are ≥44px; no horizontal scroll on any page.

## License

Private project. All rights reserved.
EOF
echo "README updated"; wc -l README.md