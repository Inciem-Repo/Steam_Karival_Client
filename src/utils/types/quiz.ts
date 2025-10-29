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
