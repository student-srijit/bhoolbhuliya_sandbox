# bhoolbhulaiya: Polymorphic Frontend (Phase 1)

This phase demonstrates a shapeshifting UI that assigns randomized class names on
the server per session. Bots scraping for static selectors see only noise.

## Run Locally

1. npm install
2. npm run dev
3. Open the dev server address shown in the terminal.

## Wallet Connection

1. Copy .env.example to .env.
2. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
3. Restart the dev server.

The connect button supports Ethereum mainnet and Sepolia.

## Phase 2 Backend (FastAPI + Groq)

1. Create `backend/.env` from `backend/.env.example` and set `GROQ_API_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.
2. cd backend
3. python -m venv .venv
4. .\.venv\Scripts\activate
5. pip install -r requirements.txt
6. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

## Phase 3 Terminal Experience

- Visit /terminal to use the live-streaming honeypot console.
- Optional: set NEXT_PUBLIC_HONEYPOT_URL in .env if the backend runs elsewhere.

## Phase 4 Admin Dashboard

- Visit /ops for the split-screen hacker view + security dashboard.
- The security panel polls the backend logs and highlights alerts in real time.

## What Is Included

- Middleware that sets a per-session seed cookie.
- Server-only class and CSS generation based on that seed.
- A hidden bait route that flags suspicious visits and redirects to /honeypot.
