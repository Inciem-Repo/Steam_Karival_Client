import { useState, useEffect, type JSX } from "react";
import ResultCard from "../../components/common/ResultCard";
import { useApi } from "../../hooks/useApi";
import { getUserQuizInfo } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Question {
  question_id: string;
  correct_answer: string;
  user_answer: string;
  is_correct: boolean;
  options: string[];
  question?: string;
}

interface Quiz {
  quiz_id: string;
  quiz_title: string;
  quiz_description: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken: number;
  submitted_at: string;
  questions: Question[];
}

interface UserInfo {
  user_id: string;
  name: string;
  email: string;
  total_quizzes_attempted: number;
}

interface QuizResponse {
  status: boolean;
  message: string;
  quizzes: Quiz[];
  user_info: UserInfo;
}

export const Results = (): JSX.Element => {
  const [latestQuiz, setLatestQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAttempted, setHasAttempted] = useState(false);
  const navigator = useNavigate();
  const { callApi: callGetUserQuizInfo } = useApi(getUserQuizInfo);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = (await callGetUserQuizInfo(user.id)) as QuizResponse;

        if (response.status && response.quizzes.length > 0) {
          setLatestQuiz(response.quizzes[0]);
          setHasAttempted(true);
        } else {
          setHasAttempted(false);
        }
      } catch (error) {
        console.error("Error fetching quiz results:", error);
        setHasAttempted(false);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResult();
  }, [user?.id]);

  const handleBackToHome = () => {
    localStorage.removeItem("quizAnswers");
    localStorage.removeItem("quizState");
    navigator("/");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <main className="flex h-auto w-[362px] max-w-full px-4 py-8 relative flex-col items-center gap-6">
          <div className="text-lg">Loading results...</div>
        </main>
      </div>
    );
  }

  if (!hasAttempted || !latestQuiz) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <main className="flex h-auto w-[362px] max-w-full px-4 py-8 relative flex-col items-start gap-6 max-h-screen overflow-y-auto">
          <div className="flex items-center justify-between relative self-stretch w-full">
            <button
              onClick={handleBackToHome}
              className="flex items-center justify-center w-8 h-8"
            >
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
                  strokeWidth="0.5"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.8916 18.4417C10.7746 18.3245 10.7089 18.1656 10.7089 18C10.7089 17.8344 10.7746 17.6755 10.8916 17.5583L15.8916 12.5583C15.9489 12.4969 16.0179 12.4477 16.0945 12.4135C16.1712 12.3794 16.254 12.361 16.3379 12.3595C16.4218 12.358 16.5052 12.3735 16.583 12.4049C16.6608 12.4363 16.7315 12.4831 16.7908 12.5425C16.8502 12.6018 16.897 12.6725 16.9284 12.7503C16.9598 12.8282 16.9753 12.9115 16.9738 12.9954C16.9723 13.0794 16.954 13.1621 16.9198 13.2388C16.8856 13.3155 16.8364 13.3845 16.775 13.4417L12.8416 17.375H24.6666C24.8324 17.375 24.9914 17.4409 25.1086 17.5581C25.2258 17.6753 25.2916 17.8342 25.2916 18C25.2916 18.1658 25.2258 18.3247 25.1086 18.4419C24.9914 18.5592 24.8324 18.625 24.6666 18.625H12.8416L16.775 22.5583C16.8364 22.6156 16.8856 22.6846 16.9198 22.7612C16.954 22.8379 16.9723 22.9206 16.9738 23.0046C16.9753 23.0885 16.9598 23.1718 16.9284 23.2497C16.897 23.3275 16.8502 23.3982 16.7908 23.4575C16.7315 23.5169 16.6608 23.5637 16.583 23.5951C16.5052 23.6265 16.4218 23.642 16.3379 23.6405C16.254 23.639 16.1712 23.6206 16.0945 23.5865C16.0179 23.5523 15.9489 23.5031 15.8916 23.4417L10.8916 18.4417Z"
                  fill="black"
                />
              </svg>
            </button>
            <button
              className="flex items-center justify-center w-8 h-8"
              onClick={() => navigator("/profile")}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 3C9.7155 3 3 9.7155 3 18C3 26.2845 9.7155 33 18 33C26.2845 33 33 26.2845 33 18C33 9.7155 26.2845 3 18 3Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.40649 27.519C6.40649 27.519 9.74999 23.25 18 23.25C26.25 23.25 29.595 27.519 29.595 27.519M18 18C19.1935 18 20.3381 17.5259 21.182 16.682C22.0259 15.8381 22.5 14.6935 22.5 13.5C22.5 12.3065 22.0259 11.1619 21.182 10.318C20.3381 9.47411 19.1935 9 18 9C16.8065 9 15.6619 9.47411 14.818 10.318C13.9741 11.1619 13.5 12.3065 13.5 13.5C13.5 14.6935 13.9741 15.8381 14.818 16.682C15.6619 17.5259 16.8065 18 18 18Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col items-center gap-6 relative self-stretch w-full">
            <div className="w-full flex items-start">
              <h1 className="relative font-h1-bold text-black tracking-[var(--h1-bold-letter-spacing)] leading-[var(--h1-bold-line-height)] [font-style:var(--h1-bold-font-style)]">
                Quiz Result
              </h1>
            </div>

            <div className="bg-white rounded-lg p-6 text-center border border-black/10 w-full">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">No Quiz Attempts</h3>
              <p className="text-gray-600 mb-4">
                You haven't attempted any quizzes yet.
              </p>
              <button
                onClick={() => navigator("/home")}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Take a Quiz
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { correct_answers, total_questions, questions } = latestQuiz;
  const wrongCount = total_questions - correct_answers;

  return (
    <div className="w-full flex items-center justify-center">
      <main className="flex h-auto w-[362px] max-w-full px-4 py-8 relative flex-col items-start gap-6 ">
        <div className="flex items-center justify-between relative self-stretch w-full">
          <button
            onClick={handleBackToHome}
            className="flex items-center justify-center w-8 h-8"
          >
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
                strokeWidth="0.5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8916 18.4417C10.7746 18.3245 10.7089 18.1656 10.7089 18C10.7089 17.8344 10.7746 17.6755 10.8916 17.5583L15.8916 12.5583C15.9489 12.4969 16.0179 12.4477 16.0945 12.4135C16.1712 12.3794 16.254 12.361 16.3379 12.3595C16.4218 12.358 16.5052 12.3735 16.583 12.4049C16.6608 12.4363 16.7315 12.4831 16.7908 12.5425C16.8502 12.6018 16.897 12.6725 16.9284 12.7503C16.9598 12.8282 16.9753 12.9115 16.9738 12.9954C16.9723 13.0794 16.954 13.1621 16.9198 13.2388C16.8856 13.3155 16.8364 13.3845 16.775 13.4417L12.8416 17.375H24.6666C24.8324 17.375 24.9914 17.4409 25.1086 17.5581C25.2258 17.6753 25.2916 17.8342 25.2916 18C25.2916 18.1658 25.2258 18.3247 25.1086 18.4419C24.9914 18.5592 24.8324 18.625 24.6666 18.625H12.8416L16.775 22.5583C16.8364 22.6156 16.8856 22.6846 16.9198 22.7612C16.954 22.8379 16.9723 22.9206 16.9738 23.0046C16.9753 23.0885 16.9598 23.1718 16.9284 23.2497C16.897 23.3275 16.8502 23.3982 16.7908 23.4575C16.7315 23.5169 16.6608 23.5637 16.583 23.5951C16.5052 23.6265 16.4218 23.642 16.3379 23.6405C16.254 23.639 16.1712 23.6206 16.0945 23.5865C16.0179 23.5523 15.9489 23.5031 15.8916 23.4417L10.8916 18.4417Z"
                fill="black"
              />
            </svg>
          </button>
          <button
            className="flex items-center justify-center w-8 h-8"
            onClick={() => navigator("/profile")}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 3C9.7155 3 3 9.7155 3 18C3 26.2845 9.7155 33 18 33C26.2845 33 33 26.2845 33 18C33 9.7155 26.2845 3 18 3Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.40649 27.519C6.40649 27.519 9.74999 23.25 18 23.25C26.25 23.25 29.595 27.519 29.595 27.519M18 18C19.1935 18 20.3381 17.5259 21.182 16.682C22.0259 15.8381 22.5 14.6935 22.5 13.5C22.5 12.3065 22.0259 11.1619 21.182 10.318C20.3381 9.47411 19.1935 9 18 9C16.8065 9 15.6619 9.47411 14.818 10.318C13.9741 11.1619 13.5 12.3065 13.5 13.5C13.5 14.6935 13.9741 15.8381 14.818 16.682C15.6619 17.5259 16.8065 18 18 18Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 relative self-stretch w-full">
          <div className="w-full flex items-start">
            <h1 className="relative font-h1-bold text-black tracking-[var(--h1-bold-letter-spacing)] leading-[var(--h1-bold-line-height)] [font-style:var(--h1-bold-font-style)]">
              Quiz Result
            </h1>
          </div>
          <ResultCard
            score={correct_answers}
            total={total_questions}
            correctCount={correct_answers}
            wrongCount={wrongCount}
          />

          <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
            <h3 className="font-[number:var(--h2-medium-font-weight)] text-[length:var(--h2-medium-font-size)] font-h2-medium text-black tracking-[var(--h2-medium-letter-spacing)] leading-[var(--h2-medium-line-height)] [font-style:var(--h2-medium-font-style)]">
              Answers
            </h3>

            <div className="flex flex-col items-start gap-4 relative self-stretch w-full">
              {questions.map((question, index) => (
                <div
                  key={question.question_id}
                  className="bg-white rounded-lg p-4 flex flex-col gap-2 relative self-stretch w-full border border-black/10"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="[font-family:'Manrope',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px]">
                        Question {index + 1}
                      </p>
                      {question.is_correct ? (
                        <span className="text-green-600 text-xs">
                          ✓ Correct
                        </span>
                      ) : (
                        <span className="text-red-600 text-xs">✗ Wrong</span>
                      )}
                    </div>
                    <p className="[font-family:'Manrope',Helvetica] font-normal text-black text-sm tracking-[0] leading-[18px]">
                      {question?.question}
                    </p>
                  </div>
                  {question.options && question.options.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold mb-1">Options:</p>
                      <div className="grid grid-cols-1 gap-1">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`text-xs p-1 rounded ${
                              option === question.correct_answer
                                ? "bg-green-100 text-green-800"
                                : option === question.user_answer &&
                                  !question.is_correct
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
