import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  deletionPrompt: string;
  onDelete: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  deletionPrompt,
  onDelete,
  onCancel,
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={"Confirm Deletion"}
      size={"small"}
    >
      <div>
        <p>{deletionPrompt}</p>
        <Button
          onClick={handleDelete}
          className={"mt-4"}
          color={"red"}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
