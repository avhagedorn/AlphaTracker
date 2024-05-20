import React, { useState, useCallback, useRef } from "react";
import debounce from "lodash/debounce";

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
    if (searchTerm.length === 0) {
      setSearchResults([]);
      return;
    }

    // Simulating an API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Perform the actual search logic here
    const results = [
      { id: 1, ticker: "AAPL", name: "Apple" },
      { id: 2, ticker: "GOOGL", name: "Alphabet" },
      { id: 3, ticker: "MSFT", name: "Microsoft" },
    ].filter(
      (item) =>
        item.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResults(results);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (debouncedSearch.current) {
      debouncedSearch.current.cancel();
    }

    debouncedSearch.current = debounce(() => {
      handleSearch(searchTerm);
    }, 100);

    debouncedSearch.current();
  };

  console.log(searchTerm, searchResults);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="px-4 py-1 border border-gray-300 rounded-md w-1/5"
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchResults.length > 0 && (
        <ul className="absolute left-1/2 transform -translate-x-1/2 z-10 w-1/5 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {searchResults.map(
            (result: { id: number; ticker: string; name: string }) => (
              <a href={`/stock/${result.ticker.toLowerCase()}`} key={result.id}>
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
