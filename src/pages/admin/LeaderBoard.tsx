import {
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const allUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    questionsAttempted: 150,
    timeTaken: "45m 23s",
    marks: 142,
    rank: 1,
  },
  {
    id: 2,
    name: "Bob Smith",
    questionsAttempted: 148,
    timeTaken: "47m 10s",
    marks: 138,
    rank: 2,
  },
  {
    id: 3,
    name: "Carol White",
    questionsAttempted: 145,
    timeTaken: "48m 45s",
    marks: 135,
    rank: 3,
  },
  {
    id: 4,
    name: "David Brown",
    questionsAttempted: 143,
    timeTaken: "50m 12s",
    marks: 132,
    rank: 4,
  },
  {
    id: 5,
    name: "Emma Davis",
    questionsAttempted: 140,
    timeTaken: "51m 30s",
    marks: 128,
    rank: 5,
  },
  {
    id: 6,
    name: "Frank Wilson",
    questionsAttempted: 138,
    timeTaken: "52m 45s",
    marks: 125,
    rank: 6,
  },
  {
    id: 7,
    name: "Grace Lee",
    questionsAttempted: 135,
    timeTaken: "54m 20s",
    marks: 122,
    rank: 7,
  },
  {
    id: 8,
    name: "Henry Taylor",
    questionsAttempted: 133,
    timeTaken: "55m 10s",
    marks: 119,
    rank: 8,
  },
  {
    id: 9,
    name: "Ivy Martinez",
    questionsAttempted: 130,
    timeTaken: "56m 30s",
    marks: 115,
    rank: 9,
  },
  {
    id: 10,
    name: "Jack Anderson",
    questionsAttempted: 128,
    timeTaken: "57m 45s",
    marks: 112,
    rank: 10,
  },
  {
    id: 11,
    name: "Kelly Thomas",
    questionsAttempted: 125,
    timeTaken: "59m 15s",
    marks: 108,
    rank: 11,
  },
  {
    id: 12,
    name: "Liam Garcia",
    questionsAttempted: 122,
    timeTaken: "60m 30s",
    marks: 105,
    rank: 12,
  },
  {
    id: 13,
    name: "Mia Rodriguez",
    questionsAttempted: 120,
    timeTaken: "61m 45s",
    marks: 102,
    rank: 13,
  },
  {
    id: 14,
    name: "Noah Hernandez",
    questionsAttempted: 118,
    timeTaken: "63m 10s",
    marks: 98,
    rank: 14,
  },
  {
    id: 15,
    name: "Olivia Lopez",
    questionsAttempted: 115,
    timeTaken: "64m 20s",
    marks: 95,
    rank: 15,
  },
];

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

  // Calculate pagination
  const totalPages = Math.ceil(allUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = allUsers.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  return (
    <div className="h-screen overflow-scroll p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leader Board</h1>
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
                <CustomTableHead>Questions Attempted</CustomTableHead>
                <CustomTableHead>Time Taken</CustomTableHead>
                <CustomTableHead>Marks</CustomTableHead>
                <CustomTableHead>Rank</CustomTableHead>
                <CustomTableHead className="w-[100px]">Action</CustomTableHead>
              </CustomTableRow>
            </CustomTableHeader>
            <CustomTableBody>
              {currentUsers.map((user, index) => (
                <CustomTableRow key={user.id}>
                  <CustomTableCell className="font-medium">
                    {startIndex + index + 1}
                  </CustomTableCell>
                  <CustomTableCell className="font-medium">
                    {user.name}
                  </CustomTableCell>
                  <CustomTableCell>{user.questionsAttempted}</CustomTableCell>
                  <CustomTableCell>{user.timeTaken}</CustomTableCell>
                  <CustomTableCell className="font-semibold">
                    {user.marks}
                  </CustomTableCell>
                  <CustomTableCell>
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
                  <CustomTableCell>
                    <button onClick={() => navigate(`/admin/profile/user`)}>
                      <Eye className="h-4 w-4" />
                    </button>
                  </CustomTableCell>
                </CustomTableRow>
              ))}
            </CustomTableBody>
          </CustomTable>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, allUsers.length)} of{" "}
            {allUsers.length} entries
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={goToFirstPage} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button onClick={goToPreviousPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
