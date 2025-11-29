import { Users, CheckCircle, Target, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { getDashboardInfo } from "../../services/admin";
import { useEffect, useState } from "react";
import { StatCard } from "../../components/common/StatCard";

interface LeaderboardUser {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  rank: number;
  attempted_questions: number;
  time_taken: number;
  total_correct: number;
  total_questions: number;
}

interface PaginationInfo {
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  per_page: number;
  total_items: number;
  total_pages: number;
}

interface DashboardData {
  leaderboard_preview: LeaderboardUser[];
  pagination: PaginationInfo;
  total_attempted_questions: number;
  total_users: number;
  users_attended_quiz: number;
  users_not_attended: number;
}

interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { callApi: CallgetDashboard } = useApi(getDashboardInfo);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = (await CallgetDashboard()) as DashboardResponse;
        if (response.status && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const calculateCompletionRate = () => {
    if (!dashboardData) return 0;
    return Math.round(
      (dashboardData.users_attended_quiz / dashboardData.total_users) * 100
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
        <div className="text-sm sm:text-base lg:text-lg">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 flex items-center justify-center">
        <div className="text-sm sm:text-base lg:text-lg text-destructive">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen overflow-auto bg-background pb-6">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6 space-y-4 sm:space-y-6 lg:space-y-8">
        <div className="text-center lg:text-left">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base">
            Overview of platform statistics and user performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <StatCard
            title="Total Users"
            value={dashboardData.total_users.toString()}
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Quiz Attempts"
            value={dashboardData.users_attended_quiz.toString()}
            icon={Target}
            description="Users who attempted quizzes"
          />
          <StatCard
            title="Quiz Completions"
            value={`${calculateCompletionRate() || 0}%`}
            icon={CheckCircle}
            description="Completion rate"
          />
          <StatCard
            title="Questions Attempted"
            value={dashboardData.total_attempted_questions.toString()}
            icon={CheckCircle}
            description="Total questions answered"
          />
        </div>

        {/* Leaderboard Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="text-center sm:text-left">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                Top 10 Leaderboard
              </h2>
              <p className="text-muted-foreground mt-0.5 sm:mt-1 text-xs sm:text-sm">
                Based on quiz performance and ranking
              </p>
            </div>
            <button
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-xs sm:text-sm lg:text-base whitespace-nowrap"
              onClick={() => navigate("/admin/leaderboard")}
            >
              View Full Leaderboard
            </button>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[80px]">
                      Rank
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[120px]">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[160px]">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[100px]">
                      Questions
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[100px]">
                      Correct
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[90px]">
                      Time
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground min-w-[80px]">
                      Score
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.leaderboard_preview.map((user) => {
                    const scorePercentage =
                      user.total_questions > 0
                        ? Math.round(
                            (user.total_correct / user.total_questions) * 100
                          )
                        : 0;

                    return (
                      <tr
                        key={user.user_id}
                        className="border-b transition-colors hover:bg-muted/30"
                      >
                        <td className="p-4 align-middle">
                          <span
                            className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm border-2 shadow-sm ${
                              user.rank === 1
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-500"
                                : user.rank === 2
                                ? "bg-gradient-to-br from-gray-400 to-gray-600 text-white border-gray-500"
                                : user.rank === 3
                                ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-700"
                                : "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {user.rank <= 3 && (
                              <span className="absolute -top-3 -right-2">
                                <span className="text-white text-lg drop-shadow">
                                  👑
                                </span>
                              </span>
                            )}
                            {user.rank}
                          </span>
                        </td>
                        <td className="p-4 align-middle font-medium text-sm">
                          <div
                            className="truncate max-w-[120px]"
                            title={user.name}
                          >
                            {user.name}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-sm text-muted-foreground">
                          <div
                            className="truncate max-w-[160px]"
                            title={user.email}
                          >
                            {user.email}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">
                              {user.attempted_questions}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              of {user.total_questions}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-green-600 text-sm">
                              {user.total_correct}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              correct
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-sm">
                          {formatTime(user.time_taken)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span
                              className={`font-medium text-sm ${
                                scorePercentage >= 80
                                  ? "text-green-600"
                                  : scorePercentage >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {scorePercentage}%
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {user.total_correct}/{user.total_questions}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <button
                            onClick={() =>
                              navigate(`/admin/profile/user/${user.user_id}`)
                            }
                            className="flex items-center justify-center w-10 h-10 hover:bg-muted rounded-md transition-colors"
                            title="View User Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {dashboardData.leaderboard_preview.map((user) => {
              const scorePercentage =
                user.total_questions > 0
                  ? Math.round(
                      (user.total_correct / user.total_questions) * 100
                    )
                  : 0;

              return (
                <div
                  key={user.user_id}
                  className="rounded-lg border bg-card p-3 sm:p-4 space-y-3"
                >
        
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm border-2 shadow-sm relative flex-shrink-0 ${
                          user.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white border-yellow-500"
                            : user.rank === 2
                            ? "bg-gradient-to-br from-gray-400 to-gray-600 text-white border-gray-500"
                            : user.rank === 3
                            ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white border-amber-700"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {user.rank <= 3 && (
                          <span className="absolute -top-2 -right-2">
                            <span className="text-white text-lg drop-shadow">
                              👑
                            </span>
                          </span>
                        )}
                        {user.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {user.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/admin/profile/user/${user.user_id}`)
                      }
                      className="flex items-center justify-center w-9 h-9 hover:bg-muted rounded-md transition-colors flex-shrink-0"
                      title="View User Profile"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs">
                    <div className="bg-muted/30 rounded-md p-2">
                      <div className="text-muted-foreground mb-0.5">
                        Questions
                      </div>
                      <div className="font-medium">
                        {user.attempted_questions}{" "}
                        <span className="text-muted-foreground">
                          of {user.total_questions}
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-2">
                      <div className="text-muted-foreground mb-0.5">
                        Correct
                      </div>
                      <div className="font-medium text-green-600">
                        {user.total_correct}{" "}
                        <span className="text-muted-foreground">answers</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-2">
                      <div className="text-muted-foreground mb-0.5">Time</div>
                      <div className="font-medium">
                        {formatTime(user.time_taken)}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-2">
                      <div className="text-muted-foreground mb-0.5">Score</div>
                      <div
                        className={`font-medium ${
                          scorePercentage >= 80
                            ? "text-green-600"
                            : scorePercentage >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {scorePercentage}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
