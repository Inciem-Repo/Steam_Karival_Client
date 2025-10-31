import { useState, useEffect, type JSX } from "react";
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

const QUESTION_TIME = 6;

export const Quiz = (): JSX.Element => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const { quiz } = useQuiz();
  const { callApi: callsubmitQuiz } = useApi(submitQuiz);
  const navigate = useNavigate();
  const [isUserAttendedQuiz, setIsUserAttendedQuiz] = useState<boolean>(false);
  const { user } = useAuth();
  const { callApi: callGetProfile } = useApi(getProfileService);

  const TOTAL_QUESTIONS = quiz?.questions?.length || 0;

  useEffect(() => {
    if (!quiz) return;
    if (TOTAL_QUESTIONS > 0 && responses.length === 0) {
      const initialResponses: QuestionResponse[] = quiz.questions.map(
        (question, index) => ({
          questionId: question.question_id || `question-${index}`,
          selectedOption: null,
          selectedOptionIndex: null,
          timeTaken: 0,
        })
      );
      setResponses(initialResponses);
      setStartTime(Date.now());
    }
  }, [TOTAL_QUESTIONS, responses.length, quiz]);
  useEffect(() => {
    const checkQuizAccess = async () => {
      const profileResponse = await callGetProfile(user?.id);
      const hasAttempted = profileResponse?.user?.is_quiz_attempted || false;
      if (hasAttempted) {
        navigate("/");
      }
    };
    checkQuizAccess();
  }, [user, navigate, callGetProfile]);

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
  }, []);

  useEffect(() => {
    const state: QuizState = {
      currentQuestion,
      responses,
      timeLeft,
      startTime,
    };
    localStorage.setItem("quizState", JSON.stringify(state));
  }, [currentQuestion, responses, timeLeft, startTime]);

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

  const handleNext = async () => {
    const timeSpentOnQuestion = QUESTION_TIME - timeLeft;
    const updatedResponses = [...responses];
    const currentQuestionData: any = quiz?.questions?.[currentQuestion];

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

    setResponses(updatedResponses);

    if (currentQuestion < TOTAL_QUESTIONS - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedOption(
        updatedResponses[nextQuestion]?.selectedOptionIndex || null
      );
      setTimeLeft(QUESTION_TIME);
    } else {
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
        title: quiz?.title?.toLowerCase() || "science",
        questions: updatedResponses.map((response) => ({
          question_id: response.questionId,
          answer: response.selectedOption || "",
          answered: response.selectedOption !== null,
          time_taken: response.timeTaken,
        })),
      };
      const response = await callsubmitQuiz(quiz?._id, apiRequestData);
      if (response.status) {
        toast.success(response.message);
        navigate("/results");
      }
    }
  };

  const question = quiz?.questions?.[currentQuestion];
  const progress = `${currentQuestion + 1}/${TOTAL_QUESTIONS}`;

  if (!quiz || !question) {
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
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-6 py-3 relative self-end btn"
        >
          <span>
            {currentQuestion < TOTAL_QUESTIONS - 1 ? "Next" : "Finish"}
          </span>
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
