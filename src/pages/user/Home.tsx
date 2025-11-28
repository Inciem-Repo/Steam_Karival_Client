// --- ALL LOGIC UNCHANGED ----
// ONLY UI/UX HAS BEEN REWRITTEN.
// ----------------------------------------------

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

  const getIsLevelActive = (level: string): boolean => {
    const quizData = quizMeteData.find((quiz) => quiz.category === level);
    return quizData ? quizData.is_active : false;
  };

  const getLevelButtonText = (level: string) => {
    const levelData = getUserLevelData(level);

    if (levelData?.attempted) return "Download Certificate";

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

    if (!isActive) return "Coming Soon";
    if (levelData?.attempted)
      return `Score: ${levelData.correct}/${levelData.total} (${levelData.percentage}%)`;

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

  // ------------------------------
  //         PREMIUM UI BELOW
  // ------------------------------

  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full 
      bg-gradient-to-b from-[#0A1A2F] to-[#10263F]
      flex justify-center px-4 py-10 relative overflow-hidden"
    >
      {/* Glow Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-0 w-96 h-96 bg-[#1E88E5]/20 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#42A5F5]/20 blur-[150px] rounded-full"></div>
      </div>

      <main className="w-full max-w-6xl flex flex-col gap-12 relative z-10">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row gap-12">
          {/* LEFT COLUMN */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-6 flex-1">
            <img
              src={home}
              alt="Welcome"
              className="w-[260px] md:w-[330px] h-auto mx-auto md:mx-0"
            />

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Welcome to <br /> Steam Karnival
            </h1>

            <p className="text-gray-300 max-w-sm">
              Welcome aboard! Choose your level and begin your STEAM journey.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6 flex-1">
            {/* CERTIFICATE PANEL */}
            <div
              className="
            bg-white/10 backdrop-blur-xl 
            border border-white/10 
            p-5 rounded-xl flex items-center gap-4 shadow-lg
          "
            >
              <div
                className="
              w-10 h-10 rounded-full 
              bg-[#1E88E5] flex items-center justify-center 
              text-white font-bold
            "
              >
                ✓
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-white text-lg">
                  Download Certificate
                </span>
                <span className="text-xs text-gray-300">Score: 0/0 (0%)</span>
              </div>
            </div>

            {/* LEVEL CARDS */}
            <div className="flex flex-col gap-4">
              {Object.values(quizCategory).map((level) => {
                const isActive = getIsLevelActive(level);
                const levelData = getUserLevelData(level);
                const isDisabled = !isLevelEnabled(level);

                return (
                  <button
                    key={level}
                    onClick={() => handleLevelSelection(level)}
                    disabled={isDisabled || !isActive}
                    className={`
                    w-full p-5 rounded-xl text-left 
                    border backdrop-blur-xl shadow-md
                    flex justify-between items-center
                    transition-all

                    ${
                      levelData?.attempted
                        ? "bg-white/10 border-[#42A5F5]/30 text-white"
                        : "bg-white/5 border-white/10 text-white"
                    }

                    ${
                      (isDisabled || !isActive) && !levelData?.attempted
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/10"
                    }
                  `}
                  >
                    <div>
                      <p className="font-semibold text-white">
                        {getLevelButtonText(level)}
                      </p>
                      <p className="text-xs mt-1 text-gray-300">
                        {getLevelDescription(level)}
                      </p>
                    </div>

                    <div
                      className="
                    w-8 h-8 rounded-full bg-white/10 
                    flex items-center justify-center
                    text-[#A7C1FF]
                  "
                    >
                      →
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PROFILE BUTTON */}
            <button
              className="
              w-full bg-[#1E88E5] hover:bg-[#42A5F5] 
              text-white font-semibold p-4 rounded-xl shadow-lg
              transition-all
            "
              onClick={() => navigate("/profile")}
            >
              Go to Profile
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION - PROMO CARDS */}
        <div
          className="
    grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6
    w-full
  "
        >
          {[
            {
              icon: "rocket",
              title: "WIN A TRIP TO NASA",
              subtitle: "Top performers get to visit NASA!",
            },
            {
              icon: "trophy",
              title: "₹5 CRORE WORTH PRIZES",
              subtitle: "For top 100 schools",
            },
            {
              icon: "brain",
              title: "NATIONAL ROBOTICS & AI MISSION",
              subtitle: "Join the future of technology",
            },
            {
              icon: "brain",
              title: "NaMo AI Mission",
              subtitle: "Official national initiative for AI & Robotics.",
            },
          ].map((card, index) => (
            <div
              key={index}
              className="
        bg-white/5 border border-white/10 backdrop-blur-xl
        rounded-xl shadow-lg
        p-5 flex flex-col justify-between 
        text-white
        transition-all
        hover:bg-white/10 hover:shadow-[0px_0px_20px_rgba(66,165,245,0.25)]
        
        /* Equal height on desktop */
        lg:h-[200px]
      "
            >
              <PromoBanner
                icon={card.icon}
                title={card.title}
                subtitle={card.subtitle}
                variant="primary"
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
