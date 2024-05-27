import { Portfolio } from "@/types";
import React from "react";
import demoData from "../public/demo-data.json";
import PriceChange from "./PriceChange";
import CompareGraphWrapper from "./CompareGraphWrapper";

interface StrategyPreviewProps {
  portfolio: Portfolio;
  className?: string;
  hidePriceChange?: boolean;
  height: number;
  width: number;
  includeDescription?: boolean;
}

export default function StrategyPreview({
  portfolio,
  className,
  height,
  width,
  hidePriceChange = false,
  includeDescription = false,
}: StrategyPreviewProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <a href={`/portfolio/${portfolio.id}`}>
          <h1 className="text-2xl">{portfolio.name}</h1>
        </a>
        {!hidePriceChange && (
          <PriceChange percentChange={1} valueChange={1} hideDollars />
        )}
      </div>
      {includeDescription && <p>{portfolio.description}</p>}
      <CompareGraphWrapper
        width={width}
        height={height}
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        data={demoData}
        ticks={4}
        hideLegend
        animationDuration={0}
        hideTooltip
      />
    </div>
  );
}
