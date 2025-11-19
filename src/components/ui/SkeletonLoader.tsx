const SkeletonLoader = ({
  variant = "text",
  lines = 3,
  width = "full",
  height = "auto",
  circle = false,
  animated = true,
  className = "",
}: {
  variant?: "text" | "card" | "image";
  lines?: number;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  animated?: boolean;
  className?: string;
}) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case "text":
        return (
          <div className="space-y-3 p-3">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={index}
                className={`h-4 bg-gray-200 rounded ${
                  index === lines - 1 ? "w-3/4" : "w-full"
                }`}
              />
            ))}
          </div>
        );

      case "card":
        return (
          <div className="border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-3">
            <div
              className={`bg-gray-200 rounded ${
                circle ? "rounded-full" : "rounded-lg"
              }`}
              style={{
                width: circle ? width : "100%",
                height: circle ? width : height,
              }}
            />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const skeletonStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${animated ? "animate-pulse" : ""} ${className}`}
      style={skeletonStyle}
      role="status"
      aria-label="Loading..."
    >
      {getSkeletonContent()}
    </div>
  );
};

export default SkeletonLoader;
