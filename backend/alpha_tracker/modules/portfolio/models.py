from typing import Optional
from pydantic import BaseModel

class CreatePortfolioRequest(BaseModel):
    name: str
    description: Optional[str] = None

class DisplayPortfolio(BaseModel):
    name: str
    description: Optional[str] = None
    created_at: str

    @classmethod
    def from_db(cls, portfolio):
        return cls(
            name=portfolio.name,
            description=portfolio.description,
            created_at=str(portfolio.created_at)
        )
