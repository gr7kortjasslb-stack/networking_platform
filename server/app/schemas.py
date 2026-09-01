from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

EVENT_TYPES = {"networking", "farmer", "client", "personal"}
PRODUCT_TAGS = {"life", "funeral", "will", "medical", "invest", "retirement"}


class EventCreate(BaseModel):
    date: date
    title: str
    location: str = ""
    type: str = "client"
    product: str | None = None
    notes: str = ""
    lat: float | None = None
    lng: float | None = None
    curated: bool = False


class EventOut(EventCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


class NoteCreate(BaseModel):
    title: str = ""
    body: str
    tag: str | None = None
    pinned: bool = False


class NoteUpdate(BaseModel):
    title: str | None = None
    body: str | None = None
    tag: str | None = None
    pinned: bool | None = None


class NoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    body: str
    tag: str | None
    pinned: bool
    created_at: datetime
