import React from "react";
import Table from "./Table";
import { PositionRow } from "@/types";
import { fmtDollars, fmtPercent } from "@/lib/utils";

interface PositionTableProps {
  data: PositionRow[];
}

export default function PositionsTable({ data }: PositionTableProps) {
  return (
    <Table
      headers={[
        {
          name: "Ticker",
          sort: (a: PositionRow, b: PositionRow) =>
            b.ticker.localeCompare(a.ticker),
        },
        {
          name: "Equity",
          sort: (a: PositionRow, b: PositionRow) =>
            a.equityValueDollars - b.equityValueDollars,
        },
        {
          name: "Return",
          sort: (a: PositionRow, b: PositionRow) =>
            a.returnValueDollars - b.returnValueDollars,
        },
        {
          name: "Alpha",
          sort: (a: PositionRow, b: PositionRow) =>
            a.alphaValueDollars - b.alphaValueDollars,
        },
      ]}
      data={data}
      itemToRow={(item) => (
        <>
          <td className="px-4 py-2">{item.ticker}</td>
          <td className="px-4 py-2">{`${fmtDollars(item.equityValueDollars)} (${item.equity} shares)`}</td>
          <td className="px-4 py-2">{`${fmtDollars(item.returnValueDollars)} (${fmtPercent(item.return)})`}</td>
          <td className="px-4 py-2">{`${fmtDollars(item.alphaValueDollars)} (${fmtPercent(item.alpha)})`}</td>
        </>
      )}
    />
  );
}
