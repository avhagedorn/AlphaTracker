from typing import Optional

from pydantic import BaseModel


class CreatePortfolioRequest(BaseModel):
    name: str
    description: Optional[str] = None


class DisplayPortfolio(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: str

    @classmethod
    def from_db(cls, portfolio):
        return cls(
            id=portfolio.id,
            name=portfolio.name,
            description=portfolio.description,
            created_at=str(portfolio.created_at),
        )


class ListPortfoliosResponse(BaseModel):
    portfolios: list[DisplayPortfolio]
    strategy_display_option: int
