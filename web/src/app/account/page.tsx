"use client";

import Button from "@/components/Button";
import ContentWrapper from "@/components/ContentWrapper";
import React from "react";

export default function Account() {
  return (
    <ContentWrapper userIsAuthenticated>
      <div className="w-1/3 mx-auto">
        <h1 className="text-4xl font-bold">Account</h1>
        <div className="flex flex-col space-y-4 mt-8">
          <div className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md space-x-4">
            <div>
              <h2 className="text-2xl font-semibold">Plaid Integration</h2>
              <p className="mt-2">
                To automatically import your past and future transactions,
                connect your brokerage account to AlphaTracker using Plaid.
              </p>
            </div>
            <Button className="mt-2">Connect</Button>
          </div>
          <div className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md space-x-4">
            <div>
              <h2 className="text-2xl font-semibold">Update Account</h2>
              <p className="mt-2">
                Update your account information such as your name, email, and
                password.
              </p>
            </div>
            <Button className="mt-2">Update</Button>
          </div>
          <div className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md space-x-4">
            <div>
              <h2 className="text-2xl font-semibold">Delete Account</h2>
              <p className="mt-2">
                Deleting your account will permanently remove all of your data
                from AlphaTracker.
              </p>
            </div>
            <Button className="mt-2" color="red">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
