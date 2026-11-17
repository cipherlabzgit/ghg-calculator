# GHG Emissions Calculator

A web port of the [UNFCCC GHG Emissions Calculator v02.6](https://unfccc.int/documents/638361) (September 2022). Users enter organisation details and activity data; the app calculates Scope 1, 2 and 3 emissions in **t CO2e** using the same lookup keys and formulas as the Excel workbook.

This is an awareness tool. It is **not** a certified inventory and should not be used for certification.

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, React Hook Form, Zod, Recharts
- Backend: Node.js, Express, TypeScript, Zod
- Data: JSON emission factors extracted from the hidden Excel `DB` sheet (PostgreSQL can replace this later)

## Requirements

- Node.js 20+
- Python 3.9+ with `openpyxl` (only needed to re-extract factors)

## Setup

```bash
# Backend
cd backend
npm install
npm test
npm run dev
# API: http://localhost:3001

# Frontend (second terminal)
cd frontend
npm install
npm test
npm run dev
# App: http://localhost:5173
```

The Vite dev server proxies `/api` to port 3001. Leave `VITE_API_BASE_URL` empty in local development so the frontend calls `/api` and uses that proxy.

## Show or hide emission factors (operator PIN)

Factor numbers (and GEF / T&D / Factor EV columns) are **hidden by default**, including Excel/CSV exports from the UI. Calculations still run; only the numbers are hidden in the browser. This is the view for end customers.

The reseller (handover customer) can unlock those columns on their own device:

1. Set a PIN in `frontend/.env` (or in the Vercel project environment) and rebuild:

```
VITE_OPERATOR_PIN=your-pin-here
```

2. Restart or rebuild the frontend (`VITE_*` values are baked in at build time).
3. Open `/operator` (quiet “Operator” link in the footer) and enter the PIN.

Unlock is stored in this browser only (`localStorage`). “Hide factors” on that page (or in the footer) locks it again. If `VITE_OPERATOR_PIN` is empty, nobody can unlock.

### What the PIN does — and what it does not

`VITE_OPERATOR_PIN` is **not authentication**. It is a client-side UI gate only:

- It hides or shows factor numbers in tables, Excel/CSV exports, and related UI on that browser.
- The PIN value is compiled into the JavaScript bundle (`VITE_` prefix). Anyone who can download the frontend can inspect it.
- It does **not** protect the API. The same factor values are returned without a PIN by `GET /api/factors`, `GET /api/meta`, and `GET /api/countries`. `POST /api/calculate` uses those factors regardless of the PIN.
- Anyone who can reach the live API can read emission factors and run calculations.

A real login, API keys, or role-based access would be a separate piece of work (auth on both the UI and every `/api` route, plus how operators vs end customers are distinguished). Do not treat this PIN as that system.

## Re-extract emission factors

If you replace `docs/GHG_calculator.xlsx`:

```bash
pip install -r scripts/requirements.txt
python scripts/extract-factors.py
```

This writes `backend/src/data/emission-factors.json`, `countries.json`, `food-factors.json`, `home-office.json`, and `factor-trees.json`. Calculation code never hardcodes factors.

## How it works

1. Organisation → Scope 1 → Scope 2 → Scope 3 → Report
2. Activity rows use type → fuel → unit dropdowns from the Excel factor tables
3. Progress is saved in `localStorage` (`ghg-calculator-draft`)
4. `POST /api/calculate` runs all category services on the backend and returns t CO2e totals
5. The report can be exported as CSV or PDF

Core formula: `kg CO2e = activity × factor`. For hidden-factor customer sheets, activity is the sum of 12 monthly amounts. Freight: `tonnes × km × factor`; hotels: `rooms × nights × factor`; flights: pasted kg; home office already includes months. Report values are `kg / 1000`.

## API

- `GET /api/health`
- `GET /api/countries`
- `GET /api/factors?category=`
- `GET /api/meta`
- `POST /api/calculate`

## Deployment

Frontend and backend stay in this repository as sibling folders. Deploy the frontend to Vercel and the backend to the office live server.

### Frontend (Vercel)

Project settings:

| Setting | Value |
|---------|--------|
| Root Directory | `frontend` |
| Framework Preset | Vite |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 20.x |

`frontend/vercel.json` rewrites unknown paths to `index.html` so React Router (`BrowserRouter`) deep links work. It does **not** proxy `/api` to the office server. The browser calls the office API using `VITE_API_BASE_URL`.

Environment variables (Vercel → Project → Settings → Environment Variables). These are inlined at **build** time:

| Name | Required | Example value |
|------|----------|----------------|
| `VITE_API_BASE_URL` | Yes in production | `https://api.example.com/api` |
| `VITE_OPERATOR_PIN` | Optional | `your-pin-here` |

`VITE_API_BASE_URL` must be the full API base **including** `/api`, with no trailing slash. The client then requests `/countries`, `/health`, `/calculate`, and so on on that base. Leave it empty locally so requests stay on `/api` and use the Vite proxy.

After changing any `VITE_*` variable, trigger a new Vercel build.

### Backend (office live server)

The backend is a standalone Express API. It does not serve the frontend and does not need the `frontend/` folder at runtime.

```bash
cd backend
npm ci
npm test
npm run build
npm start
```

- **Development:** `npm run dev` (`tsx watch src/server.ts`)
- **Production build:** `npm run build` compiles TypeScript to `backend/dist/` and copies JSON datasets to `backend/dist/data/`
- **Production start:** `npm start` runs `node dist/server.js`
- Compiled entry point: **`backend/dist/server.js`**

`backend/.env.example` lists variable names only. **The process does not load `.env` files.** Set variables in the service environment (export in the start script, systemd/PM2/IIS environment, or container env) before `npm start`.

| Name | Required | Example value |
|------|----------|----------------|
| `PORT` | No (default `3001`) | `3001` |
| `CORS_ALLOWED_ORIGINS` | Yes in production | `https://your-frontend.vercel.app` |
| `NODE_ENV` | Recommended | `production` |

`CORS_ALLOWED_ORIGINS` is a comma-separated list of browser origins (scheme + host + port, no path). If it is unset, the API reflects the request `Origin` so local `http://localhost:5173` keeps working. In production, set the live Vercel origin (and any other intended frontends) explicitly.

The live API should be reachable over HTTPS from browsers on Vercel (typically a reverse proxy terminating TLS in front of `node dist/server.js`). Confirm the public URL, then set that URL plus `/api` as `VITE_API_BASE_URL` on Vercel.

Health check after start:

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/countries
```

## Data sources

- **DEFRA 2021** — UK Government GHG Conversion Factors
- **IFI Harmonized GEF 2020/21** — country electricity grid factors
- **Cornell Hotel Sustainability Benchmarking 2020** — hotel stays
- **ICAO** — flights (user pastes kg CO2e from the ICAO calculator)
- **EcoAct** — home-office kWh per hour
- **IOC / Olympic methodology** — food

## Later

Emission factors are JSON files today so the app can run without a database. They can be migrated to PostgreSQL without changing the calculation services.
