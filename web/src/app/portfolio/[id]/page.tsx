"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { fetchSS } from "@/lib/fetch";
import dynamic from "next/dynamic";
import { useQuery, useQueryClient } from "react-query";
import demoData from "../../../public/demo-data.json";
import PriceChange from "@/components/PriceChange";
import Button from "@/components/Button";
import { FiEdit2, FiPlus } from "react-icons/fi";
import TransactionsTable from "@/components/TransactionsTable";
import PortfolioModal from "@/components/PortfolioModal";
import { useState } from "react";
import Statistics from "@/components/Statistics";
import { Timeframe } from "@/types";
import DateGraph from "@/components/DateGraph";
import CreateTransactionModal from "@/components/CreateTransactionModal";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => <div className="h-full w-full shimmer"></div>,
});

export default function PortfolioDetail({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { data, status, error, isFetching } = useQuery("portfolio", () =>
    fetchSS(`/portfolio/${params.id}`),
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.DAY,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createTransactionModalOpen, setCreateTransactionModalOpen] =
    useState(false);
  const queryClient = useQueryClient();

  if (isFetching) {
    return null;
  }

  if (status === "error") {
    return <div>{String(error)}</div>;
  }

  return (
    <ContentWrapper userIsAuthenticated>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{data.name}</h1>
              <h1 className="text-6xl font-bold mb-4">$180.41</h1>
            </div>
            <div>
              <div className="flex flex-col items-start">
                <button className="mt-4" onClick={() => setEditModalOpen(true)}>
                  <div className="flex items-center justify-center text-lg">
                    <FiEdit2 className="mr-2" size={18} />
                    Edit
                  </div>
                </button>
              </div>
            </div>
          </div>
          <PriceChange percentChange={0.1} valueChange={10} subText="Today" />
          <PriceChange percentChange={-0.05} valueChange={-5} subText="Alpha" />
          <div className="mt-4">
            <DateGraph
              width={1000}
              height={300}
              data={demoData}
              selectedTimeframe={selectedTimeframe}
              handleTimeframeChange={setSelectedTimeframe}
              lineWidth={3}
              animationDuration={500}
            />
          </div>
          {data.description && (
            <>
              <h2 className="text-2xl font-bold mt-8">Investment Thesis</h2>
              <p className="text-lg mb-4">{data.description}</p>
            </>
          )}
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
                date: "2021-09-01",
                ticker: "AAPL",
                shares: 10,
                price: 150.0,
                type: "BUY",
              },
              {
                id: 2,
                date: "2021-09-02",
                ticker: "AAPL",
                shares: 5,
                price: 160.0,
                type: "SELL",
              },
            ]}
            onDelete={(id) => console.log("delete", id)}
          />
        </div>
      </div>
      <PortfolioModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        onSubmit={() => {
          queryClient.invalidateQueries("portfolio");
        }}
        existingPortfolio={data}
      />
      <CreateTransactionModal
        isOpen={createTransactionModalOpen}
        setIsOpen={setCreateTransactionModalOpen}
        onSubmit={() => {}}
        portfolioId={params.id}
      />
    </ContentWrapper>
  );
}
