# Virtual Bytez

A vintage tech storefront with **user-customizable product options** — **React + Vite** frontend, **[Virtual-Bytez-Backend](https://github.com/geeko452100/Virtual-Bytez-Backend)** API, and **Supabase** for auth and data.

Browse restored classics — Commodore 64, Macintosh SE, Walkman, Game Boy, Model M — configure finishes, mods, and extras with live pricing, save builds, and place orders.

## Features

| Area | What's included |
|------|-----------------|
| **Shop** | Category filters, product images, condition grades (1–10), stock status |
| **Customization** | Select, checkbox, and text (engraving) options with live price updates |
| **Cart & checkout** | Persistent cart UI, order creation with line items via API |
| **Auth** | Email/password sign-up and sign-in via Supabase Auth |
| **Saved builds** | Logged-in users save and reload custom configurations |
| **Admin** | Manage catalog, stock, order statuses, and shipment tracking (admin role required) |
| **Routing** | Shareable URLs — `/shop`, `/shop/c64`, `/checkout`, `/account`, `/admin` |

Without Supabase credentials the app falls back to the local seed catalog; auth, checkout, and saved builds require a configured backend.

## Quick start

### 1. Start the API

Clone and run the backend in a separate terminal:

```bash
git clone https://github.com/geeko452100/Virtual-Bytez-Backend.git
cd Virtual-Bytez-Backend
npm install
cp .env.example .env   # add Supabase credentials
npm run dev            # http://localhost:3001
```

See the [backend README](https://github.com/geeko452100/Virtual-Bytez-Backend) for migrations, seeding, and deploy.

### 2. Start the frontend

```bash
npm install
cp .env.example .env   # add Supabase + API URL
npm run dev            # http://localhost:5173
```

Vite proxies `/api` → `http://localhost:3001` in dev.

### 3. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run migrations from [Virtual-Bytez-Backend](https://github.com/geeko452100/Virtual-Bytez-Backend) (`npm run migrate` or SQL Editor).
3. Copy the **Project URL** and **anon public** key into `.env`:

   ```env
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_API_URL=/api
   ```

4. Seed the catalog via the backend (`npm run seed`) or **Admin UI** → **Upload seed catalog**.
5. Promote your account to admin (SQL Editor):

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'you@example.com';
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run download-images` | Download product image assets |

## Project structure

```
├── src/
│   ├── api/                 # HTTP client wrappers → Express API
│   ├── context/             # Auth, products, cart providers
│   ├── hooks/
│   ├── lib/                 # Supabase auth client, API client, config
│   ├── data/products.js     # Local seed catalog (offline fallback)
│   ├── components/
│   └── pages/
└── .env.example
```

Backend (separate repo): [github.com/geeko452100/Virtual-Bytez-Backend](https://github.com/geeko452100/Virtual-Bytez-Backend)

## Architecture

```
Browser (React)
  ├─ Supabase Auth (sign-in / sign-up / session)
  └─ Virtual-Bytez-Backend /api/*
        └─ Supabase Postgres + RLS (via user JWT)
```

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | For auth + API | Supabase project URL (browser) |
| `VITE_SUPABASE_ANON_KEY` | For auth + API | Supabase anon key (browser) |
| `VITE_API_URL` | Optional | API base URL — defaults to `/api` (Vite proxy in dev) |

## Deploy to Cloudflare Pages

The frontend is a static Vite build. Deploy the API from [Virtual-Bytez-Backend](https://github.com/geeko452100/Virtual-Bytez-Backend) separately and set `VITE_API_URL` to your API URL.

### Build settings

| Setting | Value |
|---------|--------|
| Build command | `npm run build` |
| Build output directory | `dist` |

### Production env vars

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://your-api.example.com/api
```

Configure Supabase auth redirect URLs to match your Pages domain.

## License

Private project — see repository owner for terms.
