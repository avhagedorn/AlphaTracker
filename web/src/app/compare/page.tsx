"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { useQuery, useQueryClient } from "react-query";
import { useMemo, useState } from "react";
import Statistics from "@/components/Statistics";
import { Timeframe } from "@/types";
import DateGraph from "@/components/DateGraph";
import { useSearchParams } from "next/navigation";
import CompareSearch from "@/components/CompareSearch";
import { fetchSS } from "@/lib/fetch";
import { getLineColor } from "@/lib/displayUtils";
import { round } from "lodash";
import { timeframeToHistoryString } from "@/lib/utils";

const deconstructSymbol = (symbol: string) => {
  const [type, name] = symbol.split(":");

  if (type === "stock") {
    return {
      name: name.toUpperCase(),
      type: "STOCK",
    };
  } else if (type === "portfolio") {
    return {
      name,
      type: "PORTFOLIO",
    };
  } else {
    return {
      name: "",
      type: "",
    };
  }
};

interface Symbol {
  id?: string;
  name: string;
  type: string;
}

const symbolToString = (symbol: Symbol) => {
  return `${symbol.type}:${symbol.name}`;
};

export default function Compare() {
  const searchParams = useSearchParams();
  const left = searchParams.get("left");
  const right = searchParams.get("right");
  const [leftSymbol, setLeftSymbol] = useState<Symbol>(
    deconstructSymbol(left || ""),
  );
  const [rightSymbol, setRightSymbol] = useState<Symbol>(
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

  const queryClient = useQueryClient();
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

  const leftName = data?.left_ticker || data?.left_portfolio_name;
  const rightName = data?.right_ticker || data?.right_portfolio_name;
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
          {leftName} has returned{" "}
          <span
            className="font-bold"
            style={{ color: getLineColor(data?.points || []) }}
          >
            {leftReturn}%
          </span>{" "}
          {timeframeToHistoryString(selectedTimeframe)}, which is{" "}
          <span className="font-bold">{alphaText}</span> than {rightName}, which
          has returned{" "}
          <span className="font-bold" style={{ color: "#6366f1" }}>
            {rightReturn}%
          </span>
          .
        </>
      );
    }

    return "Enter two symbols to compare them.";
  };

  return (
    <ContentWrapper hideFooter>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="h-10 flex flex-row items-end">
            <CompareSearch
              focusInput={leftSymbol.name.length === 0}
              symbol={leftSymbol.name}
              onSelect={(symbol) => {
                setLeftSymbol(deconstructSymbol(symbol));
              }}
              textColor={getLineColor(data?.points || [])}
            />
            <span className="mx-2 text-3xl font-bold">vs</span>
            <CompareSearch
              focusInput={leftSymbol.name.length > 0}
              symbol={rightSymbol.name}
              onSelect={(symbol) => setRightSymbol(deconstructSymbol(symbol))}
              textColor="#6366f1"
            />
          </div>
          <p className="text-xl">{getStatusText()}</p>
          <div className="mt-4">
            <DateGraph
              width={"100%"}
              height={300}
              data={data?.points || []}
              selectedTimeframe={selectedTimeframe}
              handleTimeframeChange={setSelectedTimeframe}
              lineWidth={3}
              animationDuration={500}
              leftLineName={data?.left_ticker || data?.left_portfolio_name}
              rightLineName={data?.right_ticker || data?.right_portfolio_name}
            />
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Statistics</h1>
            <Statistics
              cards={[
                {
                  title: "Financials",
                  statistics: [
                    { title: "Market Cap", value: "1.2T" },
                    { title: "PE Ratio", value: "30.0" },
                    { title: "Dividend Yield", value: "0.50%" },
                  ],
                },
                {
                  title: "The Greeks",
                  statistics: [
                    { title: `Alpha (${selectedTimeframe})`, value: "0.8" },
                    { title: `Beta (${selectedTimeframe})`, value: "1.2" },
                  ],
                },
                {
                  title: "Statistics",
                  statistics: [
                    { title: "Market Cap", value: "1.2T" },
                    { title: "PE Ratio", value: "30.0" },
                  ],
                },
                {
                  title: "The Greeks",
                  statistics: [
                    { title: `Alpha (${selectedTimeframe})`, value: "0.8" },
                    { title: `Beta (${selectedTimeframe})`, value: "1.2" },
                  ],
                },
              ]}
              hideViewMorePrompt
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
