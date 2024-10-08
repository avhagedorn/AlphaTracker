"use client";

import React, { useEffect, useState } from "react";
import demoData from "../../../public/demoData/dummyGraph.json";
import ContentWrapper from "@/components/ContentWrapper";
import PriceChange from "@/components/PriceChange";
import DateGraph from "@/components/DateGraph";
import { Timeframe, TransactionItem } from "@/types";
import TransactionsTable from "@/components/TransactionsTable";
import Statistics from "@/components/Statistics";
import { useQuery } from "react-query";
import { fetchSS } from "@/lib/fetch";
import {
  fmtLargeNumber,
  fmtDollars,
  timeframeToDisplayString,
} from "@/lib/utils";
import FiftyTwoWeekPriceChart from "@/components/FiftyTwoWeekPriceChart";
import TruncatedText from "@/components/TruncatedText";
import { FiExternalLink } from "react-icons/fi";
import { LuArrowRightLeft } from "react-icons/lu";
import { ReferenceDot } from "recharts";
import FadeIn from "@/components/FadeIn";

const transactionsToDots = (
  transactions: TransactionItem[],
  timeframe: Timeframe,
) => {
  const transfromDate = (date: string) => {
    // date format is YYYY-MM-DD
    if (
      timeframe === Timeframe.DAY &&
      date === new Date().toISOString().slice(0, 10)
    ) {
      return "9:30 AM";
    } else if (timeframe === Timeframe.WEEK || timeframe === Timeframe.MONTH) {
      // Want MM-DD 9:30 AM
      const [year, month, day] = date.split("-");
      return `${month}/${day} 9:30 AM`;
    } else {
      // Want MM/DD/YYYY
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    }
  };

  return transactions.map((transaction) => (
    <FadeIn key={transaction.id}>
      <ReferenceDot
        key={transaction.id}
        x={transfromDate(transaction.date)}
        y={transaction.price}
        xAxisId={0}
        r={4}
        fill={transaction.type === "BUY" ? "#00C853" : "#FF1744"}
        ifOverflow="discard"
      />
    </FadeIn>
  ));
};

export default function Stock({
  params,
}: {
  params: {
    ticker: string;
  };
}) {
  const [price, setPrice] = useState<number>(0);
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

  const {
    data: transactionsData,
    status: transactionsStatus,
    error: transactionsError,
  } = useQuery(["transactions", params.ticker], () =>
    fetchSS(`/transactions/stock/${params.ticker}`),
  );

  useEffect(() => {
    if (status === "success") {
      setPrice(data?.last_price || 0);
    }
  }, [setPrice, status, data]);

  return (
    <ContentWrapper hideFooter>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">
                {params.ticker.toUpperCase()}
                {stats?.company_name ? ` - ${stats?.company_name}` : ""}
              </h1>
              {status === "loading" && (
                <div className="shimmer h-16 w-32 mb-4" />
              )}
              {status === "success" && (
                <h1 className="text-6xl font-bold mb-4">{fmtDollars(price)}</h1>
              )}
              {status === "error" && (
                <h1 className="text-6xl font-bold mb-4">Error, please retry</h1>
              )}
            </div>
            <div>
              <div className="flex flex-col items-start">
                <button
                  onClick={() => {
                    window.location.href = `/compare?left=stock:${params.ticker}`;
                  }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-center text-lg">
                    <LuArrowRightLeft className="mr-2" size={18} />
                    Compare
                  </div>
                </button>
              </div>
            </div>
          </div>
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
          <div className="mt-4">
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
                width={"100%"}
                height={300}
                data={data?.points || demoData}
                lineWidth={3}
                leftLineName={params.ticker.toUpperCase()}
                animationDuration={500}
                selectedTimeframe={selectedTimeframe}
                handleTimeframeChange={(timeframe) =>
                  setSelectedTimeframe(timeframe)
                }
                handleHoverChart={(hoverPrice) => {
                  setPrice(hoverPrice ?? data?.last_price ?? 0);
                }}
              >
                {...transactionsToDots(
                  transactionsData?.transactions || [],
                  selectedTimeframe,
                )}
              </DateGraph>
            )}
          </div>
          <div className="mt-8">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Company</h1>
              {stats?.website && (
                <a href={stats?.website} target="_blank">
                  <FiExternalLink size={18} />
                </a>
              )}
            </div>
            {statsStatus === "loading" && (
              <div className="shimmer h-24 w-full mb-4" />
            )}
            {statsStatus === "success" && (
              <TruncatedText text={stats?.description} />
            )}

            <div className="mt-8">
              <h1 className="text-2xl font-bold">Statistics</h1>
              <Statistics
                loading={statsStatus === "loading"}
                cards={[
                  {
                    title: "Financials",
                    statistics: [
                      {
                        title: "Market Cap",
                        value: fmtLargeNumber(stats?.market_cap),
                      },
                      {
                        title: "EPS",
                        value: stats?.eps,
                      },
                      {
                        title: "Dividend Yield",
                        value: `${stats?.dividend_yield}%`,
                        tooltip:
                          "The dividend yield is the annual dividend income per " +
                          "share divided by the price per share.",
                      },
                      {
                        title: "Revenue Growth (YoY)",
                        value: `${stats?.revenue_growth}%`,
                      },
                    ],
                  },
                  {
                    title: "Valuation",
                    statistics: [
                      {
                        title: "PE Ratio",
                        value: stats?.pe_ratio,
                        tooltip:
                          "The price-to-earnings (P/E) ratio is the ratio for " +
                          "valuing a company that measures its current share price " +
                          "relative to its per-share earnings.",
                      },
                      {
                        title: "Forward PE",
                        value: stats?.forward_pe,
                        tooltip:
                          "The forward price-to-earnings (P/E) ratio is a variation of " +
                          "the P/E ratio that uses forecasted earnings for the P/E calculation.",
                      },
                      {
                        title: "EV to EBITDA",
                        value: stats?.ev_to_ebitda,
                        tooltip:
                          "The EV/EBITDA ratio is a valuation metric used to compare a " +
                          "company's enterprise value to its earnings before interest, " +
                          "taxes, depreciation, and amortization.",
                      },
                      {
                        title: "52W Range",
                        value: (
                          <FiftyTwoWeekPriceChart
                            low={stats?.fifty_two_week_low}
                            high={stats?.fifty_two_week_high}
                            current={data?.last_price}
                          />
                        ),
                      },
                    ],
                  },
                  {
                    title: "Ratios",
                    statistics: [
                      {
                        title: "Short Ratio",
                        value: stats?.short_ratio,
                        tooltip:
                          "The short ratio is the number of shares sold short divided by " +
                          "the average daily volume. It's used to determine how long it will " +
                          "take short sellers, on average, to cover their positions.",
                      },
                      {
                        title: "PEG Ratio",
                        value: stats?.peg_ratio,
                        tooltip:
                          "The PEG ratio is a valuation metric for determining the relative " +
                          "trade-off between the price of a stock, the earnings generated per " +
                          "share (EPS), and the company's expected growth.",
                      },
                      {
                        title: "Beta",
                        value: stats?.beta,
                        tooltip:
                          "Beta is a measure of a stock's volatility in relation to the market.",
                      },
                    ],
                  },
                  {
                    title: "Margins",
                    statistics: [
                      {
                        title: "Gross Margins",
                        value: `${stats?.gross_margins}%`,
                        tooltip:
                          "The gross margin represents the percentage of total revenue that the " +
                          "company retains after incurring the direct costs associated with " +
                          "producing the goods and services sold by the company.",
                      },
                      {
                        title: "Operating Margins",
                        value: `${stats?.operating_margins}%`,
                        tooltip:
                          "The operating margin measures how much profit a company makes on a " +
                          "dollar of sales after paying for variable costs of production, such " +
                          "as wages and raw materials, but before paying interest or tax.",
                      },
                      {
                        title: "Profit Margins",
                        value: `${stats?.profit_margins}%`,
                        tooltip:
                          "The profit margin is a ratio of a company's profit (sales minus all " +
                          "expenses) divided by its revenue.",
                      },
                    ],
                  },
                  {
                    title: "Profitability",
                    statistics: [
                      {
                        title: "Free Cash Flow Yield",
                        value: `${stats?.fcf_yield}%`,
                        tooltip:
                          "The free cash flow yield is a financial ratio that measures a " +
                          "company's ability to generate free cash flow relative to its " +
                          "market capitalization.",
                      },
                      {
                        title: "Return on Equity",
                        value: `${stats?.return_on_equity}%`,
                        tooltip:
                          "Return on equity (ROE) is a measure of financial performance calculated " +
                          "by dividing net income by shareholders' equity.",
                      },
                      {
                        title: "Return on Assets",
                        value: `${stats?.return_on_assets}%`,
                        tooltip:
                          "Return on assets (ROA) is an indicator of how profitable a company is " +
                          "relative to its total assets.",
                      },
                    ],
                  },
                  {
                    title: "Debt",
                    statistics: [
                      {
                        title: "Cash",
                        value: `$${fmtLargeNumber(stats?.cash)}`,
                      },
                      {
                        title: "Debt",
                        value: `$${fmtLargeNumber(stats?.debt)}`,
                      },
                      {
                        title: "Current Ratio",
                        value: stats?.current_ratio,
                        tooltip:
                          "The current ratio is a liquidity ratio that measures a company's ability to pay short-term obligations or those due within one year.",
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
          <div className="mt-8">
            <TransactionsTable
              isLoading={transactionsStatus === "loading"}
              transactions={transactionsData?.transactions || []}
              ticker={params.ticker}
              displayDelete
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
