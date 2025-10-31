import {
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getAllUser } from "../../services/auth";

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

interface User {
  _id: string;
  created_at: string;
  email: string;
  is_quiz_attempted: boolean;
  name: string;
  phone: string;
  role: string;
  school: string;
}

interface PaginationInfo {
  current_page: number;
  has_next_page: boolean;
  has_prev_page: boolean;
  per_page: number;
  total_items: number;
  total_pages: number;
}

interface ApiResponse {
  pagination: PaginationInfo;
  status: boolean;
  users: User[];
}

const UserList = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { callApi: callGetAllUser } = useApi(getAllUser);

  useEffect(() => {
    const fetchGetAllUser = async () => {
      try {
        setLoading(true);
        const response = (await callGetAllUser(
          currentPage,
          itemsPerPage
        )) as ApiResponse;

        if (response.status && response.users) {
          setUsers(response.users);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGetAllUser();
  }, [currentPage, itemsPerPage]);

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

  // Calculate display indices
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = pagination
    ? Math.min(currentPage * itemsPerPage, pagination.total_items)
    : 0;

  // Filter stats based on actual data
  const attemptedCount = users.filter((user) => user.is_quiz_attempted).length;
  const notAttemptedCount = users.length - attemptedCount;

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const totalPages = pagination.total_pages;
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
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
        className={`w-8 h-8 p-0 flex items-center justify-center rounded-md text-sm ${
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen overflow-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Users
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            {pagination?.total_items || 0} total users • {attemptedCount}{" "}
            attempted quiz • {notAttemptedCount} not attempted
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
          {users.length > 0 ? (
            <CustomTable>
              <CustomTableHeader>
                <CustomTableRow>
                  <CustomTableHead className="w-[80px]">SL.No</CustomTableHead>
                  <CustomTableHead>Name</CustomTableHead>
                  <CustomTableHead>Email</CustomTableHead>
                  <CustomTableHead>Phone</CustomTableHead>
                  <CustomTableHead>School</CustomTableHead>
                  <CustomTableHead>Joined Date</CustomTableHead>
                  <CustomTableHead>Attempted Quiz</CustomTableHead>
                  <CustomTableHead className="w-[140px]">
                    Action
                  </CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {users.map((user, index) => (
                  <CustomTableRow key={user._id}>
                    <CustomTableCell className="font-medium">
                      {startIndex + index}
                    </CustomTableCell>
                    <CustomTableCell className="font-medium">
                      {user.name}
                    </CustomTableCell>
                    <CustomTableCell>{user.email}</CustomTableCell>
                    <CustomTableCell>{user.phone}</CustomTableCell>
                    <CustomTableCell>{user.school}</CustomTableCell>
                    <CustomTableCell>
                      {formatDate(user.created_at)}
                    </CustomTableCell>
                    <CustomTableCell>
                      <div className="flex items-center gap-2">
                        {user.is_quiz_attempted ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-medium">
                              Yes
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">No</span>
                          </>
                        )}
                      </div>
                    </CustomTableCell>
                    <CustomTableCell>
                      <button
                        onClick={() =>
                          navigate(`/admin/profile/user/${user._id}`)
                        }
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </CustomTableCell>
                  </CustomTableRow>
                ))}
              </CustomTableBody>
            </CustomTable>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No user data available</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div
                key={user._id}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      #{startIndex + index}
                    </p>
                    <h3 className="font-semibold">{user.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.is_quiz_attempted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium break-all">{user.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{user.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">School</span>
                    <span className="font-medium">{user.school}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="font-medium">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Quiz Status</span>
                    <span
                      className={`font-medium ${
                        user.is_quiz_attempted
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {user.is_quiz_attempted ? "Attempted" : "Not Attempted"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/profile/user/${user._id}`)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8 rounded-lg border bg-card">
              <p className="text-muted-foreground">No user data available</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex} to {endIndex} of {pagination.total_items}{" "}
              entries
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="First page"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page Numbers - Hide some on mobile */}
                <div className="flex items-center space-x-1">
                  {renderPaginationButtons()}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === pagination.total_pages}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={goToLastPage}
                  disabled={currentPage === pagination.total_pages}
                  className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Last page"
                >
                  <ChevronsRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
