"use client";

import ContentWrapper from "@/components/ContentWrapper";
import { fetchSS } from "@/lib/fetch";
import dynamic from "next/dynamic";
import { useQuery } from "react-query";

const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
  ssr: false,
  loading: () => null,
});

export default function PortfolioDetail({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { data, status, error, isFetching } = useQuery("portfolio", () =>
    fetchSS(`/portfolio/${params.id}`),
  );

  if (isFetching) {
    return null;
  }

  if (status === "error") {
    return <div>{String(error)}</div>;
  }

  return (
    <ContentWrapper userIsAuthenticated>
      <div className="flex flex-col items-center p-24">
        <header className="flex flex-col items-center">
          <h1>{data.name}</h1>
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
      </div>
    </ContentWrapper>
  );
}
