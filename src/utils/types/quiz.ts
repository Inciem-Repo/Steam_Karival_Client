// type can reuse both user and quiz may have same types

export interface Question {
  question_id: string;
  question: string;
  options: string[];
}
export interface Quiz {
  _id: string;
  title: string;
  total_questions: number;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  questions: Question[];
}
export interface QuizResponse {
  quiz: Quiz;
  status: boolean;
}
export type IQuestion = {
  question_id: string;
  question: string;
  options: string[];
  correct_answer: string;
};
export type QuizData = {
  title: string;
  questions: IQuestion[];
};
export type UpdateQuizPayload = {
  title: string;
  questions: Omit<IQuestion, "question_id">[];
};
export interface ICertificate {
  name: String;
}
