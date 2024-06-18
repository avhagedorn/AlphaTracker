import datetime

from sqlalchemy import Boolean
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import func
from sqlalchemy import Index
from sqlalchemy import Integer
from sqlalchemy import PrimaryKeyConstraint
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

    reset_password_requests = relationship(
        "ResetPasswordRequest", back_populates="user", cascade="all, delete-orphan"
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
    transactions = relationship(
        "Transaction", back_populates="portfolio", cascade="all, delete-orphan"
    )


class Transaction(Base):
    __tablename__ = "transaction"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    portfolio_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("portfolio.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    ticker: Mapped[str] = mapped_column(String, nullable=False)
    price_cents: Mapped[int] = mapped_column(Integer, nullable=False)
    quantity: Mapped[float] = mapped_column(Integer, nullable=False)
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


"""
User State Tables
"""


class ResetPasswordRequest(Base):
    __tablename__ = "reset_password_request"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    uuid_token: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("user.id"), nullable=False)
    expires_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, nullable=False, default=func.now() + datetime.timedelta(hours=1)
    )

    user = relationship("User", back_populates="reset_password_requests")

    def is_expired(self) -> bool:
        return self.expires_at < datetime.datetime.now()


"""
Index Price History

--- Rationale ---
It would be preferable to handle all price history data using an API, but
fetching specific dates for SPY price history is not supported by the service
being used, yfinance (Yahoo Finance SDK).

--- Purpose ---
This table will be used to store the daily price history of SPY for the purpose
of calculating the alpha of positions in a portfolio. For data that is range-bound,
such as chart data, we will continue to use the yfinance API.

--- Consistency ---
The data will be backfilled using the `backfill_daily_spy_price_history` script.
It will be updated daily using the `fetch_daily_spy_price` task.

--- Additional Notes ---
We use "Index" to refer to SPY, but this table could be used to store other
index price history data in the future, such as QQQ or DIA.
"""


class IndexPriceHistory(Base):
    __tablename__ = "index_price_history"

    date: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    ticker: Mapped[str] = mapped_column(String, nullable=False)
    open_price_cents: Mapped[int] = mapped_column(Integer, nullable=False)

    # Composite primary key
    __table_args__ = (
        PrimaryKeyConstraint("date", "ticker", name="pk_date_ticker"),
        Index("idx_index_price_history_date", "date"),
    )
