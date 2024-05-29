"use client";

import React from "react";
import ViewMore from "@/components/ViewMore";
import Tooltip from "./Tooltip";

interface StatsticsCardProps {
  title: string;
  statistics: {
    title: string;
    value: JSX.Element | string;
    tooltip?: string;
  }[];
  loading?: boolean;
}

const StatisticsCard = ({ title, statistics, loading }: StatsticsCardProps) => (
  <div className="flex flex-col flex-grow px-8 py-4 shadow-lg border border-gray-100">
    <h1 className="text-2xl font-bold">{title}</h1>
    {statistics.map(({ title, value, tooltip }) => (
      <div key={title} className="flex flex-row justify-between">
        <div className="flex flex-row items-center space-x-2">
          <h1 className="text-lg font-bold">{title}</h1>
          {tooltip && <Tooltip text={tooltip} />}
        </div>
        {loading ? (
          <div className="w-1/4 h-6 mb-2 bg-gray-200 rounded-md animate-pulse"></div>
        ) : value instanceof String ? (
          <h1 className="w-1/2 text-lg text-right">{value}</h1>
        ) : (
          <div className="w-1/2 flex justify-end items-center">{value}</div>
        )}
      </div>
    ))}
  </div>
);

interface StatisticsCard {
  title: string;
  statistics: {
    title: string;
    value: JSX.Element | string;
    tooltip?: string;
  }[];
}

interface StatisticsProps {
  cards: StatisticsCard[];
  loading?: boolean;
  hideViewMorePrompt?: boolean;
}

export default function Statistics({
  cards,
  loading,
  hideViewMorePrompt,
}: StatisticsProps) {
  const displayCount = 2;
  const moreCards = cards.slice(displayCount);
  const displayedCards = cards.slice(0, displayCount);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
        {displayedCards.map((card) => (
          <StatisticsCard
            key={card.title}
            title={card.title}
            statistics={card.statistics}
            loading={loading}
          />
        ))}
      </div>
      {hideViewMorePrompt && moreCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
          {moreCards.map((card) => (
            <StatisticsCard
              key={card.title}
              title={card.title}
              statistics={card.statistics}
              loading={loading}
            />
          ))}
        </div>
      )}
      {!hideViewMorePrompt && moreCards && (
        <ViewMore>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
            {moreCards.map((card) => (
              <StatisticsCard
                key={card.title}
                title={card.title}
                statistics={card.statistics}
                loading={loading}
              />
            ))}
          </div>
        </ViewMore>
      )}
    </>
  );
}
