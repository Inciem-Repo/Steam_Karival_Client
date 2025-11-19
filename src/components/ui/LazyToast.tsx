import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

export default function LazyToast() {
  useEffect(() => {
    import("react-toastify/dist/ReactToastify.css");
  }, []);

  return (
    <ToastContainer position="top-center" autoClose={3000} theme="colored" />
  );
}
