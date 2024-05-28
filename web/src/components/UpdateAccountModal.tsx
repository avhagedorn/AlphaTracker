import { fetchSS, fetchServer } from "@/lib/fetch";
import Button from "./Button";
import Modal from "./Modal";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface AccountUpdateModalProps {
  isOpen: boolean;
  setIsOpen: (show: boolean) => void;
}

export default function UpdateAccountModal({
  isOpen,
  setIsOpen,
}: AccountUpdateModalProps) {
  const { data } = useQuery("me", () => fetchSS("/user/me"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const response = await fetchServer("/user/update", {
      method: "POST",
      body: JSON.stringify({
        username: data.get("username") as string,
        email: data.get("email") as string,
      }),
    });

    if (response.data) {
      setIsOpen(false);
      toast.success("Account updated!");
      queryClient.invalidateQueries("me");
    } else {
      toast.error("Failed to submit: " + response.error);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Update Account Information"
      size="small"
    >
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          defaultValue={data?.username}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
          required
        />
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mt-4"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          defaultValue={data?.email}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-emerald-500"
          required
        />
        <div className="flex justify-start mt-4">
          <Button type="submit" isLoading={isSubmitting}>
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}
