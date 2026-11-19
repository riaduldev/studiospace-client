<div align="center">

# 🎬 StudioSpace
### Peer-to-Peer Creative Workspace & Production Studio Sharing Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://studiospace-client-eta.vercel.app)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://studiospace-server-bgs9.onrender.com)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**StudioSpace** connects filmmakers, photographers, podcasters, and musicians with verified professional soundstages, cyclorama lofts, podcast rooms, and recording suites. Hosts list and manage their spaces while creators discover, book, and manage reservations seamlessly.

[🌐 Live Application](https://studiospace-client-eta.vercel.app) · [🔌 Live API](https://studiospace-server-bgs9.onrender.com)

</div>

---

## 📋 Table of Contents
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Examiner / Demo Credentials](#-examiner--demo-credentials)
- [Local Development Setup](#-local-development-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Quality Assurance & Responsiveness](#-quality-assurance--responsiveness)
- [Deployment Architecture](#-deployment-architecture)

---

## ✨ Key Features

- **🔍 Smart Discovery & Filtering:** Search and filter studios instantaneously by category, location, and keywords with responsive skeleton loading states and helpful empty-state CTAs.
- **📅 Session-Based Booking Engine:** Streamlined 4-hour session booking workflow featuring transparent hourly pricing, refundable security deposits, and real-time reservation tracking.
- **❤️ Persistent Wishlist:** Save favorite studios to a per-user, MongoDB-synced wishlist for quick access later.
- **📊 Role-Based Dashboards:** Dedicated management views for creators and hosts to create/edit studio listings, monitor bookings, handle cancellations, and track earnings.
- **🔐 Cross-Origin Authentication:** Secure email/password and Google OAuth login powered by **Better Auth** using cross-origin Bearer token session validation.
- **🌗 Adaptive UI & UX:** Built with accessible `shadcn/ui` primitives, standardized toast feedback (`Sonner`), custom 404 illustrations, and full mobile-to-desktop responsiveness.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend (`studiospace-client`)** | Next.js 16.4 (App Router), React 19, React Compiler, TypeScript, Tailwind CSS v4, shadcn/ui (`@base-ui/react`), Lucide Icons |
| **Backend (`studiospace-server`)** | Node.js (≥ 20), Express 5, RESTful Architecture, Multer (10 MB upload limit), ImgBB Cloud Storage |
| **Database & Auth** | MongoDB Atlas, Better Auth (MongoDB Adapter + `bearer()` plugin + Google OAuth) |
| **Utilities & Tooling** | `Sonner` (Toast notifications), ESLint, TypeScript Compiler |

---

## 🔑 Examiner / Demo Credentials

Use the pre-configured test account below to explore authenticated features without registering:

| Field | Credential |
| :--- | :--- |
| **Email** | `examiner@studiospace.test` |
| **Password** | `Examiner123` |

> **Capabilities:** Browse and filter studios, manage saved wishlist items, book studio sessions, and view or cancel reservations on the My Bookings page.

---

## 🚀 Local Development Setup

> **Note:** Both the client and API server must run concurrently for data fetching and authentication to function properly.

### 1. Clone the Repositories
```bash
git clone https://github.com/riaduldev/studiospace-client.git
git clone https://github.com/riaduldev/studiospace-server.git
