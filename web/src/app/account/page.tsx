"use client";

import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ContentWrapper from "@/components/ContentWrapper";
import UpdateAccountModal from "@/components/UpdateAccountModal";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Account() {
  const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

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
            <Button
              className="mt-2"
              onClick={() => setShowUpdateAccountModal(true)}
            >
              Update
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md space-x-4">
            <div>
              <h2 className="text-2xl font-semibold">
                Request a Copy of Your Data
              </h2>
              <p className="mt-2">
                Request a copy of all of the data that AlphaTracker has stored
                about you and your account.
              </p>
            </div>
            <Button className="mt-2">Request</Button>
          </div>
          <div className="flex flex-row justify-between items-center p-4 bg-white rounded-lg shadow-md space-x-4">
            <div>
              <h2 className="text-2xl font-semibold">Delete Account</h2>
              <p className="mt-2">
                Deleting your account will permanently remove all of your data
                from AlphaTracker.
              </p>
            </div>
            <Button
              className="mt-2"
              color="red"
              onClick={() => setShowDeleteAccountModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
      <UpdateAccountModal
        isOpen={showUpdateAccountModal}
        setIsOpen={setShowUpdateAccountModal}
      />
      <ConfirmDeleteModal
        isOpen={showDeleteAccountModal}
        deletionPrompt="Are you sure you want to delete your account? This action is irreversible."
        onDelete={() => {
          toast.success("Account deleted successfully");
        }}
        onCancel={() => setShowDeleteAccountModal(false)}
      />
    </ContentWrapper>
  );
}
