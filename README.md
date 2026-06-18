# EventSphere — Events Explorer App

A full-stack events discovery application that allows users to search and explore live events using the **Ticketmaster Discovery API**.

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS v4, Framer Motion, SWR, Zustand |
| Backend | FastAPI, httpx, pydantic-settings, cachetools |
| Events API | Ticketmaster Discovery API |

## ✨ Features

- 🔍 **Search by city** — debounced search (350ms) prevents API spam
- 🎭 **Category filtering** — Music, Sports, Arts, Comedy, Film, Family
- 📄 **Pagination** — windowed page controls with scroll-to-top
- 🎨 **Appearance system** — 6 themes, 6 fonts, border radius, shadow, typography controls
- 💎 **Glassmorphism cards** — with lazy-loaded images and fallback gradients
- 📱 **Fully responsive** — mobile-first grid layout
- ⚡ **Optimized** — SWR client cache + backend TTL cache + token-bucket rate limiting
- 🔒 **Secure** — API key never exposed to browser; response shaping strips internal fields

## 🚀 Setup Instructions

### 1. Get a Ticketmaster API Key

Register at [developer.ticketmaster.com](https://developer.ticketmaster.com/) and create an app to get your free API key (5,000 calls/day).

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy env file and add your API key
copy .env.example .env
# Edit .env and set TICKETMASTER_API_KEY=your_key_here

# Run the server
python -m app.main
# Server starts at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
copy .env.local.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000

# Run dev server
npm run dev
# App available at http://localhost:3000
```

---

## 📂 Project Structure

```
staybook-asginment/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app + middleware
│   │   ├── config.py           # pydantic-settings configuration
│   │   ├── api/routes/
│   │   │   ├── events.py       # GET /api/events, /api/events/categories
│   │   │   └── health.py       # GET /api/health
│   │   ├── services/
│   │   │   ├── ticketmaster.py # Async Ticketmaster client
│   │   │   └── cache.py        # TTL cache
│   │   ├── models/
│   │   │   ├── event.py        # Pydantic response models
│   │   │   └── query.py        # Query param models
│   │   └── utils/
│   │       ├── rate_limiter.py # Token bucket middleware
│   │       └── response_filter.py # Response shaping
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx        # Main page
    │   │   └── globals.css     # Theme system (6 themes)
    │   ├── components/
    │   │   ├── events/         # EventCard, EventGrid, EventDetail, EventSkeleton
    │   │   ├── search/         # SearchBar, CategoryFilter
    │   │   ├── pagination/     # Pagination
    │   │   ├── layout/         # Header, Footer
    │   │   ├── settings/       # AppearancePanel, SettingsModal
    │   │   └── providers/      # AppearanceProvider
    │   ├── hooks/              # useDebounce, useThrottle, useEvents, useAppearance
    │   ├── lib/                # api.ts, utils.ts, constants.ts
    │   ├── store/              # appearanceStore (Zustand)
    │   └── types/              # events.ts
    ├── .env.local.example
    └── next.config.ts
```

## 🔒 Security Notes

- **API key never exposed**: All Ticketmaster calls go through the FastAPI backend. The `TICKETMASTER_API_KEY` is server-only.
- **Response shaping**: The `response_filter.py` strips all Ticketmaster-internal fields (`_links`, `_embedded` at root level, raw IDs) before sending to frontend.
- **CORS restriction**: Only origins listed in `ALLOWED_ORIGINS` can call the API.
- **Rate limiting**: Token-bucket limiter (60 req/min per IP by default) prevents abuse.
- **Input validation**: All query params are validated with Pydantic and have server-side whitelists (sort options, categories).

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `TICKETMASTER_API_KEY` | — | **Required.** Your Ticketmaster API key |
| `TICKETMASTER_BASE_URL` | `https://app.ticketmaster.com/discovery/v2` | API base URL |
| `CACHE_TTL_SECONDS` | `60` | Response cache TTL in seconds |
| `CACHE_MAX_SIZE` | `500` | Max cached entries |
| `RATE_LIMIT_PER_MINUTE` | `60` | Requests per minute per IP |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |
| `APP_ENV` | `development` | `development` or `production` |
| `APP_PORT` | `8000` | Server port |

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL |

## 🎨 Appearance System

Click the **Appearance** button in the header to customize:

- **Themes**: Dark, Light, Ocean, Sunset, Forest, Midnight
- **Fonts**: Inter, Roboto, Outfit, Playfair Display, JetBrains Mono, Space Grotesk
- **Border Radius**: 0–24px slider
- **Shadow Intensity**: None / Soft / Medium / Strong
- **Title Size & Weight**: Sliders
- **Subtitle Size & Weight**: Sliders
- **Glassmorphism**: Toggle
- **Animations**: Toggle

All settings persist to `localStorage`.

## 🌐 API Endpoints

```
GET /api/health              — Health check
GET /api/events              — Search events
  ?city=New York
  ?category=Music
  ?page=0&size=12
  ?sort=date,asc
GET /api/events/categories   — List categories
```
