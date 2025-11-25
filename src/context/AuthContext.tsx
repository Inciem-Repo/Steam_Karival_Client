import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { showError } from "../utils/toast";
import { loginService, getProfileService } from "../services/auth";
import { getAuthDetails, getAuthToken } from "../utils/helper";
import type { AuthContextType, User } from "../utils/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedToken = getAuthToken();
      if (!savedToken) {
        setLoading(false);
        return;
      }
      setToken(savedToken);
      const decoded = getAuthDetails();
      if (!decoded?.user_id) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getProfileService(decoded.user_id);
        const userData: User = {
          id: profile.user._id,
          name: profile.user.name,
          email: profile.user.email,
          role: profile.user.role,
          phone: profile.user.phone,
          school: profile.user.school,
          username: profile.user.name,
          isPaid: profile.user.isPaid,
          current_quiz_level: profile.user.current_quiz_level,
        };
        setUser(userData);
      } catch (err) {
        console.log("Profile load error:", err);
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginService({ email, password });

      if (!data?.token) throw new Error("Invalid login");

      localStorage.setItem("token", data.token);
      setToken(data.token);
      const u: User = {
        id: data.user.user_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        phone: data.user.phone,
        school: data.user.school,
        username: data.user.name,
        isPaid: data.user.isPaid,
        current_quiz_level: data.user.current_quiz_level,
      };

      setUser(u);
      return u;
    } catch (err) {
      showError(err);
      throw err;
    }
  };

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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export default AuthProvider;
