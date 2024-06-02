import React from "react";
import Search from "./Search";
import { SearchableSymbol } from "@/types";

export default function StockSearch() {
  const handleSelect = (symbol: SearchableSymbol) => {
    if (symbol.type === "PORTFOLIO") {
      window.location.href = `/portfolio/${symbol.id}`;
    } else if (symbol.type === "STOCK") {
      window.location.href = `/stock/${symbol.ticker?.toLowerCase()}`;
    }
  };

  return (
    <Search
      className="px-4 py-1 border w-full border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
      onSelect={handleSelect}
      placeholder="Search"
    />
  );
}
