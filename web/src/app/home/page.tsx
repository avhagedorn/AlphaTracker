"use client";

import PortfolioModal from "@/components/PortfolioModal";
import PositionsTable from "@/components/PositionsTable";
import PriceChange from "@/components/PriceChange";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import demoData from "../../public/demo-data.json";
import DateGraph from "@/components/DateGraph";
import { Timeframe } from "@/types";
import StrategyList from "@/components/StrategyList";
import ContentWrapper from "@/components/ContentWrapper";

export default function Home() {
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.DAY);
  const [data, setData] = useState(demoData);
  const queryClient = useQueryClient();

  useEffect(() => {
    setData([...demoData]);
  }, [timeframe]);

  return (
    <ContentWrapper userIsAuthenticated>
      <div className="flex min-h-screen flex-col items-center">
        <PortfolioModal
          isOpen={showPortfolioModal}
          setIsOpen={setShowPortfolioModal}
          onSubmit={() => {
            queryClient.invalidateQueries("portfolios");
          }}
        />

        <div className="flex w-screen">
          <div className="flex-1 p-8">
            <h1 className="text-6xl font-bold mb-4">$40,034.65</h1>
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
                width={1400}
                height={300}
                animationDuration={500}
                lineWidth={3}
                selectedTimeframe={timeframe}
                handleTimeframeChange={(timeframe) => setTimeframe(timeframe)}
              />
            </div>

            <PositionsTable
              data={[
                {
                  ticker: "AAPL",
                  equity: 1000,
                  equityValueDollars: 1000,
                  return: 0.1,
                  returnValueDollars: 100,
                  alpha: 0.05,
                  alphaValueDollars: 50,
                },
                {
                  ticker: "GOOGL",
                  equity: 2000,
                  equityValueDollars: 2000,
                  return: 0.2,
                  returnValueDollars: 400,
                  alpha: 0.1,
                  alphaValueDollars: 200,
                },
                {
                  ticker: "MSFT",
                  equity: 1500,
                  equityValueDollars: 1500,
                  return: 0.15,
                  returnValueDollars: 225,
                  alpha: 0.075,
                  alphaValueDollars: 112.5,
                },
              ]}
            />
          </div>

          <div className="w-[500px] min-w-[500px] min-h-screen p-8 border-l-2 border-gray-300">
            <StrategyList
              timeframe={timeframe}
              handleOpenPortfolioModal={() => setShowPortfolioModal(true)}
            />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
