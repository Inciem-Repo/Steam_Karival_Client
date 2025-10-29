import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/images/home.png";
import { useApi } from "../../hooks/useApi";
import { getAllQuiz, getQuizInfoByID } from "../../services/quiz";
import { getProfileService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useQuiz } from "../../context/QuizContext";

function Home() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const { callApi: callGetAllQuiz } = useApi(getAllQuiz);
  const { callApi: callGetProfile } = useApi(getProfileService);
  const { callApi: callGetQuizInfoByID } = useApi(getQuizInfoByID);
  const { user } = useAuth();
  const [isUserAttentedQuiz, setIsUserAttetedQuiz] = useState<boolean>(false);
  const [quizID, setQuizID] = useState<string>("");
  const { setQuiz } = useQuiz();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizResponse = await callGetAllQuiz();
        const profileResponse = await callGetProfile(user?.id);
        setIsUserAttetedQuiz(profileResponse?.user?.is_quiz_attempted);
        setQuizID(quizResponse?.quizzes[0]._id);
      } catch (err) {}
    };
    fetchData();
  }, []);

  const startCountdown = async () => {
    try {
      const quizData = await callGetQuizInfoByID(quizID);

      if (quizData?.quiz) {
        setQuiz(quizData.quiz);
        setCountdown(3);
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    }
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      navigate("/quiz");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <main className="flex h-auto w-[362px] max-w-full px-4 py-12 relative flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-8 relative self-stretch w-full">
          {countdown !== null ? (
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary-light border-4 border-primary">
                <span className="font-h1-bold text-5xl">{countdown}</span>
              </div>
              <h2 className="text-2xl font-h1-bold">Get Ready!</h2>
            </div>
          ) : (
            <>
              <img
                className="relative w-full max-w-[280px] h-auto object-contain"
                alt="Welcome illustration"
                src={home}
              />

              <div className="flex flex-col items-center gap-4 font-h1-bold w-full">
                <h1 className="text-center">
                  Welcome to
                  <br />
                  Stream Karnival
                </h1>
                {isUserAttentedQuiz ? (
                  <p className="relative flex items-center justify-center self-stretch font-body-regular text-xs text-center tracking-[0] leading-[16px] px-4">
                    Congratulations on completing your quiz. Consistent practice
                    helps you grow — keep going to achieve excellence.
                  </p>
                ) : (
                  <p className="relative flex items-center justify-center self-stretch font-body-regular text-xs text-center tracking-[0] leading-[16px] px-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Quis autem vel eum iure reprehenderit qui in ea voluptate
                    velit esse quam nihil molestiae consequatur
                  </p>
                )}
              </div>
              {isUserAttentedQuiz ? (
                <button
                  className="flex flex-col w-full btn"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </button>
              ) : (
                <button
                  className="flex flex-col w-full btn"
                  onClick={startCountdown}
                >
                  Start Quiz
                </button>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
