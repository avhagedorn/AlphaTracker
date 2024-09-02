import { Timeframe } from "@/types";

export const fmtDollars = (value: number) => {
  const isNegative = value < 0;
  let displayNumber = Math.abs(value).toFixed(2);
  if (Math.abs(value) >= 10_000) {
    displayNumber = fmtLargeNumber(Math.abs(value));
  }
  return `${isNegative ? "-" : ""}$${displayNumber}`;
};

export const prepNumber = (value: number) => {
  const isNegative = value < 0;
  const displayNumber = Math.abs(value).toFixed(2);
  const [digits, remainder] = displayNumber.split(".");
  const [digitList, remainderList] = [digits.split(""), remainder.split("")];
  return {
    isNegative,
    digitList,
    remainderList,
  };
};

export const fmtPercent = (value: number) => {
  return `${value.toFixed(2)}%`;
};

export const timeframeToDisplayString = (timeframe: Timeframe) => {
  const timeframeMap: Record<Timeframe, string> = {
    [Timeframe.DAY]: "Today",
    [Timeframe.WEEK]: "Past week",
    [Timeframe.MONTH]: "Past month",
    [Timeframe.QUARTER]: "Past three months",
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
    [Timeframe.QUARTER]: "over the past three months",
    [Timeframe.YTD]: "year-to-date",
    [Timeframe.YEAR]: "over the past year",
    [Timeframe.ALL]: "across all time",
  };
  return timeframeMap[timeframe] || "Invalid timeframe";
};

export const fmtLargeNumber = (value?: number) => {
  if (!value) {
    return String();
  }

  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  return `${value?.toFixed(2)}`;
};
