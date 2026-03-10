from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate


def create_category(db: Session, category: CategoryCreate, user_id: int):

    db_category = Category(
        name=category.name,
        user_id=user_id
    )

    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return db_category


def get_user_categories(db: Session, user_id: int):
    return db.query(Category).filter(Category.user_id == user_id).all()


def delete_category(db: Session, category_id: int, user_id: int):
    category = db.query(Category).filter(
        Category.id == category_id,
        Category.user_id == user_id
    ).first()

    if not category:
        return None

    db.delete(category)
    db.commit()

    return category