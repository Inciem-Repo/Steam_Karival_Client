import React, { useState, useEffect, type JSX } from "react";
import { quizQuestions } from "../../utils/constants/quizzData";
import { useQuiz } from "../../context/QuizContext";

interface QuizState {
  currentQuestion: number;
  answers: (number | null)[];
  timeLeft: number;
}

const QUESTION_TIME = 6;
const TOTAL_QUESTIONS = quizQuestions.length;

export const Quiz = (): JSX.Element => {
  //   const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null)
  );
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const { quiz } = useQuiz();

  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const state: QuizState = JSON.parse(savedState);
      setCurrentQuestion(state.currentQuestion);
      setAnswers(state.answers);
      setTimeLeft(state.timeLeft);
      setSelectedOption(state.answers[state.currentQuestion]);
    }
  }, []);

  useEffect(() => {
    const state: QuizState = {
      currentQuestion,
      answers,
      timeLeft,
    };
    localStorage.setItem("quizState", JSON.stringify(state));
  }, [currentQuestion, answers, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQuestion]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedOption(answers[nextQuestion]);
      setTimeLeft(QUESTION_TIME);
    } else {
      localStorage.setItem("quizAnswers", JSON.stringify(answers));
      localStorage.removeItem("quizState");
      //   setLocation("/results");
    }
  };

  const handleBack = () => {
    // setLocation("/home");
  };

  const question = quizQuestions[currentQuestion];
  const progress = `${currentQuestion}/${TOTAL_QUESTIONS}`;

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <main className="flex h-auto w-[362px] max-w-full px-4 py-8 relative flex-col items-start gap-6">
        <div className="flex items-center justify-between relative self-stretch w-full">
          <button onClick={handleBack}>
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.25"
                width="35.5"
                height="35.5"
                rx="17.75"
                stroke="black"
                stroke-width="0.5"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.8916 18.4417C10.7746 18.3245 10.7089 18.1656 10.7089 18C10.7089 17.8344 10.7746 17.6755 10.8916 17.5583L15.8916 12.5583C15.9489 12.4969 16.0179 12.4477 16.0945 12.4135C16.1712 12.3794 16.254 12.361 16.3379 12.3595C16.4218 12.358 16.5052 12.3735 16.583 12.4049C16.6608 12.4363 16.7315 12.4831 16.7908 12.5425C16.8502 12.6018 16.897 12.6725 16.9284 12.7503C16.9598 12.8282 16.9753 12.9115 16.9738 12.9954C16.9723 13.0794 16.954 13.1621 16.9198 13.2388C16.8856 13.3155 16.8364 13.3845 16.775 13.4417L12.8416 17.375H24.6666C24.8324 17.375 24.9914 17.4409 25.1086 17.5581C25.2258 17.6753 25.2916 17.8342 25.2916 18C25.2916 18.1658 25.2258 18.3247 25.1086 18.4419C24.9914 18.5592 24.8324 18.625 24.6666 18.625H12.8416L16.775 22.5583C16.8364 22.6156 16.8856 22.6846 16.9198 22.7612C16.954 22.8379 16.9723 22.9206 16.9738 23.0046C16.9753 23.0885 16.9598 23.1718 16.9284 23.2497C16.897 23.3275 16.8502 23.3982 16.7908 23.4575C16.7315 23.5169 16.6608 23.5637 16.583 23.5951C16.5052 23.6265 16.4218 23.642 16.3379 23.6405C16.254 23.639 16.1712 23.6206 16.0945 23.5865C16.0179 23.5523 15.9489 23.5031 15.8916 23.4417L10.8916 18.4417Z"
                fill="black"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
          <h2 className="font-h1-bold">Question : {currentQuestion + 1}</h2>

          <div className="flex items-center justify-between relative self-stretch w-full">
            <span className="font-body-regular">{progress}</span>
            <span className="font-body-regular">
              0:{timeLeft.toString().padStart(2, "0")} sec
            </span>
          </div>

          <p className="font-h2-medium tracking-[0] leading-[20px]">
            {question.question}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`flex items-center gap-3 px-4 py-3 relative self-stretch w-full rounded-[10px] border border-black transition-colors ${
                selectedOption === index
                  ? "bg-primary-light"
                  : "bg-transparent hover:bg-black/5"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200
                 ${
                   selectedOption === index
                     ? "bg-primary-light border-[1.5px] border-black"
                     : "bg-white border-[1.5px] border-black"
                 }`}
              >
                {selectedOption === index && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>

              <span className="[font-family:'Manrope',Helvetica] font-normal text-black text-sm tracking-[0]">
                {option}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-6 py-3 relative self-end btn"
        >
          <span>Next</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </main>
    </div>
  );
};
