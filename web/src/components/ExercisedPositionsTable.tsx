"use client";

import React from "react";
import { PositionRow } from "@/types";
import Table from "./Table";
import { fmtDollars } from "@/lib/utils";

interface ExercisedPositionsTableProps {
  data: PositionRow[];
  loading?: boolean;
  className?: string;
}

export default function ExercisedPositionsTable({
  data,
  loading,
  className,
}: ExercisedPositionsTableProps) {
  const positionsWithRealizedPnL = data.filter(
    (position) => position.realized_alpha !== 0,
  );

  if (positionsWithRealizedPnL.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">Exercised Gains</h1>
      <Table
        loading={loading}
        headers={[
          {
            name: "Ticker",
            sort: (a: PositionRow, b: PositionRow) =>
              b.ticker.localeCompare(a.ticker),
          },
          {
            name: "Realized Gain",
            sort: (a: PositionRow, b: PositionRow) =>
              a.realized_value - b.realized_value,
          },
          {
            name: "Alpha",
            sort: (a: PositionRow, b: PositionRow) =>
              a.realized_alpha - b.realized_alpha,
          },
        ]}
        data={positionsWithRealizedPnL}
        itemToRow={(item) => (
          <>
            <td className="px-4 py-2">{item.ticker}</td>
            <td className="px-4 py-2">{`${fmtDollars(item.realized_value)}`}</td>
            <td className="px-4 py-2">{`${fmtDollars(item.realized_alpha)}`}</td>
          </>
        )}
      />
    </div>
  );
}
