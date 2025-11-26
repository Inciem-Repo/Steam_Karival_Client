import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";
import type { QuizData } from "../utils/types/quiz";

export const getAllQuiz = async () => {
  const res = await apiClient.get(api.quiz.getAllQuiz);
  return res.data;
};

export const getAllQuizDetails = async () => {
  const res = await apiClient.get(api.quiz.getAllQizMeta);
  return res.data;
};
export const getQuizInfoByID = async (category: string) => {
  const res = await apiClient.get(api.quiz.getQuizInfoByID(category));
  return res.data;
};
export const submitQuiz = async (quizId: string, userAnswers: any) => {
  const res = await apiClient.post(api.quiz.submitQuiz(quizId), userAnswers);
  return res.data;
};
export const createQuiz = async (quizData: QuizData) => {
  const res = await apiClient.post(api.quiz.createQuiz, quizData);
  return res.data;
};
export const updateQuiz = async (quizID: string, quizData: QuizData) => {
  console.log({ quizData });
  const res = await apiClient.put(api.quiz.updateQuiz(quizID), quizData);
  return res.data;
};
export const deleteQuiz = async (quizID: string, qusID: string) => {
  const res = await apiClient.delete(api.quiz.deleteQusInQuiz(quizID, qusID));
  return res.data;
};
export const deleteQuizByID = async (quizID: string) => {
  const res = await apiClient.delete(api.quiz.deleteQuiz(quizID));
  return res.data;
};
