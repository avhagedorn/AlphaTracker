"use client";

import { getLineColor } from "@/lib/displayUtils";
import { GraphData } from "@/types";
import React from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function getVisuallyAppealingRange(data: GraphData[], stepCount: number) {
  const low = Math.min(...data.map((d) => d.left), ...data.map((d) => d.right));
  const high = Math.max(
    ...data.map((d) => d.left),
    ...data.map((d) => d.right),
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
  width: number | string;
  height: number | string;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  data: GraphData[];
  ticks: number;
  animationDuration?: number;
  hideLegend?: boolean;
  lineWidth?: number;
  hideTooltip?: boolean;
  leftLineName?: string;
  rightLineName?: string;
}

export default function CompareGraph({
  data,
  width,
  height,
  margin,
  ticks,
  lineWidth = 2,
  hideLegend = false,
  hideTooltip = false,
  animationDuration = 1500,
  leftLineName = "Your Portfolio",
  rightLineName = "S&P 500",
}: CompareGraphProps) {
  const domain = getVisuallyAppealingRange(data, ticks);

  if (data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center`}
        style={{ width, height }}
      >
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data} margin={margin}>
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
          dataKey="left"
          stroke={getLineColor(data)}
          className="opacity-50"
          animationDuration={animationDuration}
          name={leftLineName}
          dot={false}
          strokeWidth={lineWidth}
        />
        <Line
          type="monotone"
          dataKey="right"
          stroke="#4f46e5" // indigo-600
          className="opacity-50"
          animationDuration={animationDuration}
          name={rightLineName}
          dot={false}
          strokeWidth={lineWidth}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
