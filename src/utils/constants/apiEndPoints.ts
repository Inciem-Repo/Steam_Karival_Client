export const api = {
  auth: {
    login: "/login",
    register: "/register",
  },
  user: {
    getProfile: (userId: string) => `/user/${userId}`,
    getAllUser: (page?: number, limit?: number) => `/users?${page}&${limit}`,
    getPaidUser: (page?: number, limit?: number) => `/paid-users?${page}&${limit}`,
    getChatUser: (page: number, limit: number) => `/whatsapp_chats?${page}&${limit}`,
    getUserQuizInfo: (userId: string) => `/quiz_info/${userId}`,
  },
  quiz: {
    getAllQuiz: "/quizzes/all",
    getQuizInfoByID: (quizId: string) => `/quiz/${quizId}`,
    submitQuiz: (quizId: string) => `/quiz/${quizId}/submit`,
    createQuiz: "/quiz",
    updateQuiz: (quizID: string) => `/quiz/${quizID}`,
    deleteQuiz: (quizID: string) => `/quiz/${quizID}`,
    deleteQusInQuiz: (quizID: string, qusID: string) =>
      `quiz/${quizID}/question/${qusID}`,
  },
  admin: {
    getDashboardInfo: "/dashboard",
    getLeaderboard: (page?: number, limit?: number) =>
      `/leaderboard?${page}&${limit}`,
  },
  payment: {
    order: "/order",
    verify: "/verify",
  },
};
