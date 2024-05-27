import requests
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from alpha_tracker.db.models import User
from alpha_tracker.modules.search.models import SearchResult
from alpha_tracker.utils.auth import get_current_user

router = APIRouter(prefix="/search")

"""
Handle search related operations.
"""


@router.get("/stock")
async def search(q: str = "", _: User = Depends(get_current_user)):
    """
    Search for a stock.
    """

    if not q:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing query parameter",
        )

    # TODO: Add this to the yfinance library
    # Pull request: https://github.com/ranaroussi/yfinance/pull/1949
    response = requests.get(
        "https://query1.finance.yahoo.com/v1/finance/search",
        params={"q": q, "newsCount": 0, "quotesCount": 5, "enableFuzzyQuery": False},
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
        },
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch data",
        )

    quotes = [
        (
            SearchResult(
                ticker=quote["symbol"],
                name=quote["shortname"],
            )
            if quote.get("quoteType") == "EQUITY"
            else None
        )
        for quote in response.json().get("quotes", [])
    ]

    return [quote for quote in quotes if quote]
