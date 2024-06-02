import React from "react";
import Search from "./Search";
import { SearchableSymbol } from "@/types";
import { DEFAULT_SEARCHABLE_SYMBOL } from "@/lib/search";

interface CompareSearchProps {
  symbol?: string;
  focusInput?: boolean;
  textColor?: string;
  onSelect: (symbol: SearchableSymbol) => void;
}

export default function CompareSearch({
  symbol,
  onSelect,
  textColor,
  focusInput = false,
}: CompareSearchProps) {
  return (
    <div className="relative inline-block">
      {symbol ? (
        <p
          className="text-3xl font-bold cursor-pointer"
          onClick={() => onSelect(DEFAULT_SEARCHABLE_SYMBOL)}
          style={{
            color: textColor,
          }}
        >
          {symbol}
        </p>
      ) : (
        <Search
          onSelect={onSelect}
          focusInput={focusInput}
          className="w-[260px] text-3xl font-bold border-0 focus:outline-none focus:border-0 focus:ring-0"
          placeholder="Ticker or Portfolio"
          inline
        />
      )}
    </div>
  );
}
