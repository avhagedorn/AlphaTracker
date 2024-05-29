import dynamic from "next/dynamic";
import React from "react";
import { CompareGraphProps } from "@/components/CompareGraph";

export default function CompareGraphWrapper({
  data,
  width,
  height,
  margin,
  ticks,
  animationDuration,
  hideLegend,
  lineWidth,
  hideTooltip,
  leftLineName,
  rightLineName,
}: CompareGraphProps) {
  const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
    ssr: false,
    loading: () => (
      <div className="w-full shimmer" style={{ height: `${height}px` }}></div>
    ),
  });

  return (
    <CompareGraph
      width={width}
      height={height}
      margin={margin}
      data={data}
      ticks={ticks}
      leftLineName={leftLineName}
      rightLineName={rightLineName}
      hideLegend={hideLegend}
      animationDuration={animationDuration}
      lineWidth={lineWidth}
      hideTooltip={hideTooltip}
    />
  );
}
