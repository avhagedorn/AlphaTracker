"use client";

import dynamic from "next/dynamic";
import demoData from "../public/demo-data.json";
import { useRouter } from "next/navigation";
import { useQuery } from "react-query";
import { fetchSS } from "@/lib/fetch";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => null,
});

export default function Home() {
  const router = useRouter();
  const { data, isFetching } = useQuery("user", () => fetchSS("/user/me"));

  if (isFetching) {
    return null;
  } else if (data) {
    router.push("/home");
  } else {
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
            data={demoData}
            ticks={4}
          />
        </div>
        <a
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 mt-4 rounded shadow-lg"
          href={"/auth/login"}
        >
          Track your portfolio
        </a>
      </main>
    );
  }
}
