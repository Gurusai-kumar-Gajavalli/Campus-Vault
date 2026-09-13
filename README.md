<div align="center">

# ðŸ›ï¸ CampusVault

### *"Don't let student knowledge graduate."*

A production-grade, collaborative knowledge-preservation platform built for **GitHub Community SRM (GCSRM) Recruitment 2026 â€” Option A: Mini Collaborative App**.

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express.js](https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

[ðŸš€ Live Demo](#-live-demo) â€¢ [âš¡ Quickstart](#-quickstart) â€¢ [ðŸ—ï¸ Architecture](#ï¸-architecture) â€¢ [ðŸ“– API Reference](#-api-reference) â€¢ [ðŸš¢ Deployment](#-deployment)

</div>

---

## ðŸŽ¯ The Problem

Every graduating batch takes irreplaceable institutional knowledge with it:

- ðŸ“‹ **Exact interview questions** from Amazon, Microsoft, and startups â€” lost to WhatsApp chats
- ðŸ“š **Course intel** â€” which electives are GPA boosters vs. traps, which professors are harsh in viva
- ðŸ—ï¸ **Capstone pitfalls** â€” architectural mistakes and bugs that took weeks to fix
- ðŸ›ï¸ **Campus secrets** â€” Wi-Fi spots, reading rooms, club networking shortcuts

**CampusVault** transforms this scattered, ephemeral wisdom into an immutable, searchable, crowdsourced campus repository â€” so the next batch never starts from scratch.

---

## âœ¨ Features

| Feature | Description |
|---|---|
| ðŸ—„ï¸ **4 Topic Vaults** | Placements, Course Notes, Projects, Campus Life â€” structured knowledge categories |
| ðŸ” **Live Search** | Debounced cross-vault search with instant result dropdowns |
| ðŸ… **Author Badges** | Verified Senior (4th Year) & Alumni mentor badges with branch & year |
| â¬†ï¸ **Upvoting** | Optimistic toggleable upvotes with live count updates |
| ðŸ’¬ **Comments** | Threaded commenting with author identity on every reply |
| âœï¸ **Full CRUD** | Create, read, edit, and delete entries â€” owner-only enforced server-side |
| ðŸ” **Auth + Profiles** | Supabase Auth with student metadata (name, batch year, branch) |
| ðŸ”ƒ **Sort & Filter** | Sort by Top Upvoted / Newest First Â· Filter by Seniors & Alumni Only |
| âš¡ **Zero-Config Demo** | Works instantly with no Supabase account â€” pre-seeded in-memory store |
| ðŸ’€ **Loading Skeletons** | Shimmer pulse skeletons for every loading state |
| âŒ **Empty States** | Illustrated empty states with clear calls-to-action |
| ðŸ›¡ï¸ **Error Handling** | Network banners, animated toasts, real-time form validation |

---

## ðŸš€ Live Demo

> ðŸŸ¡ Deploy your own instance using the [Deployment Guide](#-deployment) below.

| Service | URL |
|---|---|
| ðŸŒ Frontend (Vercel) | *(Add your Vercel URL after deploying)* |
| âš™ï¸ Backend API (Render) | *(Add your Render URL after deploying)* |
| ðŸ“¹ Demo Video | *(Add your walkthrough video link)* |

---

## ðŸ—ï¸ Architecture

CampusVault uses a clean, decoupled two-service architecture:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚         Browser â€” Next.js 14 (App Router)           â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”  â”‚
â”‚  â”‚  React UI   â”‚  â”‚ Supabase  â”‚  â”‚  API Client   â”‚  â”‚
â”‚  â”‚ (Tailwind)  â”‚  â”‚Auth Clientâ”‚  â”‚ /lib/api.ts   â”‚  â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜  â””â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”˜  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
          â”‚               â”‚ Sign in / up  â”‚ Bearer <JWT>
          â”‚         â”Œâ”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”        â”‚
          â”‚         â”‚  Supabase  â”‚        â”‚
          â”‚         â”‚ GoTrue Authâ”‚        â”‚
          â”‚         â””â”€â”€â”€â”€â”€â–²â”€â”€â”€â”€â”€â”€â”˜        â”‚
          â”‚               â”‚ Verify JWT    â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚          Express.js API Server â€” Node.js (:4000)     â”‚
â”‚                   â”Œâ”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”                     â”‚
â”‚                   â”‚    JWT     â”‚â—„â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
â”‚                   â”‚ Middleware â”‚
â”‚                   â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜
â”‚              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚         â”Œâ”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”          â”Œâ”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”         â”‚
â”‚         â”‚ /vaults  â”‚          â”‚ /entries   â”‚         â”‚
â”‚         â”‚  Router  â”‚          â”‚   Router   â”‚         â”‚
â”‚         â””â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”˜          â””â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”˜         â”‚
â”‚              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                â”‚
â”‚                   â”Œâ”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚                   â”‚   Supabase PostgreSQL DB    â”‚     â”‚
â”‚                   â”‚  (RLS + Views + Triggers)   â”‚     â”‚
â”‚                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â”‚                          â†• fallback (demo mode)       â”‚
â”‚                   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”     â”‚
â”‚                   â”‚  In-Memory Demo Store       â”‚     â”‚
â”‚                   â”‚  (mockStore.js â€” no DB req) â”‚     â”‚
â”‚                   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜     â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

**Why this architecture?**
- **Separation of Concerns** â€” Next.js handles SSR/routing; Express handles business logic & auth enforcement
- **Security** â€” The frontend **never** touches the service role key or talks to PostgreSQL directly
- **Zero-Config Demo** â€” Backend auto-detects missing Supabase credentials and switches to mock mode

---

## ðŸ“ Project Structure

```
Campus-Vault/
â”‚
â”œâ”€â”€ ðŸ“„ package.json              # Root scripts â€” runs dev concurrently
â”œâ”€â”€ ðŸ“„ .gitignore
â”‚
â”œâ”€â”€ ðŸ“‚ backend/                  # Node.js + Express.js REST API
â”‚   â”œâ”€â”€ server.js                # App entrypoint, CORS, error handling
â”‚   â”œâ”€â”€ .env.example             # Environment variable template
â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â””â”€â”€ auth.js              # JWT bearer token verification
â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”œâ”€â”€ vaults.js            # GET /api/vaults
â”‚   â”‚   â””â”€â”€ entries.js           # Entries CRUD, search, votes, comments
â”‚   â””â”€â”€ lib/
â”‚       â”œâ”€â”€ supabaseAdmin.js     # Service-role Supabase client
â”‚       â””â”€â”€ mockStore.js         # Pre-seeded demo data (zero-config mode)
â”‚
â”œâ”€â”€ ðŸ“‚ frontend/                 # Next.js 14 (App Router + TypeScript)
â”‚   â”œâ”€â”€ middleware.ts            # Session refresh middleware
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ layout.tsx           # Root layout â€” Navbar + Toast + Footer
â”‚   â”‚   â”œâ”€â”€ page.tsx             # Home: hero, live search, vault grid
â”‚   â”‚   â”œâ”€â”€ globals.css          # Design tokens, custom cards, animations
â”‚   â”‚   â”œâ”€â”€ login/page.tsx       # Sign in / Sign up with test personas
â”‚   â”‚   â”œâ”€â”€ vault/[slug]/
â”‚   â”‚   â”‚   â”œâ”€â”€ page.tsx         # Vault feed â€” sort tabs, senior filter
â”‚   â”‚   â”‚   â””â”€â”€ new/
â”‚   â”‚   â”‚       â”œâ”€â”€ page.tsx     # Auth-gated deposit page
â”‚   â”‚   â”‚       â””â”€â”€ NewEntryForm.tsx  # Entry form with real-time validation
â”‚   â”‚   â””â”€â”€ entry/[id]/
â”‚   â”‚       â””â”€â”€ page.tsx         # Full entry â€” voting, edit/delete, comments
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ Navbar.tsx           # Sticky nav with live user avatar & badges
â”‚   â”‚   â”œâ”€â”€ AuthorBadge.tsx      # Verified Senior / Alumni badge
â”‚   â”‚   â”œâ”€â”€ Skeleton.tsx         # Shimmer loading skeletons
â”‚   â”‚   â”œâ”€â”€ EmptyState.tsx       # Illustrated empty state component
â”‚   â”‚   â””â”€â”€ Toast.tsx            # Animated notification system
â”‚   â””â”€â”€ lib/
â”‚       â”œâ”€â”€ api.ts               # Typed fetch wrapper with JWT attachment
â”‚       â”œâ”€â”€ supabaseClient.ts    # Browser Supabase auth client
â”‚       â””â”€â”€ types.ts             # TypeScript models (Vault, Entry, Comment)
â”‚
â””â”€â”€ ðŸ“‚ supabase/
    â””â”€â”€ schema.sql               # Tables, RLS policies, views, triggers
```

---

## âš¡ Quickstart

### Prerequisites
- **Node.js** v18+
- **npm** v9+

### 1. Clone & Install

```bash
git clone https://github.com/Gurusai-kumar-Gajavalli/Campus-Vault.git
cd Campus-Vault

# Installs root, backend, and frontend dependencies in one command:
npm run install:all
```

### 2. Run in Zero-Config Demo Mode âœ¨

No Supabase account needed! The backend auto-detects missing credentials and boots with realistic pre-seeded data.

```bash
npm run dev
```

| Service | URL |
|---|---|
| ðŸŒ Frontend | http://localhost:3000 |
| âš™ï¸ Backend API | http://localhost:4000 |
| ðŸ¥ API Health Check | http://localhost:4000/api/health |

---

## ðŸ—„ï¸ Connecting Supabase (Live Mode)

1. **Create a free project** at [supabase.com](https://supabase.com)

2. **Run the schema** â€” open the SQL Editor and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql)

3. **Configure Backend:**
   ```bash
   cp backend/.env.example backend/.env
   ```
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Configure Frontend:**
   ```bash
   cp frontend/.env.local.example frontend/.env.local
   ```
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```


5. **Restart** `npm run dev` - both services automatically switch to Live Supabase Mode!

---

## API Reference

Base URL: `http://localhost:4000`

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/health` | - | Health check + active mode (`demo-mock` or `live-supabase`) |
| `GET` | `/api/vaults` | - | List all vaults with entry counts |
| `GET` | `/api/vaults/:slug` | - | Single vault metadata |
| `GET` | `/api/entries?vault_id=&sort=&year=` | Optional | Vault entries - sort by `top`/`newest`, filter by year |
| `GET` | `/api/entries/search?q=` | - | Cross-vault full-text search |
| `GET` | `/api/entries/:id` | Optional | Entry detail with `hasVoted` and `isOwner` |
| `POST` | `/api/entries` | Yes | Create a new entry |
| `PUT` | `/api/entries/:id` | Yes (Owner) | Edit entry title, content, resource link |
| `DELETE` | `/api/entries/:id` | Yes (Owner) | Delete entry + related votes/comments |
| `POST` | `/api/entries/:id/vote` | Yes | Toggle upvote (atomic) |
| `GET` | `/api/entries/:id/comments` | Optional | List comments with author profile |
| `POST` | `/api/entries/:id/comments` | Yes | Add a comment |
| `DELETE` | `/api/entries/:id/comments/:commentId` | Yes (Owner) | Delete a comment |

---

## Deployment

### Backend - Render / Railway

1. Push repository to GitHub
2. Create **New Web Service** on [Render](https://render.com) or [Railway](https://railway.app)
3. Set **Root Directory** to `backend`
4. **Build Command:** `npm install`
5. **Start Command:** `npm start`
6. Add **Environment Variables:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `PORT=4000`

### Frontend - Vercel

1. Import this repository on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
4. Click **Deploy**

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js 4 |
| **Database** | Supabase (PostgreSQL), Row-Level Security |
| **Auth** | Supabase GoTrue (JWT-based) |
| **Dev Tools** | concurrently, dotenv, @supabase/ssr |

---

<div align="center">

Made by **[Gurusai Kumar Gajavalli](https://github.com/Gurusai-kumar-Gajavalli)**

Star this repo if you found it helpful!

</div>
