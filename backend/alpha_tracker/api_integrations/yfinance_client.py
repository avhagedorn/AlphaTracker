from datetime import datetime
from typing import List
from typing import Optional

import yfinance as yf
from pyrate_limiter import Duration
from pyrate_limiter import Limiter
from pyrate_limiter import RequestRate
from requests import Session
from requests_cache import CacheMixin
from requests_cache import SQLiteCache
from requests_ratelimiter import LimiterMixin
from requests_ratelimiter import MemoryQueueBucket
from yfinance import Ticker


class CachedLimiterSession(CacheMixin, LimiterMixin, Session):
    pass


session = CachedLimiterSession(
    limiter=Limiter(
        RequestRate(5, Duration.SECOND * 5)
    ),  # max 5 requests per 5 seconds
    bucket_class=MemoryQueueBucket,
    backend=SQLiteCache("yfinance.cache"),
)


def yf_ticker(ticker):
    return Ticker(ticker, session=session)


def yf_download(
    tickers: List[str],
    period: Optional[str] = None,
    interval: str = "1d",
    start: Optional[datetime] = None,
    prepost: bool = True,
):
    data = yf.download(
        tickers=list(set(tickers)),
        period=period,
        interval=interval,
        prepost=prepost,
        start=start,
        group_by="ticker",
        auto_adjust=True,
        progress=False,
        session=session,
    ).dropna()

    if len(tickers) == 1:
        return {tickers[0]: data}
    else:
        return data
