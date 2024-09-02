"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { fetchSS } from "@/lib/fetch";
import { useQuery, useQueryClient } from "react-query";
import demoData from "../../../public/demoData/dummyGraph.json";
import PriceChange from "@/components/PriceChange";
import { FiEdit2 } from "react-icons/fi";
import TransactionsTable from "@/components/TransactionsTable";
import PortfolioModal from "@/components/PortfolioModal";
import { useEffect, useState } from "react";
import { Timeframe } from "@/types";
import DateGraph from "@/components/DateGraph";
import PositionsTable from "@/components/PositionsTable";
import ExercisedPositionsTable from "@/components/ExercisedPositionsTable";
import { fmtDollars, timeframeToDisplayString } from "@/lib/utils";
import { LuArrowRightLeft } from "react-icons/lu";

export default function PortfolioDetail({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const [price, setPrice] = useState<number>(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(
    Timeframe.DAY,
  );

  const { data, status, error, isFetching } = useQuery("portfolio", () =>
    fetchSS(`/portfolio/${params.id}`),
  );

  const {
    data: positions,
    status: positionsStatus,
    error: positionsError,
  } = useQuery("positions", () => fetchSS(`/positions/${params.id}`));

  const {
    data: chartData,
    status: chartStatus,
    error: chartError,
  } = useQuery(["chart", selectedTimeframe], () =>
    fetchSS(`/chart/portfolio/${params.id}?timeframe=${selectedTimeframe}`),
  );

  const {
    data: transactionsData,
    status: transactionsStatus,
    error: transactionsError,
  } = useQuery("transactions", () =>
    fetchSS(`/transactions/portfolio/${params.id}`),
  );

  useEffect(() => {
    setPrice(chartData?.last_price ?? 0);
    console.log(chartStatus, chartData?.last_price ?? 0, chartData);
  }, [setPrice, chartStatus, chartData]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const queryClient = useQueryClient();

  if (isFetching) {
    return null;
  }

  if (status === "error") {
    return <div>{String(error)}</div>;
  }

  return (
    <ContentWrapper hideFooter>
      <div className="flex flex-col items-center">
        <div className="w-1/2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{data.name}</h1>
              {chartStatus === "loading" && (
                <div className="shimmer h-16 w-32 mb-4" />
              )}
              {chartStatus === "success" && (
                <h1 className="text-6xl font-bold mb-4">{fmtDollars(price)}</h1>
              )}
            </div>
            <div>
              <div className="flex flex-col items-start">
                <button
                  onClick={() => {
                    window.location.href = `/compare?left=portfolio:${data.name}:${params.id}`;
                  }}
                  className="mt-4"
                >
                  <div className="flex items-center justify-center text-lg">
                    <LuArrowRightLeft className="mr-2" size={18} />
                    Compare
                  </div>
                </button>
                <button className="mt-4" onClick={() => setEditModalOpen(true)}>
                  <div className="flex items-center justify-center text-lg">
                    <FiEdit2 className="mr-2" size={18} />
                    Edit
                  </div>
                </button>
              </div>
            </div>
          </div>
          <PriceChange
            loading={chartStatus === "loading"}
            percentChange={chartData?.total_return_percent || 0}
            valueChange={chartData?.total_return || 0}
            subText={timeframeToDisplayString(selectedTimeframe)}
          />
          <PriceChange
            loading={chartStatus === "loading"}
            percentChange={
              chartData?.total_return_percent -
                chartData?.total_return_percent_spy || 0
            }
            valueChange={
              chartData?.total_return - chartData?.total_return_spy || 0
            }
            subText="Alpha"
          />
          <div className="mt-4">
            <DateGraph
              width={"100%"}
              height={300}
              data={chartData?.points || demoData}
              selectedTimeframe={selectedTimeframe}
              handleTimeframeChange={setSelectedTimeframe}
              lineWidth={3}
              animationDuration={500}
              handleHoverChart={(hoverPrice) => {
                setPrice(hoverPrice ?? chartData?.last_price ?? 0);
              }}
            />
          </div>
          {data.description && (
            <>
              <h2 className="text-2xl font-bold mt-8">Investment Thesis</h2>
              <p className="text-lg mb-4">{data.description}</p>
            </>
          )}
          <PositionsTable
            data={positions || []}
            loading={positionsStatus === "loading"}
            className="mt-8"
          />
          <ExercisedPositionsTable
            data={positions || []}
            loading={positionsStatus === "loading"}
            className="mt-8"
          />
          <div className="mt-8">
            <TransactionsTable
              isLoading={transactionsStatus === "loading"}
              transactions={transactionsData?.transactions || []}
              portfolioId={params.id}
              displayTicker
              displayDelete
            />
          </div>
        </div>
      </div>
      <PortfolioModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        onSubmit={() => queryClient.invalidateQueries("portfolio")}
        existingPortfolio={data}
      />
    </ContentWrapper>
  );
}
