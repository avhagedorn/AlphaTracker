"use client";

import ContentWrapper from "@/components/ContentWrapper";
import StrategyList from "@/components/StrategyList";
import React from "react";

export default function Account() {
  const width = Math.floor(window.innerWidth / 3);

  return (
    <ContentWrapper hideFooter>
      <div className="w-1/3 mx-auto">
        <h1 className="text-4xl font-bold mb-4">Strategies</h1>
        <p className="mb-4 text-gray-700">
          Strategies (portfolios) are your different approaches to outperforming
          the market. You can create a strategy for long-term investing, day
          trading, or anything in between.
        </p>
        <StrategyList
          chartWidth={width}
          chartHeight={200}
          hideHeader
          includeDescriptions
        />
      </div>
    </ContentWrapper>
  );
}
