from datetime import datetime

from polygon.rest.models.aggs import Agg
from pydantic import BaseModel


class DataPoint(BaseModel):
    date: str
    portfolio: float
    spy: float
    portfolio_percent_change: float
    spy_percent_change: float

    @staticmethod
    def from_aggs(
        portfolio: Agg,
        spy: Agg,
        timeframe: str,
        start_portfolio: float = 0.0,
        start_spy: float = 0.0,
    ):
        scaleSpy = start_portfolio / start_spy

        return DataPoint(
            date=DataPoint._format_date(
                datetime.fromtimestamp(portfolio.timestamp / 1000),
                timeframe,
            ),
            portfolio=portfolio.close,
            spy=round(spy.close * scaleSpy, 2),
            portfolio_percent_change=round(
                ((portfolio.close - start_portfolio) / start_portfolio) * 100, 2
            ),
            spy_percent_change=round(
                (((spy.close * scaleSpy) - start_spy) / start_spy) * 100, 2
            ),
        )

    @staticmethod
    def from_yahoo(
        portfolio: float,
        spy: float,
        timestamp: int,
        timeframe: str,
        start_portfolio: float = 0.0,
        start_spy: float = 0.0,
    ):
        scaleSpy = start_portfolio / start_spy

        return DataPoint(
            date=DataPoint._format_date(
                timestamp,
                timeframe,
            ),
            portfolio=round(portfolio, 2),
            spy=round(spy * scaleSpy, 2),
            portfolio_percent_change=round(
                ((portfolio - start_portfolio) / start_portfolio) * 100, 2
            ),
            spy_percent_change=round(
                (((spy * scaleSpy) - start_spy) / start_spy) * 100, 2
            ),
        )

    @staticmethod
    def _format_date(date: datetime, timeframe: str):
        if timeframe == "1D":
            return date.strftime("%-I:%M %p")
        elif timeframe == "1W":
            return date.strftime("%m/%d %-I:%M %p")
        else:
            return date.strftime("%m/%d/%Y")


class ChartResponse(BaseModel):
    points: list[DataPoint]
    ticker: str
    timespan: str
    last_price: float
    total_return: float
    total_return_percent: float
    total_return_spy: float
    total_return_percent_spy: float

    @staticmethod
    def from_data_points(data: list[DataPoint], ticker: str, timespan: str):
        start_portfolio = data[0].portfolio
        start_spy = data[0].spy

        return ChartResponse(
            points=data,
            ticker=ticker,
            timespan=timespan,
            total_return=round((data[-1].portfolio - start_portfolio), 2),
            total_return_percent=round(
                ((data[-1].portfolio - start_portfolio) / start_portfolio) * 100, 2
            ),
            total_return_spy=round((data[-1].spy - start_spy), 2),
            total_return_percent_spy=round(
                ((data[-1].spy - start_spy) / start_spy) * 100, 2
            ),
            last_price=round(data[-1].portfolio, 2),
        )
