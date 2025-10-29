export const api = {
  auth: {
    login: "/login",
    register: "/register",
  },
  user: {
    getProfile: (userId: string) => `/user/${userId}`,
  },
  quiz: {
    getAllQuiz: "/quizzes/all",
    getQuizInfoByID: (quizId: string) => `/quiz/${quizId}`,
    submitQuiz: (quizId: string) => `/quiz/${quizId}/submit`,
  },
};
