import { Portfolio } from "@/types";
import dynamic from "next/dynamic";
import React from "react";
import demoData from "../public/demo-data.json";
import PriceChange from "./PriceChange";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => <div className="h-24 w-full shimmer"></div>,
});

interface StrategyPreviewProps {
  portfolio: Portfolio;
  className?: string;
}

export default function StrategyPreview({
  portfolio,
  className,
}: StrategyPreviewProps) {
  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{portfolio.name}</h1>
        <PriceChange percentChange={1} valueChange={1} hideDollars />
      </div>
      <CompareGraph
        width={400}
        height={100}
        margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        data={demoData}
        ticks={4}
        hideLegend
        animationDuration={0}
        hideTooltip
      />
    </div>
  );
}
