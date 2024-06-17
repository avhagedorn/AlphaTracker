import re
from datetime import datetime
from datetime import timedelta


def is_valid_email(email: str) -> bool:
    return re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email) is not None


def is_valid_timeframe(timeframe: str) -> bool:
    return timeframe in ["1D", "1W", "1M", "3M", "YTD", "1Y", "ALL"]


def get_start_from_timeframe(timeframe: str) -> datetime:
    return datetime.now() - _timeframe_to_timedelta(timeframe)


def _timeframe_to_timedelta(timeframe: str) -> timedelta:
    if timeframe == "1D":
        return timedelta(days=1)
    if timeframe == "1W":
        return timedelta(weeks=1)
    if timeframe == "1M":
        return timedelta(weeks=4)
    if timeframe == "3M":
        return timedelta(weeks=12)
    if timeframe == "YTD":
        return timedelta(weeks=datetime.now().isocalendar()[1])
    if timeframe == "1Y":
        return timedelta(weeks=52)
    if timeframe == "ALL":
        return datetime.now() - datetime(1970, 1, 1)


def is_valid_compare_symbol(symbol: str) -> bool:
    stock_pattern = r"^STOCK:[a-zA-Z]+$"
    portfolio_pattern = r"^PORTFOLIO:\d+$"

    return (
        re.match(stock_pattern, symbol) is not None
        or re.match(portfolio_pattern, symbol) is not None
    )
