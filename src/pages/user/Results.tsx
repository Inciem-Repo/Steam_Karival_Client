import { useState, useEffect } from "react";
import ResultCard from "../../components/common/ResultCard";
import { useApi } from "../../hooks/useApi";
import { getUserQuizInfo } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Quiz } from "../../utils/types/user";

const Results = () => {
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
        const response = await callGetUserQuizInfo(user.id);
        if (response.status && response.quizzes.length > 0) {
          const latestAttempt = response.quizzes[0];
          setLatestQuiz(latestAttempt);
          setHasAttempted(true);
        } else {
          setHasAttempted(false);
        }
      } catch (error) {
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
    navigator("/home");
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
              <h3 className="text-lg font-semibold mb-2">No Quiz Attempts</h3>
              <p className="text-gray-600 mb-4">
                You haven't attempted any quizzes yet.
              </p>
              <button
                onClick={() => navigator("/")}
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

  // const questionCount = latestQuiz.questions.length;
  // const correctCount = latestQuiz.correct_answers;
  // const wrongCount = questionCount - correctCount;

  return (
  <div className="min-h-screen w-full bg-gradient-to-br from-[#0A1A2F] to-[#10263F] flex items-center justify-center px-4 py-10 relative font-manrope overflow-hidden">

    {/* Background Glows */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-28 -left-20 w-96 h-96 bg-[#1E88E5]/20 blur-[140px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#42A5F5]/20 blur-[150px] rounded-full" />
    </div>

    {/* LOADING */}
    {loading && (
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg md:max-w-2xl text-center text-gray-200">
        <p className="text-lg animate-pulse">Loading results...</p>
      </div>
    )}

    {/* NO ATTEMPTS */}
    {!loading && (!hasAttempted || !latestQuiz) && (
      <main className="relative bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg md:max-w-2xl">

        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBackToHome} className="text-white opacity-70 hover:opacity-100 transition">
            <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 28 L10 18 L20 8" />
            </svg>
          </button>

          <button onClick={() => navigator("/profile")} className="text-white opacity-70 hover:opacity-100">
            <svg width="34" height="34" stroke="white" strokeWidth="1.5" fill="none">
              <circle cx="17" cy="17" r="14" />
              <circle cx="17" cy="13" r="4" />
              <path d="M7,27 Q17,19 27,27" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-6">Quiz Result</h1>

          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-xl text-white font-semibold mb-2">No Quiz Attempts</h3>
            <p className="text-gray-300 mb-4">
              You haven't attempted any quizzes yet.
            </p>

            <button
              onClick={() => navigator("/")}
              className="bg-[#1E88E5] hover:bg-[#42A5F5] text-white font-medium rounded-xl px-6 py-3 shadow-lg shadow-[#1E88E5]/30 transition"
            >
              Take a Quiz
            </button>
          </div>
        </div>
      </main>
    )}

    {/* SUCCESSFUL RESULT */}
    {!loading && hasAttempted && latestQuiz && (
      <main className="relative bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-lg md:max-w-2xl">

        {/* Header Row */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={handleBackToHome} className="text-white opacity-70 hover:opacity-100 transition">
            <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2">
              <path d="M20 28 L10 18 L20 8" />
            </svg>
          </button>

          <button onClick={() => navigator("/profile")} className="text-white opacity-70 hover:opacity-100 transition">
            <svg width="34" height="34" stroke="white" strokeWidth="1.5" fill="none">
              <circle cx="17" cy="17" r="14" />
              <circle cx="17" cy="13" r="4" />
              <path d="M7,27 Q17,19 27,27" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Quiz Result</h1>

          {/* Result Card */}
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
            <ResultCard
              score={latestQuiz.correct_answers}
              total={latestQuiz.questions.length}
              correctCount={latestQuiz.correct_answers}
              wrongCount={latestQuiz.questions.length - latestQuiz.correct_answers}
            />
          </div>

          {/* View Profile */}
          <button
            onClick={() => navigator("/profile")}
            className="w-full bg-[#1E88E5] hover:bg-[#42A5F5] text-white font-semibold rounded-xl py-3 shadow-lg shadow-[#1E88E5]/30 transition"
          >
            View Profile
          </button>
        </div>
      </main>
    )}

  </div>
);

};
export default Results;
