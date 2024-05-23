import { Portfolio, Timeframe } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import StrategyPreview from "./StrategyPreview";
import { fetchSS } from "@/lib/fetch";
import { useQuery } from "react-query";
import Button from "./Button";
import { BsThreeDots } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { set } from "lodash";

interface StrategyOptionsProps {
  setShowStrategyOptions: (show: boolean) => void;
  setSelectedStrategyOption: (option: string) => void;
  strategyDisplayOptions: string[];
  selectedStrategyOption: string;
}

function StrategyOptions({
  setShowStrategyOptions,
  setSelectedStrategyOption,
  strategyDisplayOptions,
  selectedStrategyOption,
}: StrategyOptionsProps) {
  const strategyOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        strategyOptionsRef.current &&
        !strategyOptionsRef.current.contains(event.target as Node)
      ) {
        setShowStrategyOptions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setShowStrategyOptions]);

  const handleClickAndClose = (option: string) => {
    setShowStrategyOptions(false);
    setSelectedStrategyOption(option);
  };

  return (
    <div
      className="absolute w-auto left-auto right-4 z-10 ml-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
      ref={strategyOptionsRef}
    >
      <div className="flex flex-col items-start justify-start">
        <div className="w-full border-b border-gray-300 px-4 py-2 font-bold">
          Display
        </div>
        {strategyDisplayOptions.map((optionName, idx) => (
          <div className="w-full" key={idx}>
            <button
              className="w-full rounded-md px-4 py-2 hover:bg-gray-100 cursor-pointer text-left flex flex-row items-center"
              onClick={() => handleClickAndClose(optionName)}
            >
              <div className="w-[20px] mr-2">
                {optionName === selectedStrategyOption && <FiCheck size={20} />}
              </div>
              {optionName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StrategyListProps {
  timeframe: Timeframe;
  handleOpenPortfolioModal: () => void;
}

export default function StrategyList({
  timeframe,
  handleOpenPortfolioModal,
}: StrategyListProps) {
  const [showStrategyOptions, setShowStrategyOptions] = useState(false);
  const [selectedStrategyOption, setSelectedStrategyOption] =
    useState("Total Return");
  const { data, status, error } = useQuery("portfolios", () =>
    fetchSS("/portfolio/list"),
  );

  const strategyDisplayOptions = [
    "Total Return",
    "Today's Return",
    "Today's Alpha",
    "Total Alpha",
    "Equity",
  ];

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-4">Strategies</h1>
        <button onClick={() => setShowStrategyOptions(true)}>
          <BsThreeDots size={20} />
        </button>
      </div>
      {showStrategyOptions && (
        <StrategyOptions
          selectedStrategyOption={selectedStrategyOption}
          setShowStrategyOptions={setShowStrategyOptions}
          setSelectedStrategyOption={setSelectedStrategyOption}
          strategyDisplayOptions={strategyDisplayOptions}
        />
      )}
      {status === "success" && (data as Portfolio[]).length === 0 && (
        <p>No strategies found</p>
      )}
      {status === "success" &&
        (data as Portfolio[]).length > 0 &&
        (data as Portfolio[]).map((strategy, index) => (
          <StrategyPreview key={index} portfolio={strategy} className="mt-4" />
        ))}
      {status === "loading" &&
        [...Array(4)].map((_, index) => (
          <div key={index} className="mt-4">
            <div className="h-32 w-full shimmer"></div>
          </div>
        ))}
      {status === "error" && <p>{String(error)}</p>}
      <Button className="mt-4 w-full" onClick={handleOpenPortfolioModal}>
        Create a new strategy
      </Button>
    </div>
  );
}
