import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BookOpen,
  Mail,
  Phone,
  School,
} from "lucide-react";
import { useApi } from "../../hooks/useApi";
import { getUserQuizInfo } from "../../services/auth";

// Mock data - replace with real data from your backend
const userData = {
  id: 1,
  email: "hr@incoiem.com",
  name: "JHHhn Doe",
  phone: "+91-1289188879",
  school: "ABC High School",
  overallStats: {
    totalQuizzes: 5,
    attemptedQuizzes: 3,
    averageScore: 85,
    totalTimeSpent: "2h 30m",
    rank: 7,
  },
  quizAttempts: [
    {
      quizId: "quiz1",
      quizTitle: "Science Fundamentals",
      attempted: true,
      score: 92,
      totalQuestions: 10,
      correctAnswers: 9,
      timeTaken: "25m 30s",
      dateAttempted: "2024-01-15T10:30:00Z",
      rank: 3,
      questions: [
        {
          questionId: "q1",
          question: "What is the chemical symbol for water?",
          userAnswer: "H2O",
          correctAnswer: "H2O",
          isCorrect: true,
          options: ["CO2", "H2O", "O2", "NaCl"],
        },
        {
          questionId: "q2",
          question: "Which planet is known as the Red Planet?",
          userAnswer: "Mars",
          correctAnswer: "Mars",
          isCorrect: true,
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
        },
        {
          questionId: "q3",
          question: "What is the speed of light?",
          userAnswer: "299,792 km/s",
          correctAnswer: "299,792 km/s",
          isCorrect: true,
          options: [
            "299,792 km/s",
            "300,000 km/s",
            "150,000 km/s",
            "1,080 km/h",
          ],
        },
      ],
    },
  ],
};

const UserProfile = () => {
  const navigate = useNavigate();
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const { callApi: callGetUserQuizInfo } = useApi(getUserQuizInfo);
  
  const [loading, setLoading] = useState(true);
  const { id } = useParams<{ id: string }>();

  const toggleQuizDetails = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const attemptedQuizzes = userData.quizAttempts.filter(
    (quiz) => quiz.attempted
  );
  const notAttemptedQuizzes = userData.quizAttempts.filter(
    (quiz) => !quiz.attempted
  );

  useEffect(() => {
    const fetchGetAllUser = async () => {
      const response = await callGetUserQuizInfo(id);
      console.log(response);

      // if (response.status && response.users) {
      //   setUsers(response.users);
      //   setPagination(response.pagination);
      // }
    };

    fetchGetAllUser();
  }, [id]);

  return (
    <div className="h-screen overflow-scroll p-6">
      <div className="space-y-8 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg bg-primary-light border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-semibold">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{userData.name}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span>{userData.school}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-primary-light bg-card p-6">
            <h2 className="text-2xl font-bold mb-4">Overall Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">
                    Total Quizzes
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {userData.overallStats.totalQuizzes}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-muted-foreground">
                    Attempted
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {userData.overallStats.attemptedQuizzes}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-muted-foreground">
                    Overall Rank
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  #{userData.overallStats.rank}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-muted-foreground">
                    Time Spent
                  </span>
                </div>
                <p className="text-2xl font-bold">
                  {userData.overallStats.totalTimeSpent}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quiz Attempts</h2>
          {attemptedQuizzes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Attempted Quizzes ({attemptedQuizzes.length})
              </h3>

              {attemptedQuizzes.map((quiz) => (
                <div key={quiz.quizId} className="rounded-lg border bg-card">
                  {/* Quiz Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                          {quiz.quizTitle}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Score:{" "}
                            <strong className="text-foreground">
                              {quiz.score}%
                            </strong>
                          </span>
                          <span>
                            Correct:{" "}
                            <strong className="text-foreground">
                              {quiz.correctAnswers}/{quiz.totalQuestions}
                            </strong>
                          </span>
                          <span>
                            Time:{" "}
                            <strong className="text-foreground">
                              {quiz.timeTaken}
                            </strong>
                          </span>
                          <span>
                            Rank:{" "}
                            <strong className="text-foreground">
                              #{quiz.rank}
                            </strong>
                          </span>
                          <span>
                            Date:{" "}
                            <strong className="text-foreground">
                              {quiz.dateAttempted
                                ? new Date(
                                    quiz.dateAttempted
                                  ).toLocaleDateString()
                                : "Not attempted"}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <button onClick={() => toggleQuizDetails(quiz.quizId)}>
                        {expandedQuiz === quiz.quizId
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Questions Details */}
                  {expandedQuiz === quiz.quizId &&
                    quiz.questions.length > 0 && (
                      <div className="border-t p-4 bg-muted/50">
                        <h5 className="font-semibold mb-3">
                          Questions & Answers:
                        </h5>
                        <div className="space-y-3">
                          {quiz.questions.map((question, qIndex) => (
                            <div
                              key={question.questionId}
                              className="p-3 border rounded-lg bg-background"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    question.isCorrect
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {qIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium mb-2">
                                    {question.question}
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className={`p-2 rounded border ${
                                            option === question.correctAnswer
                                              ? "bg-green-100 border-green-300 text-green-800"
                                              : option ===
                                                  question.userAnswer &&
                                                !question.isCorrect
                                              ? "bg-red-100 border-red-300 text-red-800"
                                              : "bg-gray-50 border-gray-200"
                                          }`}
                                        >
                                          <span className="font-medium">
                                            {String.fromCharCode(65 + optIndex)}
                                            . {option}
                                          </span>
                                          {option ===
                                            question.correctAnswer && (
                                            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                              Correct Answer
                                            </span>
                                          )}
                                          {option === question.userAnswer &&
                                            !question.isCorrect && (
                                              <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                                Your Answer
                                              </span>
                                            )}
                                          {option === question.userAnswer &&
                                            question.isCorrect && (
                                              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                                Your Correct Answer
                                              </span>
                                            )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}

          {/* Not Attempted Quizzes */}
          {notAttemptedQuizzes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-600 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Not Attempted Quizzes ({notAttemptedQuizzes.length})
              </h3>

              {notAttemptedQuizzes.map((quiz) => (
                <div
                  key={quiz.quizId}
                  className="rounded-lg border bg-gray-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-600">
                        {quiz.quizTitle}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {quiz.totalQuestions} questions • Not attempted
                      </p>
                    </div>
                    <button disabled>Not Attempted</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
