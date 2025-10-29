import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";

export const getAllQuiz = async () => {
  const res = await apiClient.get(api.quiz.getAllQuiz);
  return res.data;
};

export const getQuizInfoByID = async (quizId: string) => {
  const res = await apiClient.get(api.quiz.getQuizInfoByID(quizId));
  return res.data;
};


export const submitQuiz = async (quizId: string, userAnswers: any) => {
  const res = await apiClient.post(api.quiz.submitQuiz(quizId), userAnswers);
  return res.data;
};
