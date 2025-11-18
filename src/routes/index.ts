import { lazy } from "react";
import { roleName } from "../utils/constants/env";
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const ChatBotAccessList = lazy(
  () => import("../pages/admin/ChatBotAccessList")
);
const Dashboard = lazy(() => import("../pages/admin/DashBoard"));
const LeaderBoard = lazy(() => import("../pages/admin/LeaderBoard"));
const PaidUserList = lazy(() => import("../pages/admin/PaidUserList"));
const QuizManager = lazy(() => import("../pages/admin/QuizManager"));
const UserList = lazy(() => import("../pages/admin/UserList"));
const UsersProfile = lazy(() => import("../pages/admin/UsersProfile"));
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const NotFound = lazy(() => import("../pages/commen/NotFound"));
const Home = lazy(() => import("../pages/user/Home"));
const Landing = lazy(() => import("../pages/user/Landing"));
const PaymentPage = lazy(() => import("../pages/user/PaymentPage"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Quiz = lazy(() => import("../pages/user/Quiz"));
const Results = lazy(() => import("../pages/user/Results"));

export type AppRoute = {
  id: string;
  path: string;
  component?: React.FC;
  protected?: boolean;
  roles?: string[];
  layout?: React.ComponentType<{ children: React.ReactNode }>;
  children?: AppRoute[];
  requiresPayment?: boolean;
};

export const routes: AppRoute[] = [
  {
    id: "admin",
    path: "/admin",
    protected: true,
    roles: [roleName.admin],
    layout: AdminLayout,
    requiresPayment: false,
    children: [
      { id: "dashboard", path: "dashboard", component: Dashboard },
      { id: "leaderboard", path: "leaderboard", component: LeaderBoard },
      { id: "quizz-manger", path: "quizz-manger", component: QuizManager },
      { id: "users", path: "users", component: UserList },
      { id: "paid-users", path: "paid-users", component: PaidUserList },
      { id: "paid-users", path: "chat-users", component: ChatBotAccessList },
      { id: "profile", path: "profile/user/:id", component: UsersProfile },
    ],
  },

  {
    id: "home",
    path: "/home",
    component: Home,
    protected: true,
    roles: [roleName.user],
    requiresPayment: false,
  },

  {
    id: "payment",
    path: "/payment",
    component: PaymentPage,
    protected: true,
    roles: [roleName.user],
    requiresPayment: false,
  },
  {
    id: "profile",
    path: "/profile",
    component: Profile,
    protected: true,
    roles: [roleName.user],
    requiresPayment: true,
  },
  {
    id: "quiz",
    path: "/quiz",
    component: Quiz,
    protected: true,
    roles: [roleName.user],
    requiresPayment: true,
  },
  {
    id: "results",
    path: "/results",
    component: Results,
    protected: true,
    roles: [roleName.user],
    requiresPayment: true,
  },
  { id: "login", path: "/login", component: Login, requiresPayment: false },
  {
    id: "register",
    path: "/register",
    component: Register,
    requiresPayment: false,
  },
  {
    id: "landing",
    path: "/",
    component: Landing,
    protected: false,
    roles: [roleName.user],
    requiresPayment: false,
  },
  { id: "not-found", path: "*", component: NotFound, requiresPayment: false },
];

export default routes;
