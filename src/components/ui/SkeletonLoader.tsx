const SkeletonLoader = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
}: {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  const containerClass = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 z-50"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
        {text && (
          <p className="text-gray-600 font-medium animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
};
export default SkeletonLoader;
