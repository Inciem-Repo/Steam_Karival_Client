import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";

export const getDashboardInfo = async () => {
  const res = await apiClient.get(api.admin.getDashboardInfo);
  return res.data;
};

export const getLeaderboard = async (page?: number, limit?: number,category?:string) => {
  const res = await apiClient.get(api.admin.getLeaderboard(page, limit,category));
  return res.data;
};
