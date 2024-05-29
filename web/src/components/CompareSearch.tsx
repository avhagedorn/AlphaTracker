import React, { useState, useCallback, useRef, useEffect } from "react";
import debounce from "lodash/debounce";
import { fetchSS } from "@/lib/fetch";
import { toast } from "react-toastify";
import { highlightText } from "@/lib/displayUtils";

interface CompareSearchProps {
  symbol?: string;
  focusInput?: boolean;
  textColor?: string;
  onSelect: (symbol: string) => void;
}

export default function CompareSearch({
  symbol,
  onSelect,
  textColor,
  focusInput = false,
}: CompareSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tickerResults, setTickerResults] = useState<any[]>([]);
  const [portfolioResults, setPortfolioResults] = useState<any[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const debouncedSearch = useRef<any>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusInput) {
      const input = componentRef.current?.querySelector("input");
      input?.focus();
    }
  }, [focusInput]);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length === 0 || term.startsWith(" ")) {
      setTickerResults([]);
      setPortfolioResults([]);
      return;
    }
    try {
      const response = await fetchSS(`/search/stock?q=${term}`);
      setTickerResults(response.ticker_results || []);
      setPortfolioResults(response.portfolio_results || []);
    } catch (error) {
      toast.error("Failed to search");
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const totalResults = tickerResults.length + portfolioResults.length;
    if (totalResults === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex <= 0 ? totalResults - 1 : prevIndex - 1,
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex === totalResults - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      const selectedResult =
        focusedIndex < tickerResults.length
          ? tickerResults[focusedIndex]
          : portfolioResults[focusedIndex - tickerResults.length];
      handleSelect(
        selectedResult.ticker
          ? `stock:${selectedResult.ticker}`
          : `portfolio:${selectedResult.id}`,
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (debouncedSearch.current) debouncedSearch.current.cancel();
    debouncedSearch.current = debounce(() => handleSearch(term), 300);
    debouncedSearch.current();
  };

  const handleSelect = (selectedSymbol: string) => {
    onSelect(selectedSymbol);
    setSearchTerm("");
    setTickerResults([]);
    setPortfolioResults([]);
  };

  return (
    <div className="relative inline-block" ref={componentRef}>
      {symbol ? (
        <p
          className="text-3xl font-bold cursor-pointer"
          onClick={() => onSelect("")}
          style={{
            color: textColor,
          }}
        >
          {symbol}
        </p>
      ) : (
        <input
          type="text"
          className="w-[260px] text-3xl font-bold border-0 focus:outline-none focus:border-0 focus:ring-0"
          placeholder="Ticker or Portfolio"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoFocus={focusInput}
        />
      )}
      {(tickerResults.length > 0 || portfolioResults.length > 0) && (
        <div className="absolute w-72 text-center z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {tickerResults.length > 0 && (
            <>
              <div className="text-left text-sm text-gray-600 px-4 py-2 border-b border-gray-300">
                Stocks
              </div>
              {tickerResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(`stock:${result.ticker}`)}
                  className={`w-full rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer ${index === focusedIndex ? "bg-gray-200" : ""}`}
                >
                  {highlightText(
                    searchTerm,
                    `${result.ticker} - ${result.name}`,
                  )}
                </button>
              ))}
            </>
          )}
          {portfolioResults.length > 0 && (
            <>
              <div className="text-left text-sm text-gray-600 px-4 py-2 border-b border-gray-300 my-2">
                Portfolios
              </div>
              {portfolioResults.map((result, index) => (
                <button
                  key={index + tickerResults.length}
                  onClick={() => handleSelect(`portfolio:${result.name}`)}
                  className={`w-full rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer ${index + tickerResults.length === focusedIndex ? "bg-gray-200" : ""}`}
                >
                  {highlightText(searchTerm, result.name)}
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
