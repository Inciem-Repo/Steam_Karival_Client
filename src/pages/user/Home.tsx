import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import home from "../../assets/images/home.png";
import { useAuth } from "../../context/AuthContext";
import { useQuiz } from "../../context/QuizContext";
import { PromoBanner } from "../../components/common/PromoBanner";
import { quizCategory } from "../../utils/constants/values";
import { getAllQuizDetails } from "../../services/quiz";
import { useApi } from "../../hooks/useApi";
import type { QuizMeta } from "../../utils/types/quiz";

function Home() {
  const [countdown, setCountdown] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading, userLevels, refreshUser } = useAuth();
  const { fetchQuiz } = useQuiz();
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { callApi: callGetAllQuizDetails } = useApi(getAllQuizDetails);
  const [quizMeteData, setQuizMetaData] = useState<QuizMeta[]>([]);

  useEffect(() => {
    const getQuizMetaData = async () => {
      const quizDataResponse = await callGetAllQuizDetails();
      refreshUser();
      setQuizMetaData(quizDataResponse.data);
    };
    getQuizMetaData();
  }, []);

  const startCountdown = async (level: string) => {
    try {
      setSelectedLevel(level);
      setCountdown(3);
      fetchQuiz();
    } catch (err) {
      navigate("/");
    }
  };

  const handleLevelSelection = async (level: string) => {
    if (!user) return;

    const isActive = getIsLevelActive(level);
    if (!isActive) return;

    const levelData = getUserLevelData(level);
    if (levelData?.attempted) {
      navigate("/profile", { state: { level } });
      return;
    }

    const quizData = quizMeteData.find((quiz) => quiz.category === level);
    if (quizData?.is_free) {
      await startCountdown(level);
      return;
    }
    if (user?.paid_levels?.includes(level)) {
      await startCountdown(level);
    } else {
      navigate(`${"/payment?level="}${level}`);
    }
  };

  const getUserLevelData = (level: string) => {
    switch (level) {
      case quizCategory.SCHOOL_LEVEL:
        return userLevels?.school_level;
      case quizCategory.STATE_LEVEL:
        return userLevels?.state_level;
      case quizCategory.NATIONAL_LEVEL:
        return userLevels?.national_level;
      case quizCategory.GLOBAL_LEVEL:
        return userLevels?.global_level;
      default:
        return null;
    }
  };

  // Check if a level is active based on quizMeteData
  const getIsLevelActive = (level: string): boolean => {
    const quizData = quizMeteData.find((quiz) => quiz.category === level);
    return quizData ? quizData.is_active : false;
  };

  const getLevelButtonText = (level: string) => {
    const levelData = getUserLevelData(level);

    if (levelData?.attempted) {
      return "Download Certificate";
    }

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
    const levelData = getUserLevelData(level);
    const isActive = getIsLevelActive(level);

    if (!isActive) {
      return "Coming Soon";
    }

    if (levelData?.attempted) {
      return `Score: ${levelData.correct}/${levelData.total} (${levelData.percentage}%)`;
    }

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

  const isLevelEnabled = (level: string) => {
    const levelData = getUserLevelData(level);
    const isActive = getIsLevelActive(level);

    // Level is enabled if it's active AND (it's the user's current level OR it's been attempted)
    return (
      isActive && (level === user?.current_quiz_level || levelData?.attempted)
    );
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

                <p className="relative flex items-center justify-center self-stretch font-body-regular text-xs text-center tracking-[0] leading-[16px] px-4">
                  Welcome aboard! Choose your level and begin your STEAM
                  journey.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                {Object.values(quizCategory).map((level) => {
                  const isActive = getIsLevelActive(level);
                  const isDisabled = !isLevelEnabled(level);
                  const levelData = getUserLevelData(level);

                  return (
                    <button
                      key={level}
                      onClick={() => handleLevelSelection(level)}
                      disabled={isDisabled || !isActive}
                      className={`flex items-center w-full btn p-4 transition-all relative
                      ${
                        (isDisabled || !isActive) && !levelData?.attempted
                          ? "opacity-40 cursor-not-allowed grayscale"
                          : "opacity-100"
                      }
                        ${
                          levelData?.attempted
                            ? "bg-green-50 border-green-200 hover:bg-green-100"
                            : ""
                        }
                      `}
                    >
                      {levelData?.attempted && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Show inactive indicator for non-active levels */}
                      {!isActive && !levelData?.attempted && (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                      )}

                      <div className="flex flex-col items-start flex-1">
                        <span
                          className={`font-semibold text-left ${
                            levelData?.attempted
                              ? "text-green-800"
                              : !isActive
                              ? "text-gray-600"
                              : ""
                          }`}
                        >
                          {getLevelButtonText(level)}
                          {!isActive && " (Inactive)"}
                        </span>
                        <span
                          className={`text-xs opacity-80 mt-1 text-left ${
                            levelData?.attempted
                              ? "text-green-700"
                              : !isActive
                              ? "text-gray-500"
                              : ""
                          }`}
                        >
                          {getLevelDescription(level)}
                        </span>
                      </div>
                      {levelData?.attempted && (
                        <div className="ml-3 flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <button
                className="flex flex-col w-full btn items-center justify-center"
                onClick={() => navigate("/profile")}
              >
                Go to Profile
              </button>

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
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
