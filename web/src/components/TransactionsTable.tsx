import { fmtDollars } from "@/lib/utils";
import { TransactionItem } from "@/types";
import Table from "./Table";
import { FiTrash } from "react-icons/fi";

interface TransactionsTableProps {
  data: TransactionItem[];
  onDelete?: (id: number) => void;
  displayTicker?: boolean;
}

export default function TransactionsTable({
  data,
  onDelete,
  displayTicker = false,
}: TransactionsTableProps) {
  const headers: {
    name: string;
    sort?: (a: TransactionItem, b: TransactionItem) => number;
  }[] = [
    {
      name: "Date",
      sort: (a: TransactionItem, b: TransactionItem) =>
        a.date.localeCompare(b.date),
    },
    {
      name: "Shares",
      sort: (a: TransactionItem, b: TransactionItem) => a.shares - b.shares,
    },
    {
      name: "Price",
      sort: (a: TransactionItem, b: TransactionItem) => a.price - b.price,
    },
    {
      name: "Type",
      sort: (a: TransactionItem, b: TransactionItem) =>
        a.type.localeCompare(b.type),
    },
  ];

  if (displayTicker) {
    headers.push({
      name: "Ticker",
      sort: (a: TransactionItem, b: TransactionItem) =>
        a.ticker.localeCompare(b.ticker),
    });
  }

  if (onDelete) {
    headers.push({
      name: "Delete",
    });
  }

  return (
    <Table
      headers={headers}
      data={data}
      itemToRow={(item: TransactionItem) => (
        <>
          <td className="px-4 py-2">{item.date}</td>
          <td className="px-4 py-2">{item.shares}</td>
          <td className="px-4 py-2">{fmtDollars(item.price)}</td>
          <td className="px-4 py-2">{item.type}</td>
          {displayTicker && <td className="px-4 py-2">{item.ticker}</td>}
          {onDelete && (
            <td className="px-4 py-2">
              <button onClick={() => onDelete(item.id)}>
                <FiTrash />
              </button>
            </td>
          )}
        </>
      )}
    />
  );
}
