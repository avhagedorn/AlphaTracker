"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [buttonLoading, setButtonLoading] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <header className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Home</h1>
        <p className="text-lg text-center">
          Track your portfolio against the market
        </p>
      </header>
      <Button
        onClick={() => {console.log("Track your portfolio"); setButtonLoading(true);}}
        isLoading={buttonLoading}
      >
        Track your portfolio
      </Button>
      <Link href="/api/auth/logout">
        Logout
      </Link>
    </main>
  );
}
