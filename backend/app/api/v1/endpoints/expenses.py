from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.schemas.response import APIResponse
from app.crud.expense import (
    create_expense,
    get_user_expenses,
    update_expense,
    delete_expense,
    get_category_expenses,
)

router = APIRouter()


@router.post("/", response_model=APIResponse)
def create_new_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_expense = create_expense(db, expense, current_user.id)
    return APIResponse(
        success=True,
        data=ExpenseResponse.model_validate(db_expense)
    )


@router.get("/")
def list_expenses(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_user_expenses(db, current_user.id)


@router.get("/category/{category_id}")
def expenses_by_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_category_expenses(db, category_id, current_user.id)


@router.put("/{expense_id}")
def edit_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return update_expense(db, expense_id, expense, current_user.id)


@router.delete("/{expense_id}")
def remove_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return delete_expense(db, expense_id, current_user.id)
