from datetime import datetime


def convert_timeframe_to_period(timeframe: str):
    if timeframe == "1D":
        return "1d", "5m"
    elif timeframe == "1W":
        return "5d", "30m"
    elif timeframe == "1M":
        return "1mo", "90m"
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


def interval_from_start_date(start_date: datetime):
    today = datetime.now()
    delta = today - start_date

    if delta.days < 2:
        return "5m"
    elif delta.days < 7:
        return "30m"
    elif delta.days < 30:
        return "90m"
    elif delta.days < 365:
        return "1d"
    else:
        return "1w"


def format_date(date: datetime, timeframe: str):
    if timeframe == "1D":
        return date.strftime("%-I:%M %p")
    elif timeframe == "1W":
        return date.strftime("%m/%d %-I:%M %p")
    else:
        return date.strftime("%m/%d/%Y")
