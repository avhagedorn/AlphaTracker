from pydantic import BaseModel


class SearchResult(BaseModel):
    name: str
    ticker: str
