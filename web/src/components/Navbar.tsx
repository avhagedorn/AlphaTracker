import React from "react";
import "@/style/loading.css";
import StockSearch from "./StockSearch";

interface NavbarProps {
  userIsAuthenticated: boolean;
}

export default function Navbar({ userIsAuthenticated }: NavbarProps) {
  if (!userIsAuthenticated) {
    return (
      <div className="px-8 top-0 w-full">
        <div className="flex justify-between items-center space-x-4 font-bold">
          <div className="py-4 flex-none">
            <a href="/" className="mr-4">
              [⍺T]
            </a>
          </div>
          <div className="py-4 flex-none">
            <a href="/auth/login" className="mr-4">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-8 top-0 w-full">
        <div className="flex justify-center items-center space-x-4 font-bold">
          <div className="py-4 flex-none">
            <a href="/home" className="mr-4">
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
}
