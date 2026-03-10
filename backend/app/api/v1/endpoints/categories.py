from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.schemas.category import CategoryCreate
from app.crud.category import create_category, get_user_categories, delete_category

router = APIRouter()


@router.post("/")
def create_new_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return create_category(db, category, current_user.id)


@router.get("/")
def list_categories(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return get_user_categories(db, current_user.id)


@router.delete("/{category_id}")
def remove_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return delete_category(db, category_id, current_user.id)
