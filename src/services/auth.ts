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
