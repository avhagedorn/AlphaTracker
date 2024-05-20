import React from "react";
import "@/style/loading.css";
import Image from "next/image";
import StockSearch from "./StockSearch";

export default function Navbar() {
  return (
    <div className="px-8 top-0 w-full">
      <div className="flex justify-center items-center space-x-4 font-bold">
        <div className="py-4 flex-none">
          <a href="/" className="mr-4">
            [⍺T]
          </a>
        </div>
        <div className="flex-auto text-center font-normal">
          <StockSearch />
        </div>
        <div className="py-4 flex-none">
          <a href="/account" className="mr-4">
            Account
          </a>
          <a href="/api/auth/logout">Logout</a>
        </div>
      </div>
    </div>
  );
}
