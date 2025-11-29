import React from "react";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  btnName: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = "Confirm Action",
  message,
  btnName = "Confirm",
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal Card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 w-[90%] max-w-sm text-center">
        
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#1E88E5]/20 blur-2xl rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#42A5F5]/20 blur-2xl rounded-full"></div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-white mb-3 tracking-wide">
          {title}
        </h2>

        <p className="text-gray-300 text-sm mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-white/20 text-gray-200 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#1E88E5] hover:bg-[#42A5F5] text-white shadow-lg shadow-[#1E88E5]/30 transition"
          >
            {btnName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
