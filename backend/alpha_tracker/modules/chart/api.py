from fastapi import APIRouter
from fastapi import Depends

from alpha_tracker.db.models import User
from alpha_tracker.utils.auth import get_current_user

router = APIRouter(prefix="/chart")

"""
Handle chart related operations.
"""


@router.post("/stock/{ticker}")
async def get_stock_chart(ticker: str, _: User = Depends(get_current_user)):
    """
    Get stock chart.
    """


@router.get("/portfolio/{portfolio_id}")
async def get_portfolio_chart(portfolio_id: int, _: User = Depends(get_current_user)):
    """
    Get portfolio chart.
    """


@router.get("/summary")
async def get_summary_chart(_: User = Depends(get_current_user)):
    """
    Get summary chart.
    """
