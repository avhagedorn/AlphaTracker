import { fetchSS, fetchServer } from "@/lib/fetch";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";
import { Portfolio } from "@/types";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { toast } from "react-toastify";

interface PortfolioModalProps {
  isOpen: boolean;
  setIsOpen: (show: boolean) => void;
  onSubmit: () => void;
  existingPortfolio?: Portfolio;
}

export default function PortfolioModal({
  isOpen,
  setIsOpen,
  onSubmit,
  existingPortfolio,
}: PortfolioModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const url = existingPortfolio
      ? `/portfolio/${existingPortfolio.id}/update`
      : "/portfolio/new";
    const response = await fetchServer(url, {
      method: "POST",
      body: JSON.stringify({
        name: data.get("name") as string,
        description: data.get("description") as string,
      }),
    });

    if (response.data) {
      setIsOpen(false);
      onSubmit();
    } else {
      toast.error("Failed to submit: " + response.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => {
    setIsDeleteModalOpen(false);
    const response = await fetchServer(`/portfolio/${id}/delete`, {
      method: "POST",
    });

    if (response.data) {
      window.location.href = "/home";
    } else {
      toast.error("Failed to delete: " + response.error);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={existingPortfolio ? "Edit Portfolio" : "Create Portfolio"}
        size="small"
      >
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter a name (e.g. 'Memestocks 🤑')"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            minLength={3}
            maxLength={32}
            required
            defaultValue={existingPortfolio ? existingPortfolio.name : ""}
          />
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Investment Thesis (optional)
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Your investment thesis for this strategy (e.g. '$TSLA and $GME only 🚀')"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            maxLength={255}
            defaultValue={
              existingPortfolio ? existingPortfolio.description : ""
            }
          />
          <div className="flex justify-start mt-2">
            <Button type="submit" isLoading={isSubmitting}>
              {existingPortfolio ? "Save" : "Create"}
            </Button>
          </div>
        </form>
        {/* horizontal line */}
        {existingPortfolio && (
          <>
            <div className="border-t border-gray-200 mt-4" />
            <div className="mt-4">
              <h3 className="text-lg font-bold">Delete Portfolio</h3>
              <p className="text-sm text-gray-500">
                Deleting a portfolio is irreversible. This action will remove
                all transactions associated with this portfolio.
              </p>
            </div>
            <div className="flex justify-start mt-4">
              <Button
                color="red"
                type="button"
                className="text-gray-500"
                onClick={() => {
                  setIsOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </Modal>
      {existingPortfolio && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          deletionPrompt={`Are you sure you want to delete ${existingPortfolio.name}?`}
          onDelete={() => handleDelete(existingPortfolio.id)}
          onCancel={() => {
            setIsOpen(true);
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </>
  );
}
