import apiClient from "../config/apiClient";
import { api } from "../utils/constants/apiEndPoints";
import type { RazorpayResponse } from "../utils/types/user";

export const orderPaymentService = async (amount: {
  amount: String;
  firstname?: String;
  email?:string;
  phone?:string
}) => {
  const res = await apiClient.post(api.payment.order, amount);
  return res.data;
};
export const verifyPaymentService = async (response: RazorpayResponse) => {
  const res = await apiClient.post(api.payment.verify, response);
  return res.data;
};
