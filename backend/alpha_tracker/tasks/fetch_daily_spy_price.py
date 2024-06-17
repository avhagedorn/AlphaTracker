from datetime import datetime
from datetime import timedelta

from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from alpha_tracker.api_integrations.yfinance_client import yf_download
from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import IndexPriceHistory


def fetch_daily_spy_price():
    data = yf_download(
        tickers="SPY",
        start=(datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
    )

    if data.empty:
        return

    with Session(get_sqlalchemy_engine()) as db_session:
        try:
            db_session.add(
                IndexPriceHistory(
                    date=data.index[0],
                    open_price_cents=int(data["Open"].iloc[0] * 100),
                    ticker="SPY",
                )
            )
            db_session.commit()
        except IntegrityError:
            pass
        except Exception as e:
            raise e
