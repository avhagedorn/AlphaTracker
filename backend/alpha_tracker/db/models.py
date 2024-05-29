import datetime

from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import func
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )

    portfolios = relationship(
        "Portfolio", back_populates="user", cascade="all, delete-orphan"
    )
    transactions = relationship(
        "Transaction", back_populates="user", cascade="all, delete-orphan"
    )
    preferences = relationship(
        "UserPreferences",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )


class Portfolio(Base):
    __tablename__ = "portfolio"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    cash_in_cents: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    user = relationship("User", back_populates="portfolios")
    transactions = relationship("Transaction", back_populates="portfolio")


class Transaction(Base):
    __tablename__ = "transaction"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    portfolio_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("portfolio.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    ticker: Mapped[str] = mapped_column(String, nullable=False)
    price: Mapped[float] = mapped_column(Integer, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    transaction_type: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    purchased_at: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)

    portfolio = relationship("Portfolio", back_populates="transactions")
    user = relationship("User", back_populates="transactions")


class UserPreferences(Base):
    __tablename__ = "user_preferences"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("user.id"), nullable=False, unique=True
    )
    strategy_display_option: Mapped[int] = mapped_column(
        Integer, nullable=False, default=0
    )

    user = relationship("User", back_populates="preferences")
