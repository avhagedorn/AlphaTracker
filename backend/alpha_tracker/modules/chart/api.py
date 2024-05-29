import yfinance as yf
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status

from alpha_tracker.api_integrations.polygon_client import rest_client
from alpha_tracker.db.models import User
from alpha_tracker.modules.chart.models import ChartResponse
from alpha_tracker.modules.chart.models import CompareChartResponse
from alpha_tracker.modules.chart.models import CompareDataPoint
from alpha_tracker.modules.chart.models import DataPoint
from alpha_tracker.utils.auth import get_current_user
from alpha_tracker.utils.polygon import timeframe_to_bar
from alpha_tracker.utils.validation import is_valid_compare_symbol
from alpha_tracker.utils.validation import is_valid_timeframe
from alpha_tracker.utils.yfinance import convert_timeframe_to_period


router = APIRouter(prefix="/chart")

"""
Handle chart related operations.
"""


@router.get("/stock/{ticker}/timeframe/{timeframe}")
async def get_stock_chart(
    ticker: str, timeframe: str, _: User = Depends(get_current_user)
):
    """
    Get stock chart.
    """

    if not is_valid_timeframe(timeframe):
        raise ValueError("Invalid timeframe")

    bar_args = timeframe_to_bar(timeframe)
    portfolio_response = []
    spy_response = []

    try:
        portfolio_response = rest_client.list_aggs(
            ticker=ticker.upper(),
            timeframe=bar_args.timeframe,
            multiplier=bar_args.multiplier,
            from_=bar_args.from_,
            to=bar_args.to,
        )

        spy_response = rest_client.list_aggs(
            ticker="SPY",
            timeframe=bar_args.timeframe,
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
                timeframe=timeframe,
            )
            for portfolio, spy in zip(portfolio_response, spy_response)
        ],
        ticker=ticker,
        timeframe=timeframe,
    )


@router.get("/v2/stock/{ticker}/timeframe/{timeframe}")
async def get_stock_chart_v2(
    ticker: str, timeframe: str, _: User = Depends(get_current_user)
):
    """
    Get stock chart v2.
    """

    if not is_valid_timeframe(timeframe):
        raise ValueError("Invalid timeframe")

    period, interval = convert_timeframe_to_period(timeframe)
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
                    timeframe=timeframe,
                    timestamp=timestamp.to_pydatetime(),
                )
            )
            for portfolio, spy, timestamp in zip(
                portfolio_response, spy_response, timestamps
            )
        ],
        ticker=ticker,
        timeframe=timeframe,
    )


@router.get("/compare")
async def compare(
    left_symbol: str,
    right_symbol: str,
    timeframe: str,
    _: User = Depends(get_current_user),
):

    if not is_valid_compare_symbol(left_symbol) or not is_valid_compare_symbol(
        right_symbol
    ):
        raise ValueError("Invalid symbol")

    if not is_valid_timeframe(timeframe):
        raise ValueError("Invalid timeframe")

    period, interval = convert_timeframe_to_period(timeframe)

    left_symbol_type, left_symbol = left_symbol.split(":")
    right_symbol_type, right_symbol = right_symbol.split(":")

    left_data = []
    right_data = []

    try:
        left_ticker = None
        right_ticker = None
        left_portfolio_name = None
        right_portfolio_name = None

        tickers = set()
        if left_symbol_type == "STOCK":
            tickers.add(left_symbol)
            left_ticker = left_symbol
        if right_symbol_type == "STOCK":
            tickers.add(right_symbol)
            right_ticker = right_symbol

        if left_symbol_type == "PORTFOLIO":
            # TODO
            left_data = []
        if right_symbol_type == "PORTFOLIO":
            # TODO
            right_data = []

        if tickers:
            data = yf.download(
                tickers=list(tickers),
                period=period,
                interval=interval,
                group_by="ticker",
                auto_adjust=True,
                prepost=True,
            ).dropna()

            if left_symbol == right_symbol:
                left_data = data["Close"]
                right_data = data["Close"]
            else:
                left_data = data[left_symbol]["Close"]
                right_data = data[right_symbol]["Close"]

            zipped_data = zip(left_data, right_data, left_data.index)
            start_left, start_right = left_data.iloc[0], right_data.iloc[0]

            return CompareChartResponse.from_data_points(
                data=[
                    CompareDataPoint.from_api(
                        left=left,
                        right=right,
                        timestamp=timestamp,
                        timeframe=timeframe,
                        start_left=start_left,
                        start_right=start_right,
                    )
                    for left, right, timestamp in zipped_data
                ],
                timeframe=timeframe,
                left_ticker=left_ticker,
                right_ticker=right_ticker,
                left_portfolio_name=left_portfolio_name,
                right_portfolio_name=right_portfolio_name,
            )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Request limit reached. Please try again later.",
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
