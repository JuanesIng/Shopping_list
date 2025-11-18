from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
from uuid import uuid4

from sqlalchemy import create_engine, Column, String, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ---- Axiom / OpenTelemetry ----
from axiom_exporter import service_tracer, request_counter

# ---- Config DB (SQLite local) ----
DATABASE_URL = "sqlite:///./shopping.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)
Base = declarative_base()


class ShoppingItemModel(Base):
    __tablename__ = "shopping_items"

    id = Column(String, primary_key=True, index=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    purchased = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


# ---- Esquemas Pydantic ----
class ShoppingItem(BaseModel):
    id: str
    name: str
    purchased: bool
    created_at: datetime

    class Config:
        orm_mode = True


class ShoppingItemCreate(BaseModel):
    name: str


class ShoppingItemUpdate(BaseModel):
    purchased: bool


class DeleteCompletedRequest(BaseModel):
    ids: List[str]


# ---- App FastAPI ----
app = FastAPI()

# CORS para permitir que el frontend (Vite) acceda
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # en producción, pon solo tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---- Endpoints ----

@app.get("/items", response_model=List[ShoppingItem])
def list_items(db: Session = Depends(get_db)):
    # Span + métrica para este endpoint
    with service_tracer.start_as_current_span("list_items"):
        request_counter.add(1, {"endpoint": "/items", "method": "GET"})
        items = (
            db.query(ShoppingItemModel)
            .order_by(ShoppingItemModel.created_at.desc())
            .all()
        )
        return items


@app.post("/items", response_model=ShoppingItem)
def create_item(payload: ShoppingItemCreate, db: Session = Depends(get_db)):
    with service_tracer.start_as_current_span("create_item"):
        request_counter.add(1, {"endpoint": "/items", "method": "POST"})
        item = ShoppingItemModel(name=payload.name)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item


@app.patch("/items/{item_id}", response_model=ShoppingItem)
def update_item(item_id: str, payload: ShoppingItemUpdate, db: Session = Depends(get_db)):
    with service_tracer.start_as_current_span("update_item"):
        request_counter.add(1, {"endpoint": f"/items/{item_id}", "method": "PATCH"})
        item = db.query(ShoppingItemModel).filter_by(id=item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item no encontrado")

        item.purchased = payload.purchased
        db.commit()
        db.refresh(item)
        return item


@app.delete("/items/{item_id}")
def delete_item(item_id: str, db: Session = Depends(get_db)):
    with service_tracer.start_as_current_span("delete_item"):
        request_counter.add(1, {"endpoint": f"/items/{item_id}", "method": "DELETE"})
        item = db.query(ShoppingItemModel).filter_by(id=item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item no encontrado")

        db.delete(item)
        db.commit()
        return {"ok": True}


@app.post("/items/completed/delete")
def delete_completed(req: DeleteCompletedRequest, db: Session = Depends(get_db)):
    with service_tracer.start_as_current_span("delete_completed"):
        request_counter.add(1, {"endpoint": "/items/completed/delete", "method": "POST"})
        if req.ids:
            (
                db.query(ShoppingItemModel)
                .filter(ShoppingItemModel.id.in_(req.ids))
                .delete(synchronize_session=False)
            )
            db.commit()
        return {"ok": True}