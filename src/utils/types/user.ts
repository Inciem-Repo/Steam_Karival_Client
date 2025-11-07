export interface AuthUser {
  user_id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  exp: number;
  iat: number;
  isPaid?: boolean;
}
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
    animation?: boolean;
  };
}
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
export interface RazorpayErrorPayload {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  };
}
export interface RazorpayInstance {
  open: () => void;
  on: (
    event:
      | "payment.failed"
      | "payment.success"
      | "external_wallet"
      | "close"
      | string,
    callback: (payload?: any) => void
  ) => void;
}
export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  school?: string;
  user_id?: string;
  username?: string;
  [key: string]: any;
  isPaid?: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
}
