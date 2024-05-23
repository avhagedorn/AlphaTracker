"use client";

import React, { useState } from "react";
import demoData from "../../../public/demo-data.json";
import ContentWrapper from "@/components/ContentWrapper";
import PriceChange from "@/components/PriceChange";
import DateGraph from "@/components/DateGraph";
import { Timeframe } from "@/types";
import ViewMore from "@/components/ViewMore";
import Button from "@/components/Button";
import TransactionsTable from "@/components/TransactionsTable";
import { FiPlus } from "react-icons/fi";
import Statistics from "@/components/Statistics";
import CreateTransactionModal from "@/components/CreateTransactionModal";

const StatisticsCard = ({
  title,
  statistics,
}: {
  title: string;
  statistics: {
    title: string;
    value: string;
  }[];
}) => (
  <div className="flex flex-col flex-grow px-8 py-4 shadow-lg border border-gray-100">
    <h1 className="text-2xl font-bold">{title}</h1>
    {statistics.map(({ title, value }) => (
      <div key={title} className="flex flex-row justify-between">
        <h1 className="text-lg font-bold">{title}</h1>
        <h1 className="text-lg">{value}</h1>
      </div>
    ))}
  </div>
);

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
            <div className="flex justify-between items-center mt-8">
              <h2 className="text-2xl font-bold">Transactions</h2>
              <Button
                className="font-sm"
                onClick={() => setCreateTransactionModalOpen(true)}
              >
                <div className="flex items-center justify-center">
                  <FiPlus className="mr-2" size={24} />
                  Add
                </div>
              </Button>
            </div>
            <TransactionsTable
              data={[
                {
                  id: 1,
                  ticker: params.ticker,
                  date: "2021-01-01",
                  shares: 10,
                  price: 100,
                  type: "Buy",
                },
                {
                  id: 2,
                  ticker: params.ticker,
                  date: "2021-01-02",
                  shares: 20,
                  price: 200,
                  type: "Sell",
                },
                {
                  id: 3,
                  ticker: params.ticker,
                  date: "2021-01-03",
                  shares: 30,
                  price: 300,
                  type: "Buy",
                },
              ]}
            />
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
