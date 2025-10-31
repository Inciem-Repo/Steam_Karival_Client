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
  const { user, loading: authLoading } = useAuth();
  const [isUserAttendedQuiz, setIsUserAttendedQuiz] = useState<boolean>(false);
  const [quizID, setQuizID] = useState<string>("");
  const { setQuiz } = useQuiz();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const [profileResponse, quizResponse] = await Promise.all([
          callGetProfile(user.id),
          callGetAllQuiz(),
        ]);

        setIsUserAttendedQuiz(
          profileResponse?.user?.is_quiz_attempted || false
        );
        if (quizResponse?.quizzes?.length > 0) {
          setQuizID(quizResponse.quizzes[0]._id);
        } else {
          setQuizID("");
        }
      } catch (err) {
        console.error("Error fetching data");
        setIsUserAttendedQuiz(false);
        setQuizID("");
      } finally {
      }
    };

    if (!authLoading && user?.id) {
      fetchData();
    }
  }, [user, authLoading]);

  const startCountdown = async () => {
    try {
      if (!quizID) return;

      const quizData = await callGetQuizInfoByID(quizID);

      if (quizData?.quiz) {
        setQuiz(quizData.quiz);
        setCountdown(3);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error starting quiz:");
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
  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
                {isUserAttendedQuiz ? (
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
              {isUserAttendedQuiz ? (
                <button
                  className="flex flex-col w-full btn"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </button>
              ) : quizID ? (
                <button
                  className="flex flex-col w-full btn"
                  onClick={startCountdown}
                >
                  Start Quiz
                </button>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No Quiz Available Right Now
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
