import yfinance as yf
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from alpha_tracker.api_integrations.polygon_client import rest_client
from alpha_tracker.db.models import User
from alpha_tracker.modules.chart.models import ChartResponse
from alpha_tracker.modules.chart.models import DataPoint
from alpha_tracker.utils.auth import get_current_user
from alpha_tracker.utils.polygon import timespan_to_bar
from alpha_tracker.utils.yfinance import convert_timespan_to_period


router = APIRouter(prefix="/chart")

"""
Handle chart related operations.
"""


@router.get("/stock/{ticker}/timeframe/{timespan}")
async def get_stock_chart(
    ticker: str, timespan: str, _: User = Depends(get_current_user)
):
    """
    Get stock chart.
    """

    if timespan not in ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"]:
        raise ValueError("Invalid timespan")

    bar_args = timespan_to_bar(timespan)
    portfolio_response = []
    spy_response = []

    try:
        portfolio_response = rest_client.list_aggs(
            ticker=ticker.upper(),
            timespan=bar_args.timespan,
            multiplier=bar_args.multiplier,
            from_=bar_args.from_,
            to=bar_args.to,
        )

        spy_response = rest_client.list_aggs(
            ticker="SPY",
            timespan=bar_args.timespan,
            multiplier=bar_args.multiplier,
            from_=bar_args.from_,
            to=bar_args.to,
        )
    except:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Request limit reached. Please try again later.",
        )

    portfolio_response = list(portfolio_response)
    spy_response = list(spy_response)
    start_portfolio = portfolio_response[0].close
    start_spy = spy_response[0].close

    return ChartResponse.from_data_points(
        data=[
            DataPoint.from_aggs(
                portfolio=portfolio,
                spy=spy,
                start_portfolio=start_portfolio,
                start_spy=start_spy,
                timeframe=timespan,
            )
            for portfolio, spy in zip(portfolio_response, spy_response)
        ],
        ticker=ticker,
        timespan=timespan,
    )


@router.get("/v2/stock/{ticker}/timeframe/{timespan}")
async def get_stock_chart_v2(
    ticker: str, timespan: str, _: User = Depends(get_current_user)
):
    """
    Get stock chart v2.
    """

    if timespan not in ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"]:
        raise ValueError("Invalid timespan")

    period, interval = convert_timespan_to_period(timespan)
    ticker = ticker.upper()
    data = []

    try:
        data = yf.download(
            tickers=[ticker, "SPY"] if ticker != "SPY" else ["SPY"],
            period=period,
            interval=interval,
            group_by="ticker",
            auto_adjust=True,
            prepost=True,
        ).dropna()
    except:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Request limit reached. Please try again later.",
        )

    # If we only provide one ticker, yfinance will return a DataFrame with a single level column index.
    if ticker == "SPY":
        data = {"SPY": data}

    portfolio_response = data[ticker]["Close"]
    spy_response = data["SPY"]["Close"]

    if portfolio_response.empty or spy_response.empty:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data not found.",
        )

    start_portfolio = portfolio_response.iloc[0]
    start_spy = spy_response.iloc[0]
    timestamps = portfolio_response.index

    return ChartResponse.from_data_points(
        data=[
            (
                DataPoint.from_yahoo(
                    portfolio=portfolio,
                    spy=spy,
                    start_portfolio=start_portfolio,
                    start_spy=start_spy,
                    timeframe=timespan,
                    timestamp=timestamp.to_pydatetime(),
                )
            )
            for portfolio, spy, timestamp in zip(
                portfolio_response, spy_response, timestamps
            )
        ],
        ticker=ticker,
        timespan=timespan,
    )


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
