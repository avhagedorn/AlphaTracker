def convert_timespan_to_period(timespan: str):
    if timespan == "1D":
        return "1d", "5m"
    elif timespan == "1W":
        return "5d", "30m"
    elif timespan == "1M":
        return "1mo", "1h"
    elif timespan == "3M":
        return "3mo", "1d"
    elif timespan == "YTD":
        return "ytd", "1d"
    elif timespan == "1Y":
        return "1y", "1d"
    elif timespan == "ALL":
        return "max", "1wk"
    else:
        raise ValueError("Invalid timespan")
