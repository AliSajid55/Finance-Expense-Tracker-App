from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import users
from app.api.v1.endpoints import categories
from app.api.v1.endpoints import expenses
from app.api.v1.endpoints import analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])

api_router.include_router(users.router, prefix="/users", tags=["Users"])

api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])

api_router.include_router(expenses.router, prefix="/expenses", tags=["Expenses"])

api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
