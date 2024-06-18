export interface UserResponse {
  username: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

export interface PositionRow {
  ticker: string;
  shares: number;
  equity_value: number;
  return_percent: number;
  return_value: number;
  alpha_percent: number;
  alpha_value: number;
  realized_value: number;
  realized_alpha: number;
}

export interface GraphData {
  date: string;
  left: number;
  right: number;
}

export enum Timeframe {
  DAY = "1D",
  WEEK = "1W",
  MONTH = "1M",
  QUARTER = "3M",
  YTD = "YTD",
  YEAR = "1Y",
  ALL = "ALL",
}

export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  chart: {
    points: GraphData[];
    last_price: number;
    total_return: number;
    total_return_percent: number;
    total_return_spy: number;
    total_return_percent_spy: number;
  };
}

export interface TransactionItem {
  id: number;
  date: string;
  ticker: string;
  shares: number;
  price: number;
  type: string;
  portfolio_id: number;
}

export interface SearchableSymbol {
  id?: number;
  ticker?: string;
  name: string;
  type: "STOCK" | "PORTFOLIO" | "UNDEFINED";
}
