import dynamic from "next/dynamic";

export default function Home() {
  const CompareGraph = dynamic(() => import("@/components/CompareGraph"), {
    ssr: false,
    loading: () => null,
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-lg text-center">
          Track your portfolio against the market
        </p>
      </header>
      <a 
        className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 mt-4 rounded shadow-lg"
        href="/home"
      >
        Track your portfolio
      </a>
    </main>
  );
}
