import { fetchServer } from "@/lib/fetch";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";

interface CreatePortfolioModalProps {
  isOpen: boolean;
  setIsOpen: (show: boolean) => void;
  onCreate: () => void;
}

export default function CreatePortfolioModal(
{ 
  isOpen, 
  setIsOpen,
  onCreate
} : CreatePortfolioModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleCreatePortfolio = async (event: React.FormEvent<HTMLFormElement>) => {
      setIsSubmitting(true);
      event.preventDefault();
  
      const form = event.currentTarget;
      const data = new FormData(form);
      const response = await fetchServer("/portfolio/new", {
        method: "POST",
        body: JSON.stringify({
          name: data.get('name') as string,
          description: data.get('description') as string,
        }),
      });
  
      if (response.data) {
        setIsOpen(false);
        onCreate();
      } else {
        alert("Failed to create portfolio: " + response.error);
      }
      setIsSubmitting(false);
    }
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create a new portfolio"
      >
        <form onSubmit={handleCreatePortfolio}>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            minLength={3}
            maxLength={32}
            required
          />
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-4">
            Description (optional)
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
            maxLength={255}
          />
          <div className="flex justify-start mt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>
    );
}
