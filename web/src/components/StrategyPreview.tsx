import { Portfolio } from "@/types";
import React, { memo } from "react";
import demoData from "../public/demoData/dummyGraph.json";
import PriceChange from "./PriceChange";
import CompareGraphWrapper from "./CompareGraphWrapper";
import { fmtLargeNumber } from "@/lib/utils";

interface StrategyPreviewProps {
  portfolio: Portfolio;
  strategyDisplayOption: number;
  className?: string;
  hidePriceChange?: boolean;
  height: number | string;
  width: number | string;
  includeDescription?: boolean;
}

const StrategyPreview = memo(function StrategyPreview({
  portfolio,
  strategyDisplayOption,
  className,
  height,
  width,
  hidePriceChange = false,
  includeDescription = false,
}: StrategyPreviewProps) {
  const priceChange = () => {
    if (strategyDisplayOption === 0) {
      return {
        valueChange: portfolio.chart.total_return,
        percentChange: portfolio.chart.total_return_percent,
      };
    } else if (strategyDisplayOption === 1) {
      return {
        percentChange:
          portfolio.chart.total_return_percent -
            portfolio.chart?.total_return_percent_spy || 0,
        valueChange:
          portfolio.chart.total_return - portfolio.chart.total_return_spy,
      };
    } else if (strategyDisplayOption === 2) {
      return {
        valueChange: portfolio.chart.last_price,
        hideIcon: true,
        hidePercent: true,
      };
    }
  };

  const priceChangeData = priceChange();

  return (
    <div className={`${className}`}>
      <div className="">
        <a href={`/portfolio/${portfolio.id}`}>
          <h1 className="text-2xl">{portfolio.name}</h1>
        </a>
        {!hidePriceChange && (
          <PriceChange
            percentChange={priceChangeData?.percentChange || 1}
            valueChange={priceChangeData?.valueChange || 1}
            hideIcon={priceChangeData?.hideIcon}
            hidePercent={priceChangeData?.hidePercent}
          />
        )}
      </div>
      {includeDescription && <p>{portfolio.description}</p>}
      <CompareGraphWrapper
        width={width}
        height={height}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        data={portfolio.chart?.points || demoData}
        ticks={4}
        hideLegend
        animationDuration={0}
        hideTooltip
      />
    </div>
  );
});

export default StrategyPreview;
