"use client";

import useFetch from "@/lib/fetch";
import dynamic from "next/dynamic";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => null,
});

export default function PortfolioDetail(
{ 
    params 
} : { 
    params: { 
        id: number 
    }
}) {
    const portfolio = useFetch(`/portfolio/${params.id}`);

    console.log(portfolio);

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <header className="flex flex-col items-center">
                <h1 className="text-4xl font-bold">AlphaTracker</h1>
                <p className="text-lg text-center">
                    Track your portfolio against the market
                </p>
            </header>
            <div className="flex flex-col items-center justify-center mt-16 h-96">
                <CompareGraph
                    width={1000}
                    height={300}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                    data={[]}
                    ticks={4}
                />
            </div>
      </main>
    );
};
