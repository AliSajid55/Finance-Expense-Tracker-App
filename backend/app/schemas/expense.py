from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    description: str | None = Field(default=None, max_length=255)
    expense_date: date
    category_id: int

class ExpenseUpdate(BaseModel):
    amount: Decimal | None = None
    description: str | None = None
    expense_date: date | None = None
    category_id: int | None = None

class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    description: str | None
    expense_date: date
    created_at: datetime
    category_id: int

    class Config:
        from_attributes = True