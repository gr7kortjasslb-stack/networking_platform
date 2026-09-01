# Cyfer — day planner

A calendar, event map, and personal notes app for a Sanlam retail advisor's
day: client meetings, networking, community visits, and the paperwork that
comes with life cover, wills, and medical aid business.

Two parts: a React (Vite + Tailwind) frontend, and a FastAPI + PostgreSQL
backend. Run both locally to develop.

## 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create the database (adjust user/host as needed)
createdb cyfer

cp .env.example .env              # then edit DATABASE_URL if yours differs

uvicorn app.main:app --reload --port 8000
```

The API is now at http://localhost:8000 (docs at `/docs`). Tables and a
starter event/note are created automatically on first run.

## 2. Frontend

```bash
cp .env.example .env.local        # defaults to http://localhost:8000, edit if needed
npm install
npm run dev
```

Opens at http://localhost:5173 and talks to the API above. If the API isn't
running, the app tells you instead of showing a blank screen.

## Notes

- No auth yet — this is single-user for now. `backend/app/main.py` is the
  place to add a login layer later (e.g. a simple API key or JWT) before
  putting this anywhere multi-advisor or public.
- Event/note "type" and "product" values are constrained lists — see
  `src/data.js` (frontend labels) and `backend/app/schemas.py`
  (`EVENT_TYPES`, `PRODUCT_TAGS`) if you want to change them; keep both in
  sync.
- Event coordinates (`lat`/`lng`) are optional — add them per event to drop
  an accurate pin on the map instead of the Upington default.
