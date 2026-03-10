from sqlalchemy.orm import Session
from app.models import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(db: Session, expense: ExpenseCreate, user_id: int):

    db_expense = Expense(
        amount=expense.amount,
        description=expense.description,
        expense_date=expense.expense_date,
        category_id=expense.category_id,
        user_id=user_id
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense


def get_user_expenses(db: Session, user_id: int):
    return db.query(Expense).filter(Expense.user_id == user_id).all()


def get_category_expenses(db: Session, category_id: int, user_id: int):
    return db.query(Expense).filter(
        Expense.category_id == category_id,
        Expense.user_id == user_id
    ).all()


def update_expense(db: Session, expense_id: int, expense: ExpenseUpdate, user_id: int):

    db_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user_id
    ).first()

    if not db_expense:
        return None

    if expense.amount is not None:
        db_expense.amount = expense.amount 

    if expense.description is not None:
        db_expense.description = expense.description 

    if expense.expense_date is not None:
        db_expense.expense_date = expense.expense_date 

    if expense.category_id is not None:
        db_expense.category_id = expense.category_id 

    db.commit()
    db.refresh(db_expense)

    return db_expense


def delete_expense(db: Session, expense_id: int, user_id: int):

    db_expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == user_id
    ).first()

    if not db_expense:
        return None

    db.delete(db_expense)
    db.commit()

    return db_expense