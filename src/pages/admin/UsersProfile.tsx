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
import { getProfileService, getUserQuizInfo } from "../../services/auth";

interface Question {
  question_id: string;
  question?: string;
  correct_answer: string;
  user_answer: string;
  is_correct: boolean;
  options: string[];
}

interface Quiz {
  quiz_id: string;
  quiz_title: string;
  quiz_description: string;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
  time_taken: number;
  submitted_at: string;
  questions: Question[];
}

interface UserInfo {
  user_id: string;
  name: string;
  email: string;
  total_quizzes_attempted: number;
}

interface QuizResponse {
  status: boolean;
  message: string;
  quizzes: Quiz[];
  user_info: UserInfo;
}

interface ProfileUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  role: string;
  is_quiz_attempted: boolean;
  rank?: number;
  total_questions?: number;
  total_questions_attempted?: number;
  time_taken?: number;
  score?: {
    total_correct: number;
    total_questions: number;
  };
}

interface ProfileResponse {
  status: boolean;
  user: ProfileUser;
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const { callApi: callGetUserQuizInfo } = useApi(getUserQuizInfo);
  const { callApi: callGetProfile } = useApi(getProfileService);

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<QuizResponse | null>(null);
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);

  const toggleQuizDetails = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userQuizInfo, userProfileInfo] = await Promise.all([
          callGetUserQuizInfo(id) as Promise<QuizResponse>,
          callGetProfile(id) as Promise<ProfileResponse>,
        ]);

        setQuizData(userQuizInfo);
        setProfileData(userProfileInfo);
      } catch (error) {
        console.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate overall statistics
  const calculateOverallStats = () => {
    if (!quizData || !profileData) return null;

    const totalQuizzes = quizData.user_info.total_quizzes_attempted;
    const attemptedQuizzes = totalQuizzes;
    const averageScore =
      quizData.quizzes.length > 0
        ? quizData.quizzes.reduce(
            (sum, quiz) => sum + quiz.score_percentage,
            0
          ) / quizData.quizzes.length
        : 0;

    const totalTimeSpent = quizData.quizzes.reduce(
      (sum, quiz) => sum + quiz.time_taken,
      0
    );

    return {
      totalQuizzes,
      attemptedQuizzes,
      averageScore: Math.round(averageScore),
      totalTimeSpent: formatTime(totalTimeSpent),
      rank: profileData.user.rank || 0,
    };
  };

  const overallStats = calculateOverallStats();

  if (loading) {
    return (
      <div className="h-screen overflow-scroll p-6 flex items-center justify-center">
        <div className="text-lg">Loading user profile...</div>
      </div>
    );
  }

  if (!profileData || !quizData) {
    return (
      <div className="h-screen overflow-scroll p-6 flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load user profile</div>
      </div>
    );
  }

  const user = profileData.user;

  return (
    <div className="h-screen overflow-auto p-6">
      <div className="space-y-8 p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="rounded-lg bg-primary-light border bg-card p-6">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    User ID: {user._id}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <School className="h-4 w-4 text-muted-foreground" />
                  <span>{user.school}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`h-4 w-4 ${
                      user.is_quiz_attempted
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  <span
                    className={
                      user.is_quiz_attempted
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    {user.is_quiz_attempted
                      ? "Quiz Attempted"
                      : "Not Attempted Quiz"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="rounded-lg border bg-primary-light bg-card p-6">
            <h2 className="text-2xl font-bold mb-4">Overall Statistics</h2>
            {overallStats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-muted-foreground">
                      Total Quizzes
                    </span>
                  </div>
                  <p className="text-2xl font-bold">
                    {overallStats.totalQuizzes}
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
                    {overallStats.attemptedQuizzes}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-muted-foreground">
                      Total Time
                    </span>
                  </div>
                  <p className="text-2xl font-bold">
                    {overallStats.totalTimeSpent}
                  </p>
                </div>

                {overallStats.rank > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-muted-foreground">
                        Overall Rank
                      </span>
                    </div>
                    <p className="text-2xl font-bold">#{overallStats.rank}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No statistics available
              </div>
            )}
          </div>
        </div>

        {/* Quiz Attempts */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quiz Attempts</h2>

          {quizData.quizzes.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-green-600 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Attempted Quizzes ({quizData.quizzes.length})
              </h3>

              {quizData.quizzes.map((quiz) => (
                <div key={quiz.quiz_id} className="rounded-lg border bg-card">
                  {/* Quiz Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold">
                          {quiz.quiz_title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quiz.quiz_description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Score:{" "}
                            <strong className="text-foreground">
                              {quiz.score_percentage}%
                            </strong>
                          </span>
                          <span>
                            Correct:{" "}
                            <strong className="text-foreground">
                              {quiz.correct_answers}/{quiz.total_questions}
                            </strong>
                          </span>
                          <span>
                            Time:{" "}
                            <strong className="text-foreground">
                              {formatTime(quiz.time_taken)}
                            </strong>
                          </span>
                          <span>
                            Date:{" "}
                            <strong className="text-foreground">
                              {new Date(quiz.submitted_at).toLocaleDateString()}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleQuizDetails(quiz.quiz_id)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        {expandedQuiz === quiz.quiz_id
                          ? "Hide Details"
                          : "View Details"}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Questions Details */}
                  {expandedQuiz === quiz.quiz_id &&
                    quiz.questions.length > 0 && (
                      <div className="border-t p-4 bg-muted/50">
                        <h5 className="font-semibold mb-3">
                          Questions & Answers:
                        </h5>
                        <div className="space-y-3">
                          {quiz.questions.map((question, qIndex) => (
                            <div
                              key={question.question_id}
                              className="p-3 border rounded-lg bg-background"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                                    question.is_correct
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {qIndex + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium mb-2">
                                    {question.question ||
                                      `Question ${qIndex + 1}`}
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    {question.options.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className={`p-2 rounded border ${
                                            option === question.correct_answer
                                              ? "bg-green-100 border-green-300 text-green-800"
                                              : option ===
                                                  question.user_answer &&
                                                !question.is_correct
                                              ? "bg-red-100 border-red-300 text-red-800"
                                              : "bg-gray-50 border-gray-200"
                                          }`}
                                        >
                                          <span className="font-medium">
                                            {String.fromCharCode(65 + optIndex)}
                                            . {option}
                                          </span>
                                          {option ===
                                            question.correct_answer && (
                                            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                              Correct Answer
                                            </span>
                                          )}
                                          {option === question.user_answer &&
                                            !question.is_correct && (
                                              <span className="ml-2 text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                                                Selected Answer
                                              </span>
                                            )}
                                          {option === question.user_answer &&
                                            question.is_correct && (
                                              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                                Selected Answer
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
          ) : (
            <div className="rounded-lg border bg-gray-50 p-6 text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Quiz Attempts
              </h3>
              <p className="text-gray-500">
                This user hasn't attempted any quizzes yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
