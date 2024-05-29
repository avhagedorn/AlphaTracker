"use client";

import Button from "@/components/Button";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";
import ContentWrapper from "@/components/ContentWrapper";
import Modal from "@/components/Modal";
import UpdateAccountModal from "@/components/UpdateAccountModal";
import { fetchSS } from "@/lib/fetch";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Account() {
  const [showUpdateAccountModal, setShowUpdateAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [dataRequestModalIsOpen, setDataRequestModalIsOpen] = useState(false);
  const [dataRequestIsSubmitting, setDataRequestIsSubmitting] = useState(false);

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
            <Button
              className="mt-2"
              onClick={() => setDataRequestModalIsOpen(true)}
            >
              Request
            </Button>
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
          fetchSS("/user/delete", { method: "POST" })
            .then(() => {
              toast.success("Account deleted successfully");
              setShowDeleteAccountModal(false);
              window.location.href = "/";
            })
            .catch(() => {
              toast.error("Failed to delete account");
              setShowDeleteAccountModal(false);
            });
        }}
        onCancel={() => setShowDeleteAccountModal(false)}
      />
      <Modal
        isOpen={dataRequestModalIsOpen}
        onClose={() => {
          setDataRequestModalIsOpen(false);
        }}
        title="Request a Copy of Your Data"
        size="small"
      >
        <p>
          Please allow up to 30 days for your data to be prepared. Your data
          will be delivered to the email address associated with your account.
          <span className="font-semibold">
            {" "}
            Emails may show up in your spam folder.
          </span>
        </p>
        <Button
          isLoading={dataRequestIsSubmitting}
          className="mt-4"
          onClick={() => {
            setDataRequestIsSubmitting(true);
            fetchSS("/email/create-data-request")
              .then(() => {
                setDataRequestIsSubmitting(false);
                setDataRequestModalIsOpen(false);
                toast.success("Data request submitted successfully");
              })
              .catch(() => {
                setDataRequestIsSubmitting(false);
                setDataRequestModalIsOpen(false);
                toast.error("Failed to submit data request");
              });
          }}
        >
          Request
        </Button>
      </Modal>
    </ContentWrapper>
  );
}
