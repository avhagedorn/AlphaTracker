from typing import Optional

from pydantic import BaseModel

from alpha_tracker.db.models import Portfolio


class CreatePortfolioRequest(BaseModel):
    name: str
    description: Optional[str] = None


class DisplayPortfolio(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    cash: float
    created_at: str

    @classmethod
    def from_db(cls, portfolio: Portfolio):
        return cls(
            id=portfolio.id,
            name=portfolio.name,
            cash=round(portfolio.cash_in_cents / 100, 2),
            description=portfolio.description,
            created_at=str(portfolio.created_at),
        )


class ListPortfoliosResponse(BaseModel):
    portfolios: list[DisplayPortfolio]
    strategy_display_option: int
