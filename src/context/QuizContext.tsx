import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Quiz } from "../utils/types/quiz";
import { useApi } from "../hooks/useApi";
import { getAllQuiz, getQuizInfoByID } from "../services/quiz";
import { useAuth } from "../context/AuthContext";


interface QuizContextType {
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz) => void;
  isLoading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const { callApi: callGetAllQuiz } = useApi(getAllQuiz);
  const { callApi: callGetQuizInfoByID } = useApi(getQuizInfoByID);
  const { user } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!user?.id) return;

      try {
        const quizResponse = await callGetAllQuiz();
        const firstQuizID = quizResponse?.quizzes?.[0]?._id;
        if (!firstQuizID) {
          setIsLoading(false);
          return;
        }

        const quizData = await callGetQuizInfoByID(firstQuizID);
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