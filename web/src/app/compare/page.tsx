"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { useQuery } from "react-query";
import { useMemo, useState } from "react";
import Statistics from "@/components/Statistics";
import { SearchableSymbol, Timeframe } from "@/types";
import DateGraph from "@/components/DateGraph";
import { useSearchParams } from "next/navigation";
import CompareSearch from "@/components/CompareSearch";
import { fetchSS } from "@/lib/fetch";
import { getLineColor } from "@/lib/displayUtils";
import { round } from "lodash";
import { timeframeToHistoryString } from "@/lib/utils";
import { DEFAULT_SEARCHABLE_SYMBOL } from "@/lib/search";

const deconstructSymbol = (symbol: string): SearchableSymbol => {
  const parts = symbol.split(":");

  // STOCK:[ticker]
  if (parts.length === 2 && parts[0].toLowerCase() === "stock") {
    const ticker = parts[1].toUpperCase();
    return {
      ticker,
      name: ticker,
      type: "STOCK",
    };
  }
  // PORTFOLIO:[name]:[id]
  else if (parts.length === 3 && parts[0].toLowerCase() === "portfolio") {
    const [_, name, id] = parts;
    return {
      name,
      id: Number(id),
      type: "PORTFOLIO",
    };
  }
  return DEFAULT_SEARCHABLE_SYMBOL;
};

const symbolToString = (symbol: SearchableSymbol) => {
  return `${symbol.type}:${symbol.ticker || symbol.id}`;
};

export default function Compare() {
  const searchParams = useSearchParams();
  const left = searchParams.get("left");
  const right = searchParams.get("right");
  const [leftSymbol, setLeftSymbol] = useState<SearchableSymbol>(
    deconstructSymbol(left || ""),
  );
  const [rightSymbol, setRightSymbol] = useState<SearchableSymbol>(
    deconstructSymbol(right || ""),
  );

  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.DAY,
  );

  const queryEnabled = useMemo(() => {
    return (leftSymbol.name && rightSymbol.name) !== "";
  }, [leftSymbol.name, rightSymbol.name]);

  const queryKey = useMemo(() => {
    return ["portfolio", leftSymbol.name, rightSymbol.name, selectedTimeframe];
  }, [leftSymbol.name, rightSymbol.name, selectedTimeframe]);

  const { data, status, error } = useQuery(
    queryKey,
    () =>
      fetchSS(
        `/chart/compare?left_symbol=${symbolToString(leftSymbol)}` +
          `&right_symbol=${symbolToString(rightSymbol)}&timeframe=${selectedTimeframe}`,
      ),
    {
      enabled: queryEnabled,
    },
  );

  const leftReturn = data?.total_return_left || 0;
  const rightReturn = data?.total_return_right || 0;
  const leftAlpha = round(leftReturn - rightReturn, 2);

  const getStatusText = () => {
    if (status === "loading") {
      return "Loading...";
    }

    if (error) {
      return "An error occurred";
    }

    if (queryEnabled) {
      const alphaText = `${Math.abs(leftAlpha)}% ${leftAlpha < 0 ? "less" : "more"}`;
      return (
        <>
          {data?.left_name} has returned{" "}
          <span
            className="font-bold"
            style={{ color: getLineColor(data?.points || []) }}
          >
            {leftReturn}%
          </span>{" "}
          {timeframeToHistoryString(selectedTimeframe)}, which is{" "}
          <span className="font-bold">{alphaText}</span> than {data?.right_name}
          , which has returned{" "}
          <span className="font-bold" style={{ color: "#6366f1" }}>
            {rightReturn}%
          </span>
          .
        </>
      );
    }

    return "Enter two symbols to compare them.";
  };

  console.log(leftSymbol);

  return (
    <ContentWrapper hideFooter className="z-0">
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="h-10 flex flex-row items-end">
            <CompareSearch
              focusInput={leftSymbol.name.length === 0}
              symbol={leftSymbol.ticker || leftSymbol.name}
              onSelect={setLeftSymbol}
              textColor={getLineColor(data?.points || [])}
            />
            <span className="mx-2 text-3xl font-bold">vs</span>
            <CompareSearch
              focusInput={leftSymbol.name.length > 0}
              symbol={rightSymbol.ticker || rightSymbol.name}
              onSelect={setRightSymbol}
              textColor="#6366f1"
            />
          </div>
          <p className="text-xl">{getStatusText()}</p>
          <div className="mt-4">
            <DateGraph
              width={"100%"}
              height={500}
              data={data?.points || []}
              selectedTimeframe={selectedTimeframe}
              handleTimeframeChange={setSelectedTimeframe}
              lineWidth={3}
              animationDuration={500}
              leftLineName={data?.left_name}
              rightLineName={data?.right_name}
            />
          </div>
          <div className="mt-8"></div>
        </div>
      </div>
    </ContentWrapper>
  );
}
