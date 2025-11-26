import { jwtDecode } from "jwt-decode";
import type { AuthUser } from "./types/user";

// covert data into formData
export function objectToFormData(
  data: Record<string, any>,
  form?: FormData,
  parentKey?: string
): FormData {
  const formData = form || new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    const fieldKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File) {
      formData.append(fieldKey, value);
    } else if (value instanceof Blob) {
      formData.append(fieldKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => {
        objectToFormData({ [i]: v }, formData, fieldKey);
      });
    } else if (value && typeof value === "object") {
      objectToFormData(value, formData, fieldKey);
    } else if (value !== undefined && value !== null) {
      formData.append(fieldKey, value);
    }
  });

  return formData;
}
export const setToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
export const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") return null;
    return token;
  } catch (err) {
    console.error("Error reading auth token:", err);
    return null;
  }
};
export const getAuthDetails = (): AuthUser | null => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const decoded: AuthUser = jwtDecode(token);
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      console.warn("Token expired removing from storage.");
      localStorage.removeItem("token");
      return null;
    }
    return decoded;
  } catch (err) {
    console.error("Error decoding auth token:", err);
    return null;
  }
};
export const replaceAuthToken = (newToken: string): void => {
  try {
    localStorage.removeItem("token");
    if (!newToken || newToken === "undefined" || newToken === "null") return;
    localStorage.setItem("token", newToken);
    window.dispatchEvent(new Event("auth-token-updated"));
  } catch (err) {
    console.error("Error replacing auth token:", err);
  }
};
export const setUserInfo = (userInfo: any) => {
  const userDetails = {
    id: userInfo.user_id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
    phone: userInfo.phone,
    school: userInfo.school,
    username: userInfo.name,
    isPaid: userInfo?.isPaid,
    current_quiz_level: userInfo?.current_quiz_level,
  };
  return userDetails;
};
