import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";

export const getDashboardInfo = async () => {
  const res = await apiClient.get(api.admin.getDashboardInfo);
  return res.data;
};

export const getLeaderboard = async (page: number, limit: number) => {
  const res = await apiClient.get(api.admin.getLeaderboard(page, limit));
  return res.data;
};
