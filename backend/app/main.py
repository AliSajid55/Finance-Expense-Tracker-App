from fastapi import FastAPI
from app.api.v1.api import api_router
from app.core.database import Base, engine


app = FastAPI(title="Finance Expense Tracker API")

app.include_router(api_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
	return {"message": "Finance Expense Tracker API is running"}
