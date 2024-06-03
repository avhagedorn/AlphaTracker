from collections import defaultdict
from typing import List

import yfinance as yf
from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from sqlalchemy.orm import Session

from alpha_tracker.db.engine import get_sqlalchemy_engine
from alpha_tracker.db.models import IndexPriceHistory
from alpha_tracker.db.models import Portfolio
from alpha_tracker.db.models import Transaction
from alpha_tracker.db.models import User
from alpha_tracker.modules.positions.models import PortfolioPosition
from alpha_tracker.utils.auth import get_current_user

router = APIRouter(prefix="/positions")

"""
Handle position queries.
"""


@router.get("/")
async def all_positions(
    current_user: User = Depends(get_current_user),
) -> List[PortfolioPosition]:
    """
    Aggregates all a user's positions by examining their transaction history.
    """
    transactions = []

    with Session(get_sqlalchemy_engine()) as db_session:
        transactions = (
            db_session.query(Transaction)
            .filter(Transaction.user_id == current_user.id)
            .group_by(Transaction.ticker)
            .all()
        )
        db_session.close()

    try:
        return _transactions_to_positions(transactions)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to fetch positions"
        )


@router.get("/{portfolio_id}")
async def create_transaction(
    portfolio_id: int, current_user: User = Depends(get_current_user)
) -> List[PortfolioPosition]:
    """
    Aggregates all a portfolio's positions by examining the associated transaction history.
    """
    transactions = []

    with Session(get_sqlalchemy_engine()) as db_session:
        portfolio = (
            db_session.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        )

        if not portfolio or portfolio.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found",
            )

        transactions = portfolio.transactions

    if transactions:
        try:
            ticker_dict = defaultdict(list)
            for transaction in transactions:
                ticker_dict[transaction.ticker].append(transaction)
            transactions_grouped_by_ticker = list(ticker_dict.values())
            return _transactions_to_positions(transactions_grouped_by_ticker)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to fetch positions",
            )

    else:
        return []


def _get_last_prices(tickers: List[str]):
    tickers_with_spy = list(set([*tickers, "SPY"]))
    prices = yf.download(
        tickers=tickers_with_spy,
        period="1d",
        interval="1d",
        group_by="ticker",
        auto_adjust=True,
        prepost=True,
        progress=False,
    ).dropna()

    return {ticker: prices[ticker]["Close"] for ticker in tickers_with_spy}


def _transactions_to_positions(transations_grouped_by_ticker: List[List[Transaction]]):
    tickers = [transactions[0].ticker for transactions in transations_grouped_by_ticker]
    last_prices = _get_last_prices(tickers)

    with Session(get_sqlalchemy_engine()) as db_session:

        def transactions_to_position(transactions: List[Transaction]):
            transaction_dates = [
                transaction.purchased_at.date() for transaction in transactions
            ]

            spy_prices = (
                db_session.query(IndexPriceHistory)
                .filter(IndexPriceHistory.ticker == "SPY")
                .filter(IndexPriceHistory.date.in_(transaction_dates))
                .all()
            )

            spy_date_to_price = {
                price.date.strftime("%Y-%m-%d"): price.open_price_cents
                for price in spy_prices
            }

            shares = 0
            spy_shares = 0
            cost_basis_cents = 0

            realized_value_cents = 0
            realized_alpha_cents = 0

            print("spy_date_to_price", spy_date_to_price)
            print("transaction_dates", transaction_dates)

            for transaction in transactions:
                shares_delta = transaction.quantity
                spy_price_cents = spy_date_to_price.get(
                    transaction.purchased_at.strftime("%Y-%m-%d")
                )

                print("shares", shares)
                print("spy_price_cents", spy_price_cents)

                spy_shares_delta = (
                    spy_shares * (shares_delta / shares)
                    if spy_shares
                    else (transaction.price_cents * shares_delta) / spy_price_cents
                )

                if transaction.transaction_type == "BUY":
                    # The average price of the shares bought
                    cost_basis_cents_delta = transaction.price_cents * shares_delta

                    shares += shares_delta
                    cost_basis_cents += cost_basis_cents_delta
                    spy_shares += spy_shares_delta

                elif transaction.transaction_type == "SELL":
                    # The average price of the shares sold
                    cost_basis_cents_delta = (cost_basis_cents / shares) * shares_delta

                    realized_value_cents += (
                        transaction.price_cents * shares_delta
                    ) - cost_basis_cents_delta
                    realized_alpha_cents += realized_value_cents - (
                        (spy_price_cents * spy_shares_delta) - cost_basis_cents_delta
                    )

                    shares -= shares_delta
                    cost_basis_cents -= cost_basis_cents_delta
                    spy_shares -= spy_shares_delta

            print("cost_basis_cents", cost_basis_cents)

            ticker = transactions[0].ticker
            ticker_current_price_cents = last_prices[ticker].iloc[0] * 100
            spy_current_price_cents = last_prices["SPY"].iloc[0] * 100

            ticker_current_equity_value_cents = int(shares * ticker_current_price_cents)
            ticker_return_percent = (
                ticker_current_equity_value_cents / cost_basis_cents
            ) * 100 - 100
            ticker_return_cents = ticker_current_equity_value_cents - cost_basis_cents

            spy_current_equity_value_cents = int(spy_shares * spy_current_price_cents)
            spy_return_percent = (
                spy_current_equity_value_cents / cost_basis_cents
            ) * 100 - 100
            spy_return_cents = spy_current_equity_value_cents - cost_basis_cents

            return PortfolioPosition(
                ticker=ticker,
                shares=shares,
                equity_value=round(ticker_current_equity_value_cents / 100, 2),
                return_percent=round(ticker_return_percent, 2),
                return_value=round(ticker_return_cents / 100, 2),
                alpha_percent=round((ticker_return_percent - spy_return_percent), 2),
                alpha_value=round((ticker_return_cents - spy_return_cents) / 100, 2),
                realized_value=round(realized_value_cents / 100, 2),
                realized_alpha=round(realized_alpha_cents / 100, 2),
            )

    # return map(transactions_to_position, transations_grouped_by_ticker)

    return [
        transactions_to_position(transactions)
        for transactions in transations_grouped_by_ticker
    ]
