import React from "react";

interface StockPriceChartProps {
  low: number;
  high: number;
  current: number;
}

export default function StockPriceChart({
  low,
  high,
  current,
}: StockPriceChartProps) {
  const range = high - low;
  const percentCurrent = ((current - low) / range) * 80 + 10;

  return (
    <div className="relative w-full h-3 rounded-full overflow-hidden">
      <div className="absolute inset-0 bg-gray-200 w-full"></div>
      <div
        className="absolute inset-0 h-3 w-[10%] bg-emerald-500 rounded-full"
        style={{ left: `${percentCurrent}%` }}
      ></div>
    </div>
  );
}
