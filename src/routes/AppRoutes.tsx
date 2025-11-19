import { Routes } from "react-router-dom";
import { routes } from "../routes";
import { renderRoute } from "./renderRoute";

export function AppRoutes() {
  return <Routes>{routes.map((route) => renderRoute(route))}</Routes>;
}