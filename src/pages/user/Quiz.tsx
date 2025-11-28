import { useState, useEffect, useRef } from "react";
import { useQuiz } from "../../context/QuizContext";
import { submitQuiz } from "../../services/quiz";
import { useApi } from "../../hooks/useApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getProfileService } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";

interface QuestionResponse {
  questionId: string;
  selectedOption: string | null;
  selectedOptionIndex: number | null;
  timeTaken: number;
}

interface QuizState {
  currentQuestion: number;
  responses: QuestionResponse[];
  timeLeft: number;
  startTime: number;
}

const QUESTION_TIME = 8;

const Quiz = () => {
  const [quizStateLoaded, setQuizStateLoaded] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<any | null>(null);
  const hasAutoSubmittedRef = useRef(false);

  const { quiz } = useQuiz();
  const { callApi: callsubmitQuiz, loading: quizAddLoader } =
    useApi(submitQuiz);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callApi: callGetProfile } = useApi(getProfileService);

  const TOTAL_QUESTIONS = quiz?.questions?.length || 0;

  useEffect(() => {
    const savedState = localStorage.getItem("quizState");
    if (savedState) {
      const state: QuizState = JSON.parse(savedState);
      setCurrentQuestion(state.currentQuestion);
      setResponses(state.responses);
      setTimeLeft(state.timeLeft);
      setStartTime(state.startTime);
      setSelectedOption(
        state.responses[state.currentQuestion]?.selectedOptionIndex || null
      );
    }
    setQuizStateLoaded(true);
  }, []);
  useEffect(() => {
    if (!quiz || !quizStateLoaded) return;
    if (TOTAL_QUESTIONS > 0 && responses.length === 0) {
      const initialResponses: QuestionResponse[] = quiz.questions.map(
        (question) => ({
          questionId: question.question_id || ``,
          selectedOption: null,
          selectedOptionIndex: null,
          timeTaken: 0,
        })
      );
      setResponses(initialResponses);
      setStartTime(Date.now());
    }
  }, [TOTAL_QUESTIONS, responses.length, quiz, quizStateLoaded]);

  useEffect(() => {
    const checkQuizAccess = async () => {
      if (!user?.id) return;

      const profileResponse = await callGetProfile(user.id);
      const currentLevel = profileResponse?.user?.current_quiz_level;
      const levelStats = profileResponse?.user?.levels?.[currentLevel];
      const paidLevels = profileResponse?.user?.paid_levels || [];

      const hasPlayedCurrentLevel = levelStats?.attempted === true;
      const hasPaidForCurrentLevel = paidLevels.includes(currentLevel);

      if (hasPlayedCurrentLevel) {
        navigate("/home");
        return;
      }
      if (!hasPaidForCurrentLevel && currentLevel !== "school_level") {
        navigate(`/payment?level=${currentLevel}`);
        return;
      }
    };
    checkQuizAccess();
  }, [user, navigate, callGetProfile]);

  useEffect(() => {
    if (quizStateLoaded) {
      const state: QuizState = {
        currentQuestion,
        responses,
        timeLeft,
        startTime,
      };
      localStorage.setItem("quizState", JSON.stringify(state));
    }
  }, [currentQuestion, responses, timeLeft, startTime, quizStateLoaded]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isSubmitting || currentQuestion >= TOTAL_QUESTIONS) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Reset auto-submit flag when question changes
    hasAutoSubmittedRef.current = false;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        if (newTime <= 0) {
          // Clear timer first
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // Auto-submit only if not already submitted
          if (!hasAutoSubmittedRef.current && !isSubmitting) {
            hasAutoSubmittedRef.current = true;
            handleNext(true);
          }
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentQuestion, isSubmitting, TOTAL_QUESTIONS]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const currentQuestionData: any = quiz?.questions?.[currentQuestion];
    const selectedOptionText =
      currentQuestionData?.options[optionIndex] || null;
    const newResponses = [...responses];
    const timeSpentOnQuestion = QUESTION_TIME - timeLeft;

    newResponses[currentQuestion] = {
      ...newResponses[currentQuestion],
      questionId:
        newResponses[currentQuestion]?.questionId ||
        currentQuestionData?._id ||
        currentQuestionData?.question_id ||
        `question-${currentQuestion}`,
      selectedOption: selectedOptionText,
      selectedOptionIndex: optionIndex,
      timeTaken: timeSpentOnQuestion,
    };

    setResponses(newResponses);
  };

  const handleNext = async (isAutoSubmit = false) => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const timeSpentOnQuestion = QUESTION_TIME - timeLeft;
    const updatedResponses = [...responses];
    const currentQuestionData: any = quiz?.questions?.[currentQuestion];

    // Only update if the response hasn't been set yet (for auto-submit)
    if (isAutoSubmit && !updatedResponses[currentQuestion]?.selectedOption) {
      updatedResponses[currentQuestion] = {
        ...updatedResponses[currentQuestion],
        questionId:
          updatedResponses[currentQuestion]?.questionId ||
          currentQuestionData?._id ||
          currentQuestionData?.question_id ||
          "",
        timeTaken: timeSpentOnQuestion,
        selectedOption: null,
        selectedOptionIndex: null,
      };
    } else if (!isAutoSubmit) {
      // Normal case - user interaction
      updatedResponses[currentQuestion] = {
        ...updatedResponses[currentQuestion],
        questionId:
          updatedResponses[currentQuestion]?.questionId ||
          currentQuestionData?._id ||
          currentQuestionData?.question_id ||
          "",
        timeTaken: timeSpentOnQuestion,
        selectedOption:
          updatedResponses[currentQuestion]?.selectedOption ||
          (selectedOption !== null
            ? currentQuestionData?.options[selectedOption] || null
            : null),
        selectedOptionIndex:
          updatedResponses[currentQuestion]?.selectedOptionIndex ||
          selectedOption,
      };
    }

    setResponses(updatedResponses);

    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedOption(
        updatedResponses[nextQuestion]?.selectedOptionIndex || null
      );
      setTimeLeft(QUESTION_TIME);
      setStartTime(Date.now());
      setIsSubmitting(false);
    } else {
      // Final submission logic
      const endTime = Date.now();
      const totalTimeTaken = Math.round((endTime - startTime) / 1000);

      const quizResults = {
        responses: updatedResponses,
        totalTimeTaken,
        completedAt: new Date().toISOString(),
        summary: {
          totalQuestions: TOTAL_QUESTIONS,
          answeredQuestions: updatedResponses.filter(
            (r) => r.selectedOption !== null
          ).length,
          unansweredQuestions: updatedResponses.filter(
            (r) => r.selectedOption === null
          ).length,
        },
      };

      localStorage.setItem("quizResults", JSON.stringify(quizResults));
      localStorage.removeItem("quizState");

      const apiRequestData = {
        title: quiz?.title?.toLowerCase() || "",
        questions: updatedResponses.map((response) => ({
          question_id: response.questionId,
          answer: response.selectedOption || "",
          answered: response.selectedOption !== null,
          time_taken: response.timeTaken,
        })),
      };

      try {
        const response = await callsubmitQuiz(quiz?._id, apiRequestData);
        if (response.status) {
          toast.success(response.message);
          navigate("/results");
          localStorage.removeItem("quizState");
          localStorage.removeItem("quizResults");
        }
      } catch (error) {
        toast.error("Failed to submit quiz");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const question = quiz?.questions?.[currentQuestion];
  const progress = `${currentQuestion + 1}/${TOTAL_QUESTIONS}`;

  if (!quiz || !question || !quizStateLoaded) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-h2-medium">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <main className="flex h-auto w-[362px] max-w-full px-4 py-8 relative flex-col items-start gap-6">
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
          onClick={() => handleNext(false)}
          disabled={quizAddLoader || isSubmitting}
          className={`flex items-center justify-center gap-2 px-6 py-3 relative self-end btn 
    ${quizAddLoader || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span>
            {quizAddLoader || isSubmitting
              ? "Submitting..."
              : currentQuestion < TOTAL_QUESTIONS - 1
              ? "Next"
              : "Finish"}
          </span>

          {!(quizAddLoader || isSubmitting) && (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </main>
    </div>
  );
};

export default Quiz;
