import { Timeframe } from "@/types";

export const fmtDollars = (value: number) => {
  const isNegative = value < 0;
  return `${isNegative ? "-" : ""}$${Math.abs(value).toFixed(2)}`;
};

export const fmtPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const timeframeToDisplayString = (timeframe: Timeframe) => {
  switch (timeframe) {
    case Timeframe.DAY:
      return "Today";
    case Timeframe.WEEK:
      return "Past week";
    case Timeframe.MONTH:
      return "Past month";
    case Timeframe.QUARTER:
      return "Past quarter";
    case Timeframe.YTD:
      return "Year to date";
    case Timeframe.YEAR:
      return "Past year";
    case Timeframe.ALL:
      return "All time";
  }
};

export const displayLargeNumber = (value: number) => {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return String(value);
};
