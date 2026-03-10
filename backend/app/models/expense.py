from sqlalchemy import Column, Integer, ForeignKey, Numeric, Text, Date, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from decimal import Decimal
from datetime import date, datetime
from app.core.database import Base
from datetime import datetime

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    amount: Mapped[Decimal] = mapped_column(Numeric(10,2), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=True)

    expense_date: Mapped[date] = mapped_column(Date, nullable=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))

    # Relationships
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")