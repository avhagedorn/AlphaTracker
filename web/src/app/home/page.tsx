"use client";

import PositionsTable from "@/components/PositionsTable";
import PriceChange from "@/components/PriceChange";
import { useEffect, useState } from "react";
import demoData from "../../public/demoData/dummyGraph.json";
import DateGraph from "@/components/DateGraph";
import { Timeframe } from "@/types";
import StrategyList from "@/components/StrategyList";
import ContentWrapper from "@/components/ContentWrapper";

export default function Home() {
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.DAY);
  const [data, setData] = useState(demoData);

  useEffect(() => {
    setData([...demoData]);
  }, [timeframe]);

  return (
    <ContentWrapper hideFooter>
      <div className="flex min-h-screen flex-col items-center">
        <div className="flex w-screen">
          <div className="flex-1 p-8">
            <h1 className="text-6xl font-bold mb-4">$4,034.65</h1>
            <PriceChange
              percentChange={0.1}
              valueChange={1000}
              subText="Today"
            />
            <PriceChange
              percentChange={-0.05}
              valueChange={-500}
              subText="Alpha"
            />

            <div className="flex mt-8">
              <DateGraph
                data={data}
                width={"100%"}
                height={300}
                animationDuration={500}
                lineWidth={3}
                selectedTimeframe={timeframe}
                handleTimeframeChange={(timeframe) => setTimeframe(timeframe)}
              />
            </div>

            <div className="mt-8">
              <PositionsTable
                data={[
                  {
                    ticker: "AAPL",
                    shares: 1000,
                    equity_value: 1000,
                    return_percent: 0.1,
                    return_value: 100,
                    alpha_percent: 0.05,
                    alpha_value: 50,
                    realized_alpha: 0,
                    realized_value: 0,
                  },
                  {
                    ticker: "GOOGL",
                    shares: 2000,
                    equity_value: 2000,
                    return_percent: 0.2,
                    return_value: 400,
                    alpha_percent: 0.1,
                    alpha_value: 200,
                    realized_alpha: 0,
                    realized_value: 0,
                  },
                  {
                    ticker: "MSFT",
                    shares: 1500,
                    equity_value: 1500,
                    return_percent: 0.15,
                    return_value: 225,
                    alpha_percent: 0.075,
                    alpha_value: 112.5,
                    realized_alpha: 0,
                    realized_value: 0,
                  },
                ]}
              />
            </div>
          </div>

          <div className="w-[500px] min-w-[500px] min-h-screen p-8 border-l-2 border-gray-300">
            <StrategyList />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
