from typing import List

from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session

from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import Portfolio
from alpha_tracker.db.models import Transaction
from alpha_tracker.db.models import User


def get_all_portfolio_transactions(
    portfolio_id: int, current_user: User
) -> List[Transaction]:

    with Session(get_sqlalchemy_engine()) as db_session:
        portfolio = (
            db_session.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        )

        if not portfolio or portfolio.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found",
            )

        return (
            db_session.query(Transaction)
            .filter(Transaction.portfolio_id == portfolio.id)
            .order_by(Transaction.purchased_at.asc(), Transaction.created_at.asc())
            .all()
        )
