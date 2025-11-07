import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";

export const registerService = async (userData: any) => {
  const res = await apiClient.post(api.auth.register, userData);
  return res.data;
};
export const loginService = async (userData: any) => {
  const res = await apiClient.post(api.auth.login, userData);
  return res.data;
};

export const getProfileService = async (userId: string) => {
  const res = await apiClient.get(api.user.getProfile(userId));
  return res.data;
};
export const getAllUser = async (page: number, limit: number) => {
  const res = await apiClient.get(api.user.getAllUser(page, limit));
  return res.data;
};
export const getAllPaidUser = async (page: number, limit: number) => {
  const res = await apiClient.get(api.user.getPaidUser(page, limit));
  return res.data;
};
export const getUserQuizInfo = async (userID: string) => {
  const res = await apiClient.get(api.user.getUserQuizInfo(userID));
  return res.data;
};
