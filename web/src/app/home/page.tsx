"use client";

import Button from "@/components/Button";
import CreatePortfolioModal from "@/components/CreatePortfolioModal";
import PositionsTable from "@/components/PositionsTable";
import PriceChange from "@/components/PriceChange";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from 'react-query';
import demoData from "../../public/demo-data.json";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => <div className="h-96 w-full shimmer"></div>,
});


export default function Home() {
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  const queryClient = useQueryClient();

  return (
    <main className="flex min-h-screen flex-col items-center">
      <CreatePortfolioModal 
        isOpen={showCreatePortfolioModal}
        setIsOpen={setShowCreatePortfolioModal}
        onCreate={() => {
          queryClient.invalidateQueries('portfolios');
        }}
      />

      <div className="flex w-screen">
        <div className="flex-1 p-8">
          <h1 className="text-6xl font-bold mb-4">$40,034.65</h1>
          <PriceChange percentChange={0.1} valueChange={1000} subText="Today"/>
          <PriceChange percentChange={-0.05} valueChange={-500} subText="Alpha" />

          <div className="flex mt-8">
            <CompareGraph
              width={1400}
              height={300}
              data={demoData}
              ticks={4}
              animationDuration={500}
              hideLegend
              lineWidth={3}
            />
          </div>

          <PositionsTable data={[]}/>

        </div>
        
        <div className="w-[500px] min-w-[500px] min-h-screen p-8 border-l-2 border-gray-300">
            <h1 className="text-3xl font-bold mb-4">Strategies</h1>
            <p className="text-lg">This is the right part of the page with a fixed width of 500px.</p>
            <Button className="mt-4" onClick={() => setShowCreatePortfolioModal(true)}>Create a new strategy</Button>
        </div>
      </div>

      <Link href="/api/auth/logout" className="m-4 bg-blue-500 hover:bg-blue-700 p-2 rounded text-white font-bold">
        Logout
      </Link>
    </main>
  );
}
