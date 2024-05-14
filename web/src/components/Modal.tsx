import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: React.ReactNode;
}

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    content 
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        {/* Content */}
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
            <h3 className="text-3xl font-semibold">{title}</h3>
            <button
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                ×
              </span>
            </button>
          </div>
          {/* Body */}
          <div className="relative flex-auto p-6">{content}</div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
            <button
              className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;