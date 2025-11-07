// src/routes/index.ts
import AdminLayout from "../components/admin/AdminLayout";
import Dashboard from "../pages/admin/DashBoard";
import LeaderBoard from "../pages/admin/LeaderBoard";
import PaidUserList from "../pages/admin/PaidUserList";
import QuizManager from "../pages/admin/QuizManager";
import UserList from "../pages/admin/UserList";
import UsersProfile from "../pages/admin/UsersProfile";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/commen/NotFound";
import Home from "../pages/user/Home";
import PaymentPage from "../pages/user/PaymentPage";
import { Profile } from "../pages/user/Profile";
import { Quiz } from "../pages/user/Quiz";
import { Results } from "../pages/user/Results";
import { roleName } from "../utils/constants/env";

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
      { id: "profile", path: "profile/user/:id", component: UsersProfile },
    ],
  },

  {
    id: "home",
    path: "/",
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
  { id: "not-found", path: "*", component: NotFound, requiresPayment: false },
];
