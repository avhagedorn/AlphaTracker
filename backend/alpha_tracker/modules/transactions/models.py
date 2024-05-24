from typing import List

from pydantic import BaseModel

from alpha_tracker.db.models import Transaction


class TransactionType(BaseModel):
    BUY = "BUY"
    SELL = "SELL"


class CreateTransactionRequest(BaseModel):
    shares: float
    price: float
    ticker: str
    portfolio_id: int
    purchased_at: str
    type: TransactionType


class DisplayTransaction(BaseModel):
    id: int
    shares: float
    price: float
    ticker: str
    portfolio_id: int
    type: TransactionType
    created_at: str
    purchased_at: str

    @staticmethod
    def from_db(transaction: Transaction):
        return Transaction(
            id=transaction.id,
            shares=transaction.shares,
            price=transaction.price,
            ticker=transaction.ticker,
            portfolio_id=transaction.portfolio_id,
            type=transaction.type,
            created_at=transaction.created_at,
            purchased_at=transaction.purchased_at,
        )


class GetTransactionsResponse(BaseModel):
    transactions: List[Transaction]
    page: int
    total_pages: int
    page_size: int
