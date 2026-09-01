import os
from datetime import date, timedelta

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from . import models
from .database import Base, SessionLocal, engine
from .routers import events, notes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cyfer API")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(notes.router)


@app.get("/health")
def health():
    return {"status": "ok"}


def seed_if_empty():
    """Insert the same starter content the frontend used to ship, once."""
    db = SessionLocal()
    try:
        if db.scalar(select(models.Event)) is None:
            db.add(
                models.Event(
                    date=date.today() + timedelta(days=9),
                    title="BNI Grow Your Business Network",
                    location="Desert Palace Hotel and Casino, Upington",
                    type="networking",
                    product="invest",
                    notes=(
                        "08:00-10:00. Business networking launch event for the "
                        "Northern Cape - good spot to open conversations with small "
                        "business owners about retirement and investment cover."
                    ),
                    lat=-28.4438,
                    lng=21.2621,
                    curated=True,
                )
            )
        if db.scalar(select(models.Note)) is None:
            db.add(
                models.Note(
                    title="Client follow-ups this week",
                    body=(
                        "Two families still need to sign off on beneficiary "
                        "nominations before their will drafts can be finalised. "
                        "Chase before Friday."
                    ),
                    tag="will",
                    pinned=True,
                )
            )
        db.commit()
    finally:
        db.close()


seed_if_empty()
