import { Users, CheckCircle, Target, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "../../components/common/StatCard";

// Mock data - replace with real data from your backend
const topUsers = [
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
];

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

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-scroll p-6">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Users"
            value="1,234"
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Quiz Attempts"
            value="856"
            icon={Target}
            description="Users who attempted quizzes"
          />
          <StatCard
            title="Quiz Completions"
            value="645"
            icon={CheckCircle}
            description="Successfully completed"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Top 10 Leaderboard
              </h2>
            </div>
            <button
              className="btn-outline"
              onClick={() => navigate("/leaderboard")}
            >
              View Full Leaderboard
            </button>
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
                  <CustomTableHead className="w-[100px]">
                    Action
                  </CustomTableHead>
                </CustomTableRow>
              </CustomTableHeader>
              <CustomTableBody>
                {topUsers.map((user, index) => (
                  <CustomTableRow key={user.id}>
                    <CustomTableCell className="font-medium">
                      {index + 1}
                    </CustomTableCell>
                    <CustomTableCell>{user.name}</CustomTableCell>
                    <CustomTableCell>{user.questionsAttempted}</CustomTableCell>
                    <CustomTableCell>{user.timeTaken}</CustomTableCell>
                    <CustomTableCell>{user.marks}</CustomTableCell>
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
                      <button onClick={() => navigate(`/profile/${user.id}`)}>
                        <Eye className="h-4 w-4" />
                      </button>
                    </CustomTableCell>
                  </CustomTableRow>
                ))}
              </CustomTableBody>
            </CustomTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
