"use client";

import Button from "@/components/Button";
import CreatePortfolioModal from "@/components/CreatePortfolioModal";
import PortfolioList from "@/components/PortfolioList";
import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from 'react-query';


export default function Home() {
  const [showCreatePortfolioModal, setShowCreatePortfolioModal] = useState(false);
  const queryClient = useQueryClient();

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-lg text-center">
          Track your portfolio against the market
        </p>
      </header>
      <Button
        onClick={() => setShowCreatePortfolioModal(true)}
      >
        Create a new portfolio
      </Button>
      <Link href="/api/auth/logout" className="mt-10 bg-blue-500 hover:bg-blue-700 p-3 rounded text-white font-bold">
        Logout
      </Link>

      <CreatePortfolioModal 
        isOpen={showCreatePortfolioModal}
        setIsOpen={setShowCreatePortfolioModal}
        onCreate={() => {
          queryClient.invalidateQueries('portfolios');
        }}
      />

      <PortfolioList />

    </main>
  );
}
