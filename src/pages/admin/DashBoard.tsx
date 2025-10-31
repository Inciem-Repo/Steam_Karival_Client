import { Users, CheckCircle, Target, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../components/common/StatCard";
import { useEffect, useState } from "react";
import { getDashboardInfo } from "../../services/admin";
import { useApi } from "../../hooks/useApi";

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

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (!dashboardData) return 0;
    return Math.round(
      (dashboardData.users_attended_quiz / dashboardData.total_users) * 100
    );
  };

  if (loading) {
    return (
      <div className="h-screen overflow-scroll p-6 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="h-screen overflow-scroll p-6 flex items-center justify-center">
        <div className="text-lg text-red-600">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of platform statistics and user performance
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Top 10 Leaderboard
              </h2>
              <p className="text-muted-foreground mt-1">
                Based on quiz performance and ranking
              </p>
            </div>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => navigate("/leaderboard")}
            >
              View Full Leaderboard
            </button>
          </div>

          <div className="rounded-lg w-full border bg-card">
            <div className="w-full overflow-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground w-[80px]">
                      Rank
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Email
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Questions Attempted
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Correct Answers
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Time Taken
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground">
                      Score
                    </th>
                    <th className="h-12 text-left align-middle font-medium text-muted-foreground w-[100px]">
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
                        className="border-b transition-colors hover:bg-muted/50"
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
                        <td className="p-4 align-middle font-medium">
                          {user.name}
                        </td>
                        <td className="p-4 align-middle text-sm text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {user.attempted_questions}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              of {user.total_questions}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium text-green-600">
                              {user.total_correct}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              correct
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {formatTime(user.time_taken)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span
                              className={`font-medium ${
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
                            className="flex items-center gap-2 p-2 text-black hover:bg-primary rounded-md transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
