from pydantic import BaseModel


class StockStatisticsResponse(BaseModel):
    company_name: str
    website: str
    description: str
    market_cap: float
    dividend_yield: float
    fifty_two_week_high: float
    fifty_two_week_low: float
    beta: float
    eps: float
    pe_ratio: float
    forward_pe: float
