import React from "react";
import resultIcon from "../../assets/images/result.png";

interface ResultCardProps {
  score: number;
  total: number;
  correctCount: number;
  wrongCount: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  score,
  total,
  correctCount,
  wrongCount,
}) => {
  return (
    <div
      className="
        bg-white/10 
        backdrop-blur-xl 
        border border-white/10 
        shadow-xl shadow-[#1E88E5]/10
        rounded-2xl 
        p-6 
        w-full 
        max-w-xl 
        flex flex-col 
        md:flex-row 
        items-center 
        justify-between 
        gap-6
      "
    >
      {/* Left Section */}
      <div className="flex flex-col items-start gap-4">
        <h2 className="text-4xl font-extrabold text-white leading-none">
          {score}/{total}
        </h2>

        <p className="text-gray-300 text-sm md:text-base max-w-[260px]">
          Great job! You've completed the quiz successfully.
        </p>

        <div className="flex gap-10 text-white mt-2">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{correctCount || 0}</span>
            <span className="text-gray-300 text-sm">Correct</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">{wrongCount || 0}</span>
            <span className="text-gray-300 text-sm">Wrong</span>
          </div>
        </div>
      </div>

      {/* Right - Illustration */}
      <div className="flex-shrink-0">
        <img
          src={resultIcon}
          alt="Result"
          className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default ResultCard;
