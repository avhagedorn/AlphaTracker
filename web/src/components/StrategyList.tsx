import { Portfolio } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import StrategyPreview from "./StrategyPreview";
import { fetchSS, fetchServer } from "@/lib/fetch";
import { useQuery, useQueryClient } from "react-query";
import Button from "./Button";
import { BsThreeDots } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import PortfolioModal from "./PortfolioModal";
import { toast } from "react-toastify";

interface StrategyOptionsProps {
  setShowStrategyOptions: (show: boolean) => void;
  setSelectedStrategyOption: (option: number) => void;
  strategyDisplayOptions: string[];
  selectedStrategyOption: number;
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

  const handleClickAndClose = (idx: number) => {
    setShowStrategyOptions(false);
    setSelectedStrategyOption(idx);
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
              onClick={() => handleClickAndClose(idx)}
            >
              <div className="w-[20px] mr-2">
                {idx === selectedStrategyOption && <FiCheck size={20} />}
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
  hideHeader?: boolean;
  includeDescriptions?: boolean;
  chartHeight?: number;
  chartWidth?: number;
}

export default function StrategyList({
  includeDescriptions,
  chartHeight = 100,
  chartWidth = 400,
  hideHeader = false,
}: StrategyListProps) {
  const [showStrategyOptions, setShowStrategyOptions] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedStrategyOption, setSelectedStrategyOption] = useState(-1);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const { data, status, error } = useQuery("portfolios", () =>
    fetchSS("/portfolio/list"),
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    if (status === "success" && data) {
      setSelectedStrategyOption(data.strategy_display_option);
      setPortfolios(data.portfolios);
    }
  }, [status, data]);

  const strategyDisplayOptions = [
    "Total Return",
    "Today's Return",
    "Today's Alpha",
    "Total Alpha",
    "Equity",
  ];

  const handleUpdatePreferences = async (option: number) => {
    try {
      await fetchServer("/user/preferences/update", {
        method: "POST",
        body: JSON.stringify({
          strategy_display_option: option,
        }),
      });
      queryClient.invalidateQueries("portfolios");
      toast.success("Preferences updated!");
    } catch (error) {
      toast.error("Failed to update preferences");
    }
  };

  return (
    <div>
      {!hideHeader && (
        <>
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
              setSelectedStrategyOption={handleUpdatePreferences}
              strategyDisplayOptions={strategyDisplayOptions}
            />
          )}
        </>
      )}
      {status === "success" && portfolios.length === 0 && (
        <p>No strategies found</p>
      )}
      {status === "success" &&
        portfolios.length > 0 &&
        portfolios.map((strategy, index) => (
          <StrategyPreview
            key={index}
            portfolio={strategy}
            className="mt-4"
            hidePriceChange={hideHeader}
            height={chartHeight}
            width={"100%"}
            includeDescription={includeDescriptions}
          />
        ))}
      {status === "loading" &&
        [...Array(4)].map((_, index) => (
          <div key={index} className="mt-4">
            <div
              className="w-full shimmer"
              style={{ height: `${chartHeight}px` }}
            ></div>
          </div>
        ))}
      {status === "error" && <p>{String(error)}</p>}
      <Button
        className="mt-4 w-full"
        onClick={() => setShowPortfolioModal(true)}
      >
        Create a new strategy
      </Button>
      <PortfolioModal
        isOpen={showPortfolioModal}
        setIsOpen={setShowPortfolioModal}
        onSubmit={() => queryClient.invalidateQueries("portfolios")}
      />
    </div>
  );
}
