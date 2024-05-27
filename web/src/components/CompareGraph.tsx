"use client";

import { GraphData } from "@/types";
import React from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

function getVisuallyAppealingRange(data: GraphData[], stepCount: number) {
  const low = Math.min(
    ...data.map((d) => d.portfolio),
    ...data.map((d) => d.spy),
  );
  const high = Math.max(
    ...data.map((d) => d.portfolio),
    ...data.map((d) => d.spy),
  );

  const range = high - low;
  const stepSize = range / (stepCount - 1);

  const power = Math.floor(Math.log10(stepSize));
  const roundedStepSize =
    Math.ceil(stepSize / Math.pow(10, power)) * Math.pow(10, power);

  const newLow = Math.floor(low / roundedStepSize) * roundedStepSize;
  const newHigh = Math.ceil(high / roundedStepSize) * roundedStepSize;

  return [newLow, newHigh];
}

export interface CompareGraphProps {
  width: number;
  height: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  data: GraphData[];
  ticks: number;
  lineName?: string;
  animationDuration?: number;
  hideLegend?: boolean;
  lineWidth?: number;
  hideTooltip?: boolean;
}

export default function CompareGraph({
  data,
  width,
  height,
  margin,
  ticks,
  lineName = "Your Portfolio",
  animationDuration = 1500,
  hideLegend = false,
  lineWidth = 2,
  hideTooltip = false,
}: CompareGraphProps) {
  const domain = getVisuallyAppealingRange(data, ticks);

  const getLineColor = (data: GraphData[]) => {
    if (data.length === 0) return "#82ca9d";

    const firstPrice = data[0].portfolio;
    const lastPrice = data[data.length - 1].portfolio;
    return firstPrice < lastPrice ? "#82ca9d" : "#ff7300";
  };

  return (
    <LineChart width={width} height={height} data={data} margin={margin}>
      <XAxis
        dataKey="date"
        className="text-sm"
        tick={!hideLegend}
        axisLine={!hideLegend}
        height={hideLegend ? 0 : undefined}
      />
      <YAxis
        domain={domain}
        allowDataOverflow={false}
        className="text-sm"
        tickCount={ticks}
        tickFormatter={(value) => `$${value}`}
        tick={!hideLegend}
        axisLine={!hideLegend}
        width={hideLegend ? 0 : undefined}
      />
      {!hideTooltip && <Tooltip />}
      {!hideLegend && <Legend />}
      <Line
        type="monotone"
        dataKey="portfolio"
        stroke={getLineColor(data)}
        animationDuration={animationDuration}
        name={lineName}
        dot={false}
        strokeWidth={lineWidth}
      />
      <Line
        type="monotone"
        dataKey="spy"
        stroke="#8884d8"
        animationDuration={animationDuration}
        name="SP500"
        dot={false}
        strokeWidth={lineWidth}
      />
    </LineChart>
  );
}
