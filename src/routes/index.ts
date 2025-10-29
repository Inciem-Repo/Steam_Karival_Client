import DashBoard from "../pages/admin/DashBoard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/commen/NotFound";
import Home from "../pages/user/Home";
import { Profile } from "../pages/user/Profile";
import { Quiz } from "../pages/user/Quiz";
import { Results } from "../pages/user/Results";
import { roleName } from "../utils/constants/env";

export type AppRoute = {
  id: string;
  path: string;
  component: React.FC;
  protected?: boolean;
  roles?: string[];
};

export const routes: AppRoute[] = [
  {
    id: "dashboard",
    path: "/dashboard",
    component: DashBoard,
    protected: true,
    roles: [roleName.admin],
  },
  {
    id: "home",
    path: "/",
    component: Home,
    protected: true,
    roles: [roleName.user],
  },
  {
    id: "profile",
    path: "/profile",
    component: Profile,
    protected: true,
    roles: [roleName.user],
  },
  {
    id: "quiz",
    path: "/quiz",
    component: Quiz,
    protected: true,
    roles: [roleName.user],
  },
  {
    id: "results",
    path: "/results",
    component: Results,
    protected: true,
    roles: [roleName.user],
  },
  {
    id: "login",
    path: "/login",
    component: Login,
  },
  {
    id: "register",
    path: "/register",
    component: Register,
  },
  {
    id: "not-found",
    path: "*",
    component: NotFound,
  },
];
