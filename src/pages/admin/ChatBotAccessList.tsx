import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MessageCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { getAllWhatAppUser } from "../../services/auth";

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

interface ChatBotUser {
  _id: string;
  user_mobile_number: string;
  user_question: string;
  response: string;
  user_timestamp: string;
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
  data: ChatBotUser[];
  message: string;
}

const ChatBotAccessList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [chats, setChats] = useState<ChatBotUser[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { callApi: callGetAllWhatAppUser } = useApi(getAllWhatAppUser);

  useEffect(() => {
    const fetchChatBotUsers = async () => {
      try {
        setLoading(true);
        const response = (await callGetAllWhatAppUser(
          currentPage,
          itemsPerPage
        )) as ApiResponse;

        if (response.status && response.data) {
          setChats(response.data);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error("Error fetching chatbot users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatBotUsers();
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

  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Format mobile number
  const formatMobileNumber = (mobile: string) => {
    // Remove "whatsapp:" prefix if present
    return mobile.replace("whatsapp:", "");
  };

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
        <div className="text-lg">Loading chatbot access logs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen overflow-auto p-4 md:p-6 lg:p-8">
      <div className="space-y-6 md:space-y-8 md:mt-0 mt-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            ChatBot Access Logs
          </h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            {pagination?.total_items || 0} total chat interactions • {chats.length} shown
          </p>
          <div className="flex items-center gap-2 mt-2 text-blue-600 font-medium">
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp ChatBot Interactions</span>
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
          {chats.length > 0 ? (
            <CustomTable>
              <CustomTableHeader>
                <CustomTableRow>
                  <CustomTableHead className="w-[80px]">SL.No</CustomTableHead>
                  <CustomTableHead>Mobile Number</CustomTableHead>
                  <CustomTableHead>Timestamp</CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {chats.map((chat, index) => (
                  <CustomTableRow key={chat._id}>
                    <CustomTableCell className="font-medium">
                      {startIndex + index}
                    </CustomTableCell>
                    <CustomTableCell className="font-medium">
                      {formatMobileNumber(chat.user_mobile_number)}
                    </CustomTableCell>
                    <CustomTableCell>
                      {formatDate(chat.user_timestamp)}
                    </CustomTableCell>
                  </CustomTableRow>
                ))}
              </CustomTableBody>
            </CustomTable>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No chatbot interactions found</p>
            </div>
          )}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {chats.length > 0 ? (
            chats.map((chat, index) => (
              <div
                key={chat._id}
                className="rounded-lg border bg-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      #{startIndex + index}
                    </p>
                    <h3 className="font-semibold">
                      {formatMobileNumber(chat.user_mobile_number)}
                    </h3>
                  </div>
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">Timestamp</span>
                    <span className="font-medium">
                      {formatDate(chat.user_timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center py-8 rounded-lg border bg-card">
              <p className="text-muted-foreground">No chatbot interactions found</p>
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

export default ChatBotAccessList;