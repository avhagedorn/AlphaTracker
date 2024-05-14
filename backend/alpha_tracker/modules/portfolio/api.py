from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from requests import Session

from alpha_tracker.db.models import Portfolio, User
from alpha_tracker.utils.auth import get_current_user
from alpha_tracker.modules.portfolio.models import CreatePortfolioRequest, DisplayPortfolio
from alpha_tracker.db.engine import get_sqlalchemy_engine

router = APIRouter(prefix="/portfolio")

"""
Handle user management.
"""

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.post("/new")
async def create_portfolio(
    data: Annotated[CreatePortfolioRequest, Depends()],
    current_user: User = Depends(get_current_user)
):
    """
    Create a new portfolio.
    """
    with Session(get_sqlalchemy_engine()) as db_session:
        portfolio = Portfolio(
            user_id=current_user.id,
            name=data.name,
            description=data.description,
        )
        db_session.add(portfolio)
        db_session.commit()
        return DisplayPortfolio.from_db(portfolio)


@router.get("/list")
async def list_portfolios(
    current_user: User = Depends(get_current_user)
):
    """
    List all portfolios for the current user.
    """
    with Session(get_sqlalchemy_engine()) as db_session:
        portfolios = db_session \
                        .query(Portfolio) \
                        .filter_by(user_id=current_user.id) \
                        .order_by(Portfolio.created_at.desc()) \
                        .all()

        return [DisplayPortfolio.from_db(portfolio) for portfolio in portfolios]


@router.get("/get/{portfolio_id}")
async def get_portfolio(
    portfolio_id: int,
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific portfolio.
    """
    with Session(get_sqlalchemy_engine()) as db_session:
        portfolio = db_session \
                        .query(Portfolio) \
                        .filter_by(id=portfolio_id, user_id=current_user.id) \
                        .first()

        if not portfolio:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found",
            )

        return DisplayPortfolio.from_db(portfolio)
