from fastapi import APIRouter
from fastapi import Depends
from yfinance import Ticker

from alpha_tracker.db.models import User
from alpha_tracker.modules.statistics.modules import StockStatisticsResponse
from alpha_tracker.utils.auth import get_current_user

router = APIRouter(prefix="/statistics")

"""
Handle company and portfolio statistics related operations.
"""


@router.get("/stock/{ticker}")
async def get_stock_statistics(ticker: str, _: User = Depends(get_current_user)):
    """
    Get stock statistics.
    """

    ticker = Ticker(ticker)
    info = ticker.info

    return StockStatisticsResponse(
        website=info.get("website") or "",
        description=info.get("longBusinessSummary")
        or info.get("longDescription")
        or "",
        market_cap=info.get("marketCap") or 0,
        fifty_two_week_high=round(info.get("fiftyTwoWeekHigh") or 0, 2),
        fifty_two_week_low=round(info.get("fiftyTwoWeekLow") or 0, 2),
        dividend_yield=round(info.get("dividendYield") or 0, 2),
        beta=round(info.get("beta") or 0, 2),
        eps=round(info.get("trailingEps") or 0, 2),
        pe_ratio=round(info.get("trailingPE") or 0, 2),
        forward_pe=round(info.get("forwardPE") or 0, 2),
        company_name=info.get("longName") or "",
    )


@router.get("/portfolio/{portfolio_id}")
async def get_portfolio_statistics(
    portfolio_id: int, _: User = Depends(get_current_user)
):
    """
    Get portfolio statistics.
    """
