from typing import List

from polygon import RESTClient
from polygon import WebSocketClient

from alpha_tracker.configs import POLYGON_API_KEY

rest_client = RESTClient(api_key=POLYGON_API_KEY)


def get_ws_client(subscriptions: List[str]):
    subscriptions = [f"T.{ticker_symbol.upper()}" for ticker_symbol in subscriptions]
    return WebSocketClient(api_key=POLYGON_API_KEY, subscriptions=subscriptions)
