import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { showError } from "../utils/toast";
import { loginService } from "../services/auth";
import { getAuthDetails, getAuthToken } from "../utils/helper";
import type { AuthContextType, User } from "../utils/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleTokenChange = () => {
      const savedToken = getAuthToken();
      setToken(savedToken);
    };

    window.addEventListener("auth-token-updated", handleTokenChange);
    return () => {
      window.removeEventListener("auth-token-updated", handleTokenChange);
    };
  }, []);

  /** Initialize user/token on app load */
  useEffect(() => {
    const savedToken = getAuthToken();

    if (savedToken) {
      setToken(savedToken);
      const decoded = getAuthDetails();
      if (decoded) {
        const userFromToken: User = {
          id: decoded.user_id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          phone: decoded.phone,
          school: decoded.school,
          username: decoded.name,
          isPaid: decoded?.isPaid,
        };
        setUser(userFromToken);
      }
    }

    setLoading(false);
  }, [token]);

  /** Login and save token (user derived from response or decoded) */
  const login = async (email: string, password: string) => {
    try {
      const data = await loginService({ email, password });
      if (!data?.token) {
        throw new Error("Invalid login");
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const userInfo = {
        id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
        school: data.user.school,
        username: data.user.name,
        isPaid: data.user.isPaid,
      };

      if (userInfo) setUser(userInfo);
      return userInfo;
    } catch (err) {
      showError(err);
      throw err;
    }
  };

  /**Logout and clear storage */
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Custom hook */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
