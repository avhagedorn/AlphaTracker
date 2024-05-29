from datetime import datetime


def convert_timeframe_to_period(timeframe: str):
    if timeframe == "1D":
        return "1d", "5m"
    elif timeframe == "1W":
        return "5d", "30m"
    elif timeframe == "1M":
        return "1mo", "1h"
    elif timeframe == "3M":
        return "3mo", "1d"
    elif timeframe == "YTD":
        return "ytd", "1d"
    elif timeframe == "1Y":
        return "1y", "1d"
    elif timeframe == "ALL":
        return "max", "1wk"
    else:
        raise ValueError("Invalid timeframe")


def format_date(date: datetime, timeframe: str):
    if timeframe == "1D":
        return date.strftime("%-I:%M %p")
    elif timeframe == "1W":
        return date.strftime("%m/%d %-I:%M %p")
    else:
        return date.strftime("%m/%d/%Y")
