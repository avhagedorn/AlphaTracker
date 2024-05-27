import { fmtDollars } from "@/lib/utils";
import { TransactionItem } from "@/types";
import Table from "./Table";
import { FiPlus, FiTrash } from "react-icons/fi";
import Button from "./Button";
import { useState } from "react";
import CreateTransactionModal from "./CreateTransactionModal";
import { useQuery, useQueryClient } from "react-query";
import { fetchSS } from "@/lib/fetch";
import { toast } from "react-toastify";

interface TransactionsTableProps {
  displayTicker?: boolean;
  displayDelete?: boolean;
  className?: string;
  portfolioId?: number;
  ticker?: string;
}

export default function TransactionsTable({
  displayTicker = false,
  displayDelete = false,
  className = "",
  portfolioId,
  ticker,
}: TransactionsTableProps) {
  const url = portfolioId
    ? `/transactions/portfolio/${portfolioId}`
    : `/transactions/stock/${ticker?.toUpperCase()}`;
  const queryClient = useQueryClient();
  const { data, status, error } = useQuery("transactions", () => fetchSS(url));
  const [createTransactionModalOpen, setCreateTransactionModalOpen] =
    useState(false);

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

  if (displayDelete) {
    headers.push({
      name: "Delete",
    });
  }
  const handleDelete = async (id: number) => {
    await fetchSS(`/transactions/${id}/delete`, {
      method: "POST",
    });
    queryClient.invalidateQueries("transactions");
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <Button
          className="font-sm"
          onClick={() => setCreateTransactionModalOpen(true)}
        >
          <div className="flex items-center justify-center">
            <FiPlus className="mr-2" size={24} />
            Add
          </div>
        </Button>
      </div>
      <Table
        headers={headers}
        loading={status === "loading"}
        data={data?.transactions || []}
        itemToRow={(item: TransactionItem) => (
          <>
            <td className="px-4 py-2">{item.date}</td>
            <td className="px-4 py-2">{item.shares}</td>
            <td className="px-4 py-2">{fmtDollars(item.price)}</td>
            <td className="px-4 py-2">{item.type}</td>
            {displayTicker && <td className="px-4 py-2">{item.ticker}</td>}
            {displayDelete && (
              <td className="px-4 py-2">
                <button onClick={() => handleDelete(item.id)}>
                  <FiTrash />
                </button>
              </td>
            )}
          </>
        )}
      />
      <CreateTransactionModal
        isOpen={createTransactionModalOpen}
        setIsOpen={setCreateTransactionModalOpen}
        onSubmit={() => {
          queryClient.invalidateQueries("transactions");
          toast.success("Transaction added!");
        }}
        portfolioId={portfolioId}
        ticker={ticker}
      />
    </div>
  );
}
