import React from "react";
import Table from "./Table";
import { PositionRow } from "@/types";
import { fmtDollars, fmtPercent } from "@/lib/utils";

interface PositionTableProps {
  data: PositionRow[];
  loading?: boolean;
  className?: string;
}

export default function PositionsTable({
  data,
  loading,
  className,
}: PositionTableProps) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">Active Positions</h1>
      <Table
        loading={loading}
        headers={[
          {
            name: "Ticker",
            sort: (a: PositionRow, b: PositionRow) =>
              b.ticker.localeCompare(a.ticker),
          },
          {
            name: "Equity",
            sort: (a: PositionRow, b: PositionRow) =>
              a.equity_value - b.equity_value,
          },
          {
            name: "Return",
            sort: (a: PositionRow, b: PositionRow) =>
              a.return_value - b.return_value,
          },
          {
            name: "Alpha",
            sort: (a: PositionRow, b: PositionRow) =>
              a.alpha_value - b.alpha_value,
          },
        ]}
        data={data}
        itemToRow={(item) => (
          <>
            <td className="px-4 py-2">{item.ticker}</td>
            <td className="px-4 py-2">{`${fmtDollars(item.equity_value)} (${item.shares} shares)`}</td>
            <td className="px-4 py-2">{`${fmtDollars(item.return_value)} (${fmtPercent(item.return_percent)})`}</td>
            <td className="px-4 py-2">{`${fmtDollars(item.alpha_value)} (${fmtPercent(item.alpha_percent)})`}</td>
          </>
        )}
      />
    </div>
  );
}
