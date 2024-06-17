from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session

from alpha_tracker.api_integrations.polygon_client import rest_client
from alpha_tracker.api_integrations.yfinance_client import yf_download
from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import IndexPriceHistory
from alpha_tracker.db.models import User
from alpha_tracker.modules.chart.models import ChartResponse
from alpha_tracker.modules.chart.models import CompareChartResponse
from alpha_tracker.modules.chart.models import CompareDataPoint
from alpha_tracker.modules.chart.models import DataPoint
from alpha_tracker.modules.common import get_all_portfolio_transactions
from alpha_tracker.utils.auth import get_current_user
from alpha_tracker.utils.polygon import timeframe_to_bar
from alpha_tracker.utils.time import split_by_date
from alpha_tracker.utils.validation import get_start_from_timeframe
from alpha_tracker.utils.validation import is_valid_compare_symbol
from alpha_tracker.utils.validation import is_valid_timeframe
from alpha_tracker.utils.yfinance import convert_timeframe_to_period
from alpha_tracker.utils.yfinance import interval_from_start_date


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
        data = yf_download(
            tickers=[ticker, "SPY"],
            period=period,
            interval=interval,
        )
    except Exception:
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
            data = yf_download(
                tickers=list(tickers),
                period=period,
                interval=interval,
            )

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
    except:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Request limit reached. Please try again later.",
        )


@router.get("/portfolio/{portfolio_id}")
async def get_portfolio_chart(
    portfolio_id: int, timeframe: str, current_user: User = Depends(get_current_user)
):
    if not is_valid_timeframe(timeframe):
        raise ValueError("Invalid timeframe")

    transactions = get_all_portfolio_transactions(portfolio_id, current_user)

    if not transactions:
        return ChartResponse()

    # Step 1: Get all the data points for the timeframe
    tickers = list(set(["SPY", *[transaction.ticker for transaction in transactions]]))

    # Step 2: Get all SPY data points for each transaction
    spy_date_to_price = {}
    with Session(get_sqlalchemy_engine()) as db_session:
        spy_prices = (
            db_session.query(IndexPriceHistory)
            .filter(IndexPriceHistory.ticker == "SPY")
            .filter(
                IndexPriceHistory.date.in_(
                    [transaction.purchased_at.date() for transaction in transactions]
                )
            )
            .all()
        )
        spy_date_to_price = {
            price.date.date(): price.open_price_cents for price in spy_prices
        }

    # Step 3: Get all holdings from before the start of the timeframe
    initial_holdings = {}
    timeframe_start = get_start_from_timeframe(timeframe)
    pre_timeframe_transactions, timeframe_transactions = split_by_date(
        transactions, timeframe_start.date()
    )
    cash_holding_cents = 0
    initial_spy_shares = 0
    cost_basis_cents = 0

    for transaction in pre_timeframe_transactions:
        shares = initial_holdings.get(transaction.ticker, 0)
        current_spy_price = spy_date_to_price.get(transaction.purchased_at.date())
        transaction_cost = transaction.quantity * transaction.price_cents

        if transaction.transaction_type == "BUY":
            initial_holdings[transaction.ticker] = shares + transaction.quantity
            initial_spy_shares += transaction_cost // current_spy_price
            cost_basis_cents += max(0, transaction_cost - cash_holding_cents)
            cash_holding_cents = max(0, cash_holding_cents - transaction_cost)
        else:
            initial_holdings[transaction.ticker] = shares - transaction.quantity
            cash_holding_cents += transaction_cost

    # Step 4: Get all the data points for the timeframe
    ticker_data = []
    timestamps = []

    try:
        period, _ = convert_timeframe_to_period(timeframe)
        interval_start_timestamp = get_start_from_timeframe(timeframe)

        if (
            period == "max"
            and interval_start_timestamp.date()
            < timeframe_transactions[0].purchased_at.date()
        ):
            interval_start_timestamp = timeframe_transactions[0].purchased_at

        interval = interval_from_start_date(interval_start_timestamp)
        data = yf_download(
            tickers=tickers, interval=interval, start=interval_start_timestamp
        )

        timestamps = data[tickers[0]].index
        ticker_to_prices = {ticker: data[ticker]["Close"] for ticker in tickers}
        ticker_data = [
            {
                **dict(zip(ticker_to_prices.keys(), values)),
                "timestamp": timestamp.date(),
            }
            for values, timestamp in zip(zip(*ticker_to_prices.values()), timestamps)
        ]

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Request limit reached. Please try again later.",
        )

    # Step 5: Calculate the portfolio value for each data point in the timeframe
    portfolio_value = []
    cost_basis_value = []
    spy_value = []
    timeframe_transactions_index = 0
    for data_point in ticker_data:
        if timeframe_transactions_index < len(timeframe_transactions):
            transaction = timeframe_transactions[timeframe_transactions_index]
            if data_point["timestamp"] >= transaction.purchased_at.date():
                shares = initial_holdings.get(transaction.ticker, 0)
                current_spy_price = spy_date_to_price.get(
                    transaction.purchased_at.date()
                )
                transaction_cost = transaction.quantity * transaction.price_cents

                if transaction.transaction_type == "BUY":
                    initial_holdings[transaction.ticker] = shares + transaction.quantity
                    initial_spy_shares += transaction_cost // current_spy_price
                    cost_basis_cents += max(0, transaction_cost - cash_holding_cents)
                    cash_holding_cents = max(0, cash_holding_cents - transaction_cost)
                else:
                    initial_holdings[transaction.ticker] = shares - transaction.quantity
                    cash_holding_cents += transaction_cost

                timeframe_transactions_index += 1
        portfolio_value.append(
            sum(
                [
                    initial_holdings[ticker] * data_point[ticker]
                    for ticker in initial_holdings.keys()
                ]
            )
            + cash_holding_cents / 100
        )
        spy_value.append(initial_spy_shares * data_point["SPY"])
        cost_basis_value.append(cost_basis_cents / 100)

    for idx, value in enumerate(cost_basis_value):
        if value < cost_basis_cents / 100:
            cost_basis_diff = cost_basis_cents / 100 - cost_basis_value[idx]
            portfolio_value[idx] += cost_basis_diff
            spy_value[idx] += cost_basis_diff

    # Round to the nearest cent
    portfolio_value = [round(value, 2) for value in portfolio_value]
    spy_value = [round(value, 2) for value in spy_value]

    return ChartResponse.from_data_points(
        data=[
            DataPoint.from_yahoo(
                portfolio=portfolio,
                spy=spy,
                start_portfolio=cost_basis_cents,
                start_spy=cost_basis_cents,
                timeframe=timeframe,
                timestamp=timestamp,
                scale_spy_to_portfolio=False,
            )
            for portfolio, spy, timestamp in zip(portfolio_value, spy_value, timestamps)
        ],
        ticker="Portfolio",
        timeframe=timeframe,
    )


@router.get("/summary")
async def get_summary_chart(_: User = Depends(get_current_user)):
    """
    Get summary chart.
    """
