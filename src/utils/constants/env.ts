export const ENV_TYPE = import.meta.env.VITE_ENV_TYPE;
export const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export let RAZORPAY_KEY_ID: string = "";

ENV_TYPE === "DEVELOPMENT"
  ? (RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID_TEST)
  : (RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID);

export const checkOutURL = "https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/v2.0.0/easebuzz-checkout-v2.min.js";

export const roleName = {
  admin: "admin",
  user: "user",
};
