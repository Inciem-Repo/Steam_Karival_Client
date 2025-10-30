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
      // Show all pages if total pages are less than or equal to maxVisibleButtons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show limited pages with ellipsis logic
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          buttons.push(i);
        }
        buttons.push("...");
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        buttons.push(1);
        buttons.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        // In the middle
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
        className={`w-8 h-8 p-0 flex items-center justify-center ${
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
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-scroll p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-2">
            {pagination?.total_items || 0} total users • {attemptedCount}{" "}
            attempted quiz • {notAttemptedCount} not attempted
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
                <CustomTableHead className="w-[140px]">Action</CustomTableHead>
              </CustomTableRow>
            </CustomTableHeader>
            <CustomTableBody>
              {users.length > 0 ? (
                users.map((user, index) => (
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
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                    </CustomTableCell>
                  </CustomTableRow>
                ))
              ) : (
                <CustomTableRow>
                  <CustomTableCell className="text-center py-8 text-muted-foreground">
                    No users found
                  </CustomTableCell>
                </CustomTableRow>
              )}
            </CustomTableBody>
          </CustomTable>
        </div>

        {pagination && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex} to {endIndex} of {pagination.total_items}{" "}
              entries
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

export default UserList;
