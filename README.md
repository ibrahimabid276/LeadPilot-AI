# LeadPilot AI

A full-stack AI-powered lead management platform built entirely on free and open-source services. $0 cost to run during development and testing.

## Tech Stack

- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS
- **Backend**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **Authentication**: Supabase Auth (free tier)
- **AI Models**: OpenRouter (free models - Gemini, Llama, DeepSeek, Qwen)
- **Email**: Resend (free tier, 100 emails/day)
- **Maps/Business Search**: OpenStreetMap (Nominatim + Overpass API)

## Free Service Limits

| Service | Free Tier | Notes |
|---|---|---|
| Supabase Auth | 50,000 monthly active users | Email/password auth |
| OpenRouter | Varies by model | Free models: `google/gemini-2.5-flash`, `meta-llama/llama-4-maverick`, `deepseek/deepseek-chat`, `qwen/qwen-2.5-72b-instruct` |
| Resend | 100 emails/day, 3,000/month | Free tier includes custom domain |
| OpenStreetMap | Unlimited (fair use) | Nominatim: 1 req/sec, Overpass: no hard limit |
| PostgreSQL | Self-hosted via Docker | No limits |
| Redis | Self-hosted via Docker | No limits |

## How to Obtain Free API Keys

### Supabase (Authentication)
1. Go to [supabase.com](https://supabase.com) and sign up for free
2. Create a new project
3. Go to **Settings > API** in the dashboard
4. Copy `Project URL` → `SUPABASE_URL`
5. Copy `anon public` key → `SUPABASE_ANON_KEY`
6. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### OpenRouter (AI Models)
1. Go to [openrouter.ai](https://openrouter.ai) and sign up
2. Navigate to **Keys** in the dashboard
3. Create a new API key → `OPENROUTER_API_KEY`
4. Free models available at [openrouter.ai/models](https://openrouter.ai/models?q=free)

### Resend (Email)
1. Go to [resend.com](https://resend.com) and sign up
2. Go to **API Keys** in the dashboard
3. Create a new API key → `RESEND_API_KEY`
4. Add and verify your sending domain (optional for dev, defaults to `noreply@leadpilot.ai`)
5. Set `EMAIL_FROM` to your verified sender address

## Project Structure

```
leadpilot-ai/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── shared/            # Shared types and utilities
├── docker-compose.yml # Docker configuration (PostgreSQL + Redis + app)
└── README.md
```

## Environment Variables

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql+psycopg://leadpilot:leadpilot_secret@localhost:5432/leadpilot_db
REDIS_URL=redis://localhost:6379/0
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENROUTER_API_KEY=your_openrouter_api_key
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@leadpilot.ai
ENVIRONMENT=development
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (for PostgreSQL and Redis)

### Local Development

**1. Start PostgreSQL and Redis:**
```bash
docker-compose up postgres redis -d
```

**2. Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**3. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Using Docker (Full Stack)

```bash
docker-compose up --build
```

### URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development Mode

When `ENVIRONMENT=development` in the backend `.env`, authentication is bypassed. You can use `dev-token` as the Bearer token to act as a development user without needing Supabase configured.

## Architecture Notes

- All services are designed to be swappable. Each integration is isolated in its own service file, making it easy to upgrade to paid providers later.
- AI service uses OpenRouter as a unified gateway to multiple free models.
- Auth uses Supabase JWT verification on the backend and Supabase client on the frontend.
- Business search uses OpenStreetMap data via Nominatim (geocoding) and Overpass API (structured queries).
