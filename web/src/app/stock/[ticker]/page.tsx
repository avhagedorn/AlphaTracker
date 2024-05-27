"use client";

import React, { useState } from "react";
import demoData from "../../../public/demo-data.json";
import ContentWrapper from "@/components/ContentWrapper";
import PriceChange from "@/components/PriceChange";
import DateGraph from "@/components/DateGraph";
import { Timeframe } from "@/types";
import TransactionsTable from "@/components/TransactionsTable";
import Statistics from "@/components/Statistics";
import CreateTransactionModal from "@/components/CreateTransactionModal";
import { useQuery } from "react-query";
import { fetchSS } from "@/lib/fetch";
import {
  displayLargeNumber,
  fmtDollars,
  timeframeToDisplayString,
} from "@/lib/utils";
import StockPriceChart from "@/components/StockPriceChart";
import TruncatedText from "@/components/TruncatedText";
import { toast } from "react-toastify";

export default function Stock({
  params,
}: {
  params: {
    ticker: string;
  };
}) {
  const [createTransactionModalOpen, setCreateTransactionModalOpen] =
    useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.DAY,
  );

  const { data, status, error } = useQuery(
    ["stock", params.ticker, selectedTimeframe],
    () =>
      fetchSS(
        `/chart/v2/stock/${params.ticker}/timeframe/${selectedTimeframe}`,
      ),
    {
      enabled: !!selectedTimeframe,
    },
  );

  const {
    data: stats,
    status: statsStatus,
    error: statsError,
  } = useQuery(["stats", params.ticker], () =>
    fetchSS(`/statistics/stock/${params.ticker}`),
  );

  return (
    <ContentWrapper userIsAuthenticated>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <h1 className="text-3xl font-bold mb-4">
            {params.ticker.toUpperCase()}
            {stats?.company_name ? ` - ${stats?.company_name}` : ""}
          </h1>
          {status === "loading" && <div className="shimmer h-16 w-32 mb-4" />}
          {status === "success" && (
            <h1 className="text-6xl font-bold mb-4">
              {fmtDollars(data?.last_price || 0)}
            </h1>
          )}
          {status === "error" && (
            <h1 className="text-6xl font-bold mb-4">Error</h1>
          )}
          <PriceChange
            loading={status === "loading"}
            percentChange={data?.total_return_percent || 0}
            valueChange={data?.total_return || 0}
            subText={timeframeToDisplayString(selectedTimeframe)}
          />
          <PriceChange
            loading={status === "loading"}
            percentChange={
              data?.total_return_percent - data?.total_return_percent_spy || 0
            }
            valueChange={data?.total_return - data?.total_return_spy || 0}
            subText="Alpha"
          />
          <div className="w-[1000px] mt-4">
            {status === "loading" && (
              <div className="shimmer h-[300px] w-full" />
            )}
            {status === "error" && (
              <div className="h-[300px] w-full flex items-center justify-center text-red-500">
                {String(error)}
              </div>
            )}
            {status === "success" && (
              <DateGraph
                width={1000}
                height={300}
                data={data?.points || demoData}
                lineWidth={3}
                lineName={params.ticker.toUpperCase()}
                animationDuration={500}
                selectedTimeframe={selectedTimeframe}
                handleTimeframeChange={(timeframe) =>
                  setSelectedTimeframe(timeframe)
                }
              />
            )}
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Company</h1>
            {statsStatus === "loading" && (
              <div className="shimmer h-24 w-full mb-4" />
            )}
            {statsStatus === "success" && (
              <TruncatedText text={stats?.description} />
            )}

            <div className="mt-8">
              <h1 className="text-2xl font-bold">Statistics</h1>
              <Statistics
                cards={[
                  {
                    title: "Financials",
                    statistics: [
                      {
                        title: "Market Cap",
                        value: displayLargeNumber(stats?.market_cap),
                      },
                      {
                        title: "EPS",
                        value: stats?.eps,
                      },
                      {
                        title: "Dividend Yield",
                        value: stats?.dividend_yield || "N/A",
                      },
                    ],
                  },
                  {
                    title: "Price",
                    statistics: [
                      { title: "PE Ratio", value: stats?.pe_ratio },
                      { title: "Forward PE", value: stats?.forward_pe },
                      {
                        title: "52W Range",
                        value: (
                          <StockPriceChart
                            low={stats?.fifty_two_week_low}
                            high={stats?.fifty_two_week_high}
                            current={data?.last_price}
                          />
                        ),
                      },
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
              />
            </div>
          </div>
          <div className="mt-8">
            <TransactionsTable ticker={params.ticker} displayDelete />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
