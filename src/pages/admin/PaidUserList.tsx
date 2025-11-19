import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  IndianRupee,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getAllPaidUser } from "../../services/auth";

interface CustomTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}
// Custom Table Components (same as before)
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

const CustomTableRow: React.FC<CustomTableRowProps> = ({
  children,
  className = "",
  ...props
}) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}
    {...props}
  >
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

interface Transaction {
  addedon: string;
  amount: string;
  bank_ref_num: string;
  created_at: string;
  easepayid: string;
  mode: string;
  order_id: string;
  payment_source: string;
  status: string;
  upi_va: string;
  verified: boolean;
}

interface PaidUser {
  _id: string;
  email: string;
  isPaid: boolean;
  is_quiz_attempted: boolean;
  name: string;
  phone: string;
  role: string;
  school: string;
  last_payment: Transaction;
  transactions: Transaction[];
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
  users: PaidUser[];
}

// Transaction Status Badge Component
const TransactionStatusBadge = ({ status }: { status: string }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "userCancelled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return "Success";
      case "userCancelled":
        return "Cancelled";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {getStatusText(status)}
    </span>
  );
};

// Transaction Details Dropdown Component
const TransactionDetails = ({
  transactions,
  isOpen,
}: {
  transactions: Transaction[];
  isOpen: boolean;
}) => {
  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseFloat(amount));
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4">
      <h4 className="font-semibold text-sm mb-3 text-gray-700">
        Transaction History ({transactions?.length})
      </h4>
      <div className="space-y-3">
        {transactions.map((transaction, index) => (
          <div
            key={transaction?.order_id}
            className="bg-white rounded-lg border border-gray-200 p-3 space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-500">
                  #{index + 1}
                </span>
                <span className="text-sm font-semibold">
                  {formatCurrency(transaction?.amount) || 0}
                </span>
                <TransactionStatusBadge status={transaction?.status} />
              </div>
              <span className="text-xs text-gray-500">
                {formatDate(transaction?.addedon)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-500">Order ID:</span>
                <p className="font-medium truncate">{transaction?.order_id}</p>
              </div>
              <div>
                <span className="text-gray-500">Payment ID:</span>
                <p className="font-medium truncate">{transaction?.easepayid}</p>
              </div>
              <div>
                <span className="text-gray-500">Bank Ref:</span>
                <p className="font-medium">
                  {transaction?.bank_ref_num === "NA"
                    ? "N/A"
                    : transaction?.bank_ref_num}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Method:</span>
                <p className="font-medium capitalize">
                  {transaction?.mode === "NA" ? "N/A" : transaction?.mode}
                </p>
              </div>
            </div>

            {transaction?.upi_va && transaction?.upi_va !== "NA" && (
              <div className="text-xs">
                <span className="text-gray-500">UPI/VPA:</span>
                <p className="font-medium">{transaction?.upi_va}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PaidUserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState<PaidUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const { callApi: callGetAllPaidUser } = useApi(getAllPaidUser);

  useEffect(() => {
    const fetchGetAllPaidUser = async () => {
      try {
        setLoading(true);
        const response = (await callGetAllPaidUser(
          currentPage,
          itemsPerPage
        )) as ApiResponse;

        if (response?.status && response?.users) {
          setUsers(response?.users);
          setPagination(response?.pagination);
        }
      } catch (error) {
        console.error("Error fetching paid users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGetAllPaidUser();
  }, [currentPage, itemsPerPage]);

  // Toggle transaction details
  const toggleUserTransactions = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    if (pagination) {
      setCurrentPage(Math.max(1, Math.min(page, pagination?.total_pages)));
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => pagination && goToPage(pagination?.total_pages);
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

  // Calculate total revenue from successful transactions only
  const totalRevenue = users.reduce((sum, user) => {
    const successfulTx = user.transactions.filter(
      (tx) => tx.status === "success"
    );
    const total = successfulTx.reduce(
      (txSum, tx) => txSum + parseFloat(tx.amount),
      0
    );
    return sum + total;
  }, 0);

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  // Format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(numAmount);
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
        <div className="text-lg">Loading paid users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen overflow-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-6 md:space-y-8 md:mt-0 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Paid Users
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            {pagination?.total_items || 0} total paid users • {attemptedCount}{" "}
            attempted quiz • {notAttemptedCount} not attempted
          </p>
          <div className="flex items-center gap-2 mt-2 text-green-600 font-medium">
            <IndianRupee className="h-4 w-4" />
            <span>Total Revenue: {formatCurrency(totalRevenue)}</span>
          </div>
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
                  <CustomTableHead>Last Payment</CustomTableHead>
                  <CustomTableHead>Amount</CustomTableHead>
                  <CustomTableHead>Payment Method</CustomTableHead>
                  <CustomTableHead>Attempted Quiz</CustomTableHead>
                  <CustomTableHead>Transactions</CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {users.map((user, index) => (
                  <>
                    <CustomTableRow
                      key={user._id}
                      className="cursor-pointer hover:bg-muted/70"
                      onClick={() => toggleUserTransactions(user._id)}
                    >
                      <CustomTableCell className="font-medium">
                        {startIndex + index}
                      </CustomTableCell>
                      <CustomTableCell className="font-medium">
                        {user.name}
                      </CustomTableCell>
                      <CustomTableCell>{user?.email}</CustomTableCell>
                      <CustomTableCell>{user?.phone}</CustomTableCell>
                      <CustomTableCell>{user?.school}</CustomTableCell>
                      <CustomTableCell>
                        {formatDate(user.last_payment?.addedon)}
                      </CustomTableCell>
                      <CustomTableCell className="font-medium text-green-600">
                        {formatCurrency(user?.last_payment?.amount || 0)}
                      </CustomTableCell>
                      <CustomTableCell className="capitalize">
                        {user.last_payment?.mode === "NA"
                          ? "N/A"
                          : user?.last_payment?.mode}
                      </CustomTableCell>
                      <CustomTableCell>
                        <div className="flex items-center gap-2">
                          {user?.is_quiz_attempted ? (
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
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {user?.transactions?.length} txns
                          </span>
                          {expandedUsers.has(user._id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </CustomTableCell>
                    </CustomTableRow>
                    <tr>
                      <td colSpan={10} className="p-0">
                        <TransactionDetails
                          transactions={user?.transactions}
                          isOpen={expandedUsers.has(user._id)}
                        />
                      </td>
                    </tr>
                  </>
                ))}
              </CustomTableBody>
            </CustomTable>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No paid users available</p>
            </div>
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user._id}>
                <div
                  className="rounded-lg border bg-card p-4 space-y-3 cursor-pointer"
                  onClick={() => toggleUserTransactions(user?._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        #{startIndex + index}
                      </p>
                      <h3 className="font-semibold">{user?.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.is_quiz_attempted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      {expandedUsers.has(user._id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium break-all">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{user?.phone}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">School</span>
                      <span className="font-medium">{user?.school}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">
                        Last Payment
                      </span>
                      <span className="font-medium">
                        {formatDate(user.last_payment?.addedon)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(user.last_payment?.amount  || 0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">
                        Payment Method
                      </span>
                      <span className="font-medium capitalize">
                        {user.last_payment?.mode === "NA"
                          ? "N/A"
                          : user.last_payment?.mode}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">
                        Transactions
                      </span>
                      <span className="font-medium">
                        {user.transactions?.length} transactions
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Quiz Status</span>
                      <span
                        className={`font-medium ${
                          user?.is_quiz_attempted
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {user?.is_quiz_attempted
                          ? "Attempted"
                          : "Not Attempted"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Transaction Details */}
                {expandedUsers.has(user._id) && (
                  <div className="mt-2">
                    <TransactionDetails
                      transactions={user?.transactions}
                      isOpen={true}
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8 rounded-lg border bg-card">
              <p className="text-muted-foreground">No paid users available</p>
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

                {/* Page Numbers */}
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

export default PaidUserList;
