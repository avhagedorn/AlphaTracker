import React, { useState, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { fetchSS } from "@/lib/fetch";
import { toast } from "react-toastify";
import { highlightText } from "@/lib/displayUtils";

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const debouncedSearch = useRef<any>(null);

  const handleSearch = useCallback(async (term: string) => {
    if (term.length === 0 || term.startsWith(" ")) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetchSS(`/search/stock?q=${term}`);
      setSearchResults(response.ticker_results || []);
    } catch (error) {
      toast.error("Failed to search");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (debouncedSearch.current) {
      debouncedSearch.current.cancel();
    }

    debouncedSearch.current = debounce(() => {
      handleSearch(searchTerm);
    }, 50);

    debouncedSearch.current();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1,
      );
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === "Enter" && focusedIndex !== -1) {
      const selectedResult = searchResults[focusedIndex];
      window.location.href = `/stock/${selectedResult.ticker.toLowerCase()}`;
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-1 border w-full border-gray-300 rounded-md focus:outline-none focus:border-emerald-500"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      {searchResults.length > 0 && (
        <ul className="absolute text-center left-1/2 transform -translate-x-1/2 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {searchResults.map(
            (result: { ticker: string; name: string }, index: number) => (
              <a href={`/stock/${result.ticker.toLowerCase()}`} key={index}>
                <li
                  className={`rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer ${index === focusedIndex ? "bg-gray-200" : ""}`}
                >
                  {highlightText(
                    searchTerm,
                    `${result.ticker} - ${result.name}`,
                  )}
                </li>
              </a>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
