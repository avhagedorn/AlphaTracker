"use client";

import React, { useState } from "react";
import demoData from "../../../public/demo-data.json";
import ContentWrapper from "@/components/ContentWrapper";
import PriceChange from "@/components/PriceChange";
import DateGraph from "@/components/DateGraph";
import { Timeframe } from "@/types";
import Button from "@/components/Button";
import TransactionsTable from "@/components/TransactionsTable";
import { FiPlus } from "react-icons/fi";
import Statistics from "@/components/Statistics";
import CreateTransactionModal from "@/components/CreateTransactionModal";

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

  return (
    <ContentWrapper userIsAuthenticated>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <h1 className="text-3xl font-bold mb-4">
            {params.ticker.toUpperCase()}
          </h1>
          <h1 className="text-6xl font-bold mb-4">$180.41</h1>
          <PriceChange percentChange={0.1} valueChange={10} subText="Today" />
          <PriceChange percentChange={-0.05} valueChange={-5} subText="Alpha" />
          <div className="w-[1000px] mt-4">
            <DateGraph
              width={1000}
              height={300}
              data={demoData}
              lineWidth={3}
              animationDuration={500}
              selectedTimeframe={selectedTimeframe}
              handleTimeframeChange={(timeframe) =>
                setSelectedTimeframe(timeframe)
              }
            />
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold">Company</h1>
            <p className="text-lg">
              Google is a multinational corporation that is specialized in
              internet-related services and products. These include search,
              cloud computing, software, and online advertising technologies.
              Google is a subsidiary of Alphabet Inc.
            </p>

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
              />
            </div>
          </div>
          <div className="mt-8">
            <TransactionsTable ticker={params.ticker} displayDelete />
          </div>
        </div>
      </div>
      <CreateTransactionModal
        isOpen={createTransactionModalOpen}
        setIsOpen={setCreateTransactionModalOpen}
        onSubmit={() => {}}
        ticker={params.ticker}
      />
    </ContentWrapper>
  );
}
