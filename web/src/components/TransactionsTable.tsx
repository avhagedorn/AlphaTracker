import { fmtDollars } from "@/lib/utils";
import { TransactionItem } from "@/types";
import Table from "./Table";

export default function TransactionsTable({
  data,
}: {
  data: TransactionItem[];
}) {
  return (
    <Table
      headers={[
        {
          name: "Date",
          sort: (a, b) => a.date.localeCompare(b.date),
        },
        {
          name: "Shares",
          sort: (a, b) => a.shares - b.shares,
        },
        {
          name: "Price",
          sort: (a, b) => a.price - b.price,
        },
        {
          name: "Type",
          sort: (a, b) => a.type.localeCompare(b.type),
        },
      ]}
      data={data}
      itemToRow={(item: TransactionItem) => (
        <>
          <td className="px-4 py-2">{item.date}</td>
          <td className="px-4 py-2">{item.shares}</td>
          <td className="px-4 py-2">{fmtDollars(item.price)}</td>
          <td className="px-4 py-2">{item.type}</td>
        </>
      )}
    />
  );
}
