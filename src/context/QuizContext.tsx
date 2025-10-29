import { createContext, useContext, useState, type ReactNode } from "react";
import type { Quiz } from "../utils/types/quiz";

interface QuizContextType {
  quiz: Quiz | null;
  setQuiz: (quiz: Quiz | null) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
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
