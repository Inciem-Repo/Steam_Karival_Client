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
    <div className="bg-primary-light rounded-[12px] p-4 flex flex-col items-center gap-4 w-full max-w-[360px] shadow-sm">
      <div className="flex w-full justify-between items-start">
        <div className="flex flex-col gap-3 items-start">
          <h2 className="font-h1-bold font-semibold text-[40px] leading-none text-black">
            {score}/{total}
          </h2>
          <p className="font-body-semibold font-normal text-start text-black">
            Great job! You've completed the quiz successfully.
          </p>

          <div className="flex gap-10 font-body-semibold text-black">
            <div className="flex flex-col items-center">
              <span className="font-h2-medium">{correctCount || 0}</span>
              <span className="font-h2-medium">Correct</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-h2-medium">{wrongCount || 0}</span>
              <span className="font-h2-medium">Wrong</span>
            </div>
          </div>
        </div>

        <img
          src={resultIcon}
          alt="Result icon"
          className="w-[120px] h-[120px] object-contain"
        />
      </div>
    </div>
  );
};

export default ResultCard;
