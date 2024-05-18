export interface UserResponse {
  username: string;
  email: string;
  created_at: string;
  is_admin: boolean;
}

export interface PositionRow {
  ticker: string;
  equity: number;
  equityValueDollars: number;
  return: number;
  returnValueDollars: number;
  alpha: number;
  alphaValueDollars: number;
}

export interface GraphData {
  date: string;
  spy: number;
  portfolio: number;
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
}
