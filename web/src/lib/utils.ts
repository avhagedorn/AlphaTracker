import { Timeframe } from "@/types";

export const fmtDollars = (value: number) => {
  const isNegative = value < 0;
  return `${isNegative ? "-" : ""}$${Math.abs(value).toFixed(2)}`;
};

export const fmtPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const timeframeToDisplayString = (timeframe: Timeframe) => {
  const timeframeMap: Record<Timeframe, string> = {
    [Timeframe.DAY]: "Today",
    [Timeframe.WEEK]: "Past week",
    [Timeframe.MONTH]: "Past month",
    [Timeframe.QUARTER]: "Past quarter",
    [Timeframe.YTD]: "Year to date",
    [Timeframe.YEAR]: "Past year",
    [Timeframe.ALL]: "All time",
  };

  return timeframeMap[timeframe] || "Invalid timeframe";
};

export const timeframeToHistoryString = (timeframe: Timeframe) => {
  const timeframeMap: Record<Timeframe, string> = {
    [Timeframe.DAY]: "over the past day",
    [Timeframe.WEEK]: "over the past week",
    [Timeframe.MONTH]: "over the past month",
    [Timeframe.QUARTER]: "over the past quarter",
    [Timeframe.YTD]: "year-to-date",
    [Timeframe.YEAR]: "over the past year",
    [Timeframe.ALL]: "across all time",
  };
  return timeframeMap[timeframe] || "Invalid timeframe";
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
