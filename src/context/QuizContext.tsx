import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Quiz, QuizContextType } from "../utils/types/quiz";
import { useApi } from "../hooks/useApi";
import { getQuizInfoByID } from "../services/quiz";
import { useAuth } from "../context/AuthContext";

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { callApi: callGetQuizInfoByID } = useApi(getQuizInfoByID);
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!user?.id) return;

      try {
        const quizData = await callGetQuizInfoByID(user.current_quiz_level);
        if (quizData?.quiz) {
          setQuiz(quizData.quiz);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [user?.id]);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, isLoading }}>
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

export default QuizProvider;
