import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/images/home.png";
import { useApi } from "../../hooks/useApi";
import { getQuizInfoByID } from "../../services/quiz";
import { getProfileService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useQuiz } from "../../context/QuizContext";
import { PromoBanner } from "../../components/common/PromoBanner";
import { quizCategory } from "../../utils/constants/values";

function Home() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const { callApi: callGetProfile } = useApi(getProfileService);
  const { callApi: callGetQuizInfoByID, loading: loadingQuizInfo } =
    useApi(getQuizInfoByID);
  const { user, loading: authLoading } = useAuth();
  const [isUserAttendedQuiz, setIsUserAttendedQuiz] = useState<boolean>(false);
  const { quiz, setQuiz } = useQuiz();
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        setDataLoading(true);
        const [profileResponse] = await Promise.all([callGetProfile(user.id)]);
        setIsUserAttendedQuiz(
          profileResponse?.user?.stats?.is_quiz_attempted || false
        );
      } catch (err) {
        console.error("Error fetching data");
        setIsUserAttendedQuiz(false);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading && user?.id) {
      fetchData();
    } else if (!authLoading) {
      setDataLoading(false);
    }
  }, [user, authLoading]);

  const startCountdown = async (level: string) => {
    try {
      setSelectedLevel(level);
      setCountdown(3);
      const quizData = await callGetQuizInfoByID(level);
      if (quizData?.quiz) {
        setQuiz(quizData.quiz);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error starting quiz:");
      navigate("/");
    }
  };

  const handleLevelSelection = async (level: string) => {
    if (!user) return;
    if (level === quizCategory.SCHOOL_LEVEL) {
      await startCountdown(level);
      return;
    }

    if (user.isPaid) {
      await startCountdown(level);
    } else {
      navigate("/payment");
    }
  };

  const getLevelButtonText = (level: string) => {
    switch (level) {
      case quizCategory.SCHOOL_LEVEL:
        return "School Level";
      case quizCategory.STATE_LEVEL:
        return "State Level";
      case quizCategory.NATIONAL_LEVEL:
        return "National Level";
      case quizCategory.GLOBAL_LEVEL:
        return "Global Level";
      default:
        return "Start Quiz";
    }
  };

  const getLevelDescription = (level: string) => {
    switch (level) {
      case quizCategory.SCHOOL_LEVEL:
        return "Begin your journey - Free";
      case quizCategory.STATE_LEVEL:
        return "Compete at state level";
      case quizCategory.NATIONAL_LEVEL:
        return "National championship";
      case quizCategory.GLOBAL_LEVEL:
        return "International challenge";
      default:
        return "";
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

  if (authLoading || dataLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  if (loadingQuizInfo && countdown === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Preparing your quiz...</p>
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
              <p className="text-center text-gray-600">
                Starting {getLevelButtonText(selectedLevel || "")}
              </p>
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
                  Steam Karnival
                </h1>
                {isUserAttendedQuiz ? (
                  <p className="relative flex items-center justify-center self-stretch font-body-regular text-xs text-center tracking-[0] leading-[16px] px-4">
                    Congratulations on completing your quiz. Consistent practice
                    helps you grow — keep going to achieve excellence.
                  </p>
                ) : (
                  <p className="relative flex items-center justify-center self-stretch font-body-regular text-xs text-center tracking-[0] leading-[16px] px-4">
                    Welcome aboard! Choose your level and begin your STEAM
                    journey.
                  </p>
                )}
              </div>
              {isUserAttendedQuiz ? (
                <button
                  className="flex flex-col w-full btn items-center justify-center"
                  onClick={() => navigate("/profile")}
                >
                  Go to Profile
                </button>
              ) : quiz ? (
                <>
                  <div className="flex flex-col gap-4 w-full">
                    {Object.values(quizCategory).map((level) => {
                      const isDisabled =
                        loadingQuizInfo || level !== user?.current_quiz_level;

                      return (
                        <button
                          key={level}
                          onClick={() => handleLevelSelection(level)}
                          disabled={isDisabled}
                          className={`flex flex-col w-full btn items-center p-4 transition-all 
                          ${
                            isDisabled
                              ? "opacity-40 cursor-not-allowed grayscale"
                              : "opacity-100"
                          }
                        `}
                        >
                          <span className="font-semibold">
                            {getLevelButtonText(level)}
                          </span>
                          <span className="text-xs opacity-80 mt-1">
                            {getLevelDescription(level)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 gap-6 mb-8 animate-fade-in">
                    <div className="flex gap-2">
                      <PromoBanner
                        icon="rocket"
                        title="WIN A TRIP TO NASA"
                        subtitle="Top performers get to visit NASA!"
                        variant="primary"
                      />
                      <PromoBanner
                        icon="trophy"
                        title="₹5 CRORE WORTH PRIZES"
                        subtitle="For top 100 schools"
                        variant="accent"
                      />
                    </div>
                    <div className="flex gap-2">
                      <PromoBanner
                        icon="brain"
                        title="NATIONAL ROBOTICS & AI MISSION"
                        subtitle="Join the future of technology"
                        variant="secondary"
                      />
                      <PromoBanner
                        icon="brain"
                        title="NaMo AI Mission"
                        subtitle="Official national initiative for AI & Robotics."
                        variant="secondary"
                      />
                    </div>
                  </div>
                </>
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
