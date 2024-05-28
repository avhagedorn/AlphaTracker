import React, { useState, useCallback, useRef } from "react";
import debounce from "lodash/debounce";
import { fetchSS } from "@/lib/fetch";
import { toast } from "react-toastify";

function highlightText(highlight: string, text: string) {
  const regex = new RegExp(`(${highlight})`, "i");
  const match = text.match(regex);

  if (match && match.index !== undefined) {
    const startIndex = match.index;
    const endIndex = startIndex + match[0].length;
    const beforeMatch = text.slice(0, startIndex);
    const afterMatch = text.slice(endIndex);

    return (
      <span>
        {beforeMatch}
        <span className="font-black">{match[0]}</span>
        {afterMatch}
      </span>
    );
  }

  return text;
}

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const debouncedSearch = useRef<any>(null);

  const handleSearch = useCallback(async (searchTerm: string) => {
    if (searchTerm.length === 0 || searchTerm.startsWith(" ")) {
      setSearchResults([]);
      return;
    }
    let response = [];
    try {
      response = await fetchSS(`/search/stock?q=${searchTerm}`);
    } catch (error) {
      toast.error("Failed to search");
    }
    setSearchResults(response);
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

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchResults.length === 0) {
        window.location.href = `/stock/${searchTerm.toLowerCase()}`;
      } else {
        window.location.href = `/stock/${searchResults[0].ticker.toLowerCase()}`;
      }
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
        onKeyDown={handleSubmit}
      />
      {searchResults.length > 0 && (
        <ul className="absolute text-center left-1/2 transform -translate-x-1/2 z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {searchResults.map(
            (result: { ticker: string; name: string }, index: number) => (
              <a href={`/stock/${result.ticker.toLowerCase()}`} key={index}>
                <li className="rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer">
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
