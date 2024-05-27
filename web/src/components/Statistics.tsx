"use client";

import React from "react";
import ViewMore from "@/components/ViewMore";

const StatisticsCard = ({
  title,
  statistics,
}: {
  title: string;
  statistics: {
    title: string;
    value: JSX.Element | string;
  }[];
}) => (
  <div className="flex flex-col flex-grow px-8 py-4 shadow-lg border border-gray-100">
    <h1 className="text-2xl font-bold">{title}</h1>
    {statistics.map(({ title, value }) => (
      <div key={title} className="flex flex-row justify-between">
        <h1 className="text-lg font-bold">{title}</h1>
        {value instanceof String ? (
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
  }[];
}

interface StatisticsProps {
  cards: StatisticsCard[];
}

export default function Statistics({ cards }: StatisticsProps) {
  const displayCount = 2;
  const moreCards = cards.slice(displayCount);
  const displayedCards = cards.slice(0, displayCount);

  return (
    <>
      <div className="flex flex-row justify-evenly mt-4 space-x-4">
        {displayedCards.map((card) => (
          <StatisticsCard
            key={card.title}
            title={card.title}
            statistics={card.statistics}
          />
        ))}
      </div>
      {moreCards && (
        <ViewMore>
          <div className="flex flex-row justify-evenly mt-4 space-x-4 w-full">
            {moreCards.map((card) => (
              <StatisticsCard
                key={card.title}
                title={card.title}
                statistics={card.statistics}
              />
            ))}
          </div>
        </ViewMore>
      )}
    </>
  );
}
