import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import { fetchServer } from "@/lib/fetch";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onSubmit: () => void;
  setIsOpen: (isOpen: boolean) => void;
  ticker?: string;
  portfolioId?: number;
}

export default function CreateTransactionModal({
  isOpen,
  onSubmit,
  setIsOpen,
  ticker,
  portfolioId,
}: CreateTransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetchServer("/transactions/create", {
      method: "POST",
      body: JSON.stringify({
        quantity: Number(data.get("shares")),
        price: Number(data.get("price")),
        purchased_at: data.get("date"),
        type: data.get("type"),
        portfolio_id: Number(portfolioId || data.get("portfolioId")),
        ticker: data.get("ticker"),
      }),
    });

    if (response.data) {
      setIsOpen(false);
      onSubmit();
    } else {
      alert("Failed to submit: " + response.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title={"Create Transaction"}
      size={"small"}
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="shares"
              className="block text-sm font-medium text-gray-700"
            >
              Shares
            </label>
            <input
              type="float"
              min={0}
              id="shares"
              name="shares"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              maxLength={255}
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="float"
              min={0}
              id="price"
              name="price"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              maxLength={255}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              placeholder="Enter a name (e.g. 'Memestocks 🤑')"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              minLength={3}
              maxLength={32}
              required
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Type
            </label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              required
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="portfolioId"
              className="block text-sm font-medium text-gray-700"
            >
              Portfolio
            </label>
            <select
              id="portfolioId"
              name="portfolioId"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              required
              value={portfolioId}
              disabled={!!portfolioId}
            >
              <option value="1">Portfolio 1</option>
              <option value="2">Portfolio 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="ticker"
              className="block text-sm font-medium text-gray-700"
            >
              Ticker
            </label>
            <input
              type="text"
              id="ticker"
              name="ticker"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
              maxLength={255}
              defaultValue={ticker?.toUpperCase()}
              disabled={!!ticker}
            />
          </div>
        </div>
        <div className="flex justify-start mt-2">
          <Button type="submit" isLoading={isSubmitting}>
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
}
