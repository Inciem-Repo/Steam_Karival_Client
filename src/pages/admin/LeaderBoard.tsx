import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../../services/admin";
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

interface LeaderboardResponse {
  status: boolean;
  leaderboard_preview: LeaderboardUser[];
  pagination: PaginationInfo;
}

// Custom Table Components
const CustomTable = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full overflow-auto">
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const CustomTableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="[&_tr]:border-b">{children}</thead>
);

const CustomTableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);

const CustomTableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    {children}
  </tr>
);

const CustomTableHead = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}
  >
    {children}
  </th>
);

const CustomTableCell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
    {children}
  </td>
);

const LeaderBoard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { callApi: CallLeaderBoardInfo } = useApi(getLeaderboard);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Fetch leaderboard data
  const fetchLeaderboardData = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const response = (await CallLeaderBoardInfo(
        page,
        limit
      )) as LeaderboardResponse;
      if (response.status && response.leaderboard_preview) {
        setLeaderboardData(response.leaderboard_preview);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (pagination) {
      setCurrentPage(Math.max(1, Math.min(page, pagination.total_pages)));
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => pagination && goToPage(pagination.total_pages);
  const goToNextPage = () => pagination && goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  // Format time from seconds to readable format
  const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate score percentage
  const calculateScorePercentage = (
    totalCorrect: number,
    totalQuestions: number
  ) => {
    if (totalQuestions === 0) return 0;
    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  useEffect(() => {
    fetchLeaderboardData(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const totalPages = pagination.total_pages;
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      // Show all pages if total pages are less than or equal to maxVisibleButtons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1);
        buttons.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        buttons.push(1);
        buttons.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      }
    }

    return buttons.map((page, index) => (
      <button
        key={index}
        onClick={() => typeof page === "number" && goToPage(page)}
        disabled={typeof page !== "number"}
        className={`w-8 h-8 p-0 flex items-center justify-center rounded ${
          currentPage === page
            ? "bg-primary text-primary-foreground font-medium"
            : "hover:bg-muted"
        } ${typeof page !== "number" ? "cursor-default" : ""}`}
      >
        {page}
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="h-screen overflow-scroll p-6 flex items-center justify-center">
        <div className="text-lg">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leader Board</h1>
          <p className="text-muted-foreground mt-2">
            {pagination?.total_items || 0} total users ranked by performance
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          {leaderboardData.length > 0 ? (
            <CustomTable>
              <CustomTableHeader>
                <CustomTableRow>
                  <CustomTableHead className="w-[80px]">Rank</CustomTableHead>
                  <CustomTableHead>Name</CustomTableHead>
                  <CustomTableHead>Email</CustomTableHead>
                  <CustomTableHead>Questions Attempted</CustomTableHead>
                  <CustomTableHead>Correct Answers</CustomTableHead>
                  <CustomTableHead>Time Taken</CustomTableHead>
                  <CustomTableHead>Score</CustomTableHead>
                  <CustomTableHead className="w-[100px]">
                    Action
                  </CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {leaderboardData.map((user) => {
                  const scorePercentage = calculateScorePercentage(
                    user.total_correct,
                    user.total_questions
                  );

                  return (
                    <CustomTableRow key={user.user_id}>
                      <CustomTableCell className="font-medium">
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
                      </CustomTableCell>
                      <CustomTableCell className="font-medium">
                        {user.name}
                      </CustomTableCell>
                      <CustomTableCell className="text-sm text-muted-foreground">
                        {user.email}
                      </CustomTableCell>
                      <CustomTableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.attempted_questions}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {user.total_questions}
                          </span>
                        </div>
                      </CustomTableCell>
                      <CustomTableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-green-600">
                            {user.total_correct}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            correct
                          </span>
                        </div>
                      </CustomTableCell>
                      <CustomTableCell>
                        {formatTime(user.time_taken)}
                      </CustomTableCell>
                      <CustomTableCell>
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
                      </CustomTableCell>
                      <CustomTableCell>
                        <button
                          onClick={() =>
                            navigate(`/admin/profile/user/${user.user_id}`)
                          }
                          className="flex items-center gap-2 p-2 text-black hover:bg-primary rounded-md transition-colors"
                          title="View User Profile"
                        >
                          <Eye className="h-4 w-4" />
                          view
                        </button>
                      </CustomTableCell>
                    </CustomTableRow>
                  );
                })}
              </CustomTableBody>
            </CustomTable>
          ) : (
            <div className="flex items-center justify-center py-4">
              <p>No leaderboard data available</p>
            </div>
          )}
        </div>

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, pagination.total_items)} of{" "}
              {pagination.total_items} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={goToFirstPage}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === pagination.total_pages}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={goToLastPage}
                disabled={currentPage === pagination.total_pages}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderBoard;
