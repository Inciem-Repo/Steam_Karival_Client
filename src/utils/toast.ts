import { toast } from "react-toastify";

export const showError = (err: any) => {
  if (!err) return;
  const status = err.response?.status;
  if (status >= 400 && status < 500) {
    toast.error(err.response?.data?.error || "Invalid request.");
    return;
  }

  if (status >= 500) {
    toast.error("Server error! Please try again later.");
    return;
  }

  if (err.message === "Network Error") {
    toast.error("Network issue. Check your connection.");
    return;
  }

  toast.error("Something went wrong. Please try again.");
};
