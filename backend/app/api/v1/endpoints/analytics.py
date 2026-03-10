from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db, get_current_user
from app.models.expense import Expense

router = APIRouter()


@router.get("/monthly-total")
def monthly_total(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    total = db.query(func.sum(Expense.amount)).filter(
        Expense.user_id == current_user.id
    ).scalar()

    return {"total_expenses": total or 0}

