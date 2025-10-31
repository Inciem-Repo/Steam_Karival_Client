import React from "react";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  btnName: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Confirm Delete",
  message,
  btnName = "Delete",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            {btnName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
