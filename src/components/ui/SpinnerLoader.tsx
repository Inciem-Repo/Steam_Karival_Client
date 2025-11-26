import { useState, useEffect } from "react";

const SpinnerLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="mt-4 text-white text-center">
          <p className="text-lg font-semibold">Loading</p>
          <p className="text-sm text-gray-300">Please wait...</p>
        </div>
      </div>
    </div>
  );
};

export default SpinnerLoader;
