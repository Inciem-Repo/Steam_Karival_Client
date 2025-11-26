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
import type { AuthContextType, User, UserLevels } from "../utils/types/user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLevels, setUserLevels] = useState<UserLevels | null>(null);

  const refreshUser = async () => {
    const savedToken = getAuthToken();
    if (!savedToken) {
      setIsUserLoggedIn(false);
      setLoading(false);
      return;
    }

    setToken(savedToken);

    const decoded = getAuthDetails();
    if (!decoded?.user_id) {
      setIsUserLoggedIn(false);
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
        paid_levels: profile.user?.paid_levels,
        current_quiz_level: profile.user.current_quiz_level,
      };

      setUser(userData);
      setUserLevels(profile.user.levels);
      setIsUserLoggedIn(true);
    } catch (err) {
      console.log("Profile load error:", err);

      setUser(null);
      setIsUserLoggedIn(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
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
        paid_levels: data.user?.paid_levels,
        current_quiz_level: data.user.current_quiz_level,
      };

      setUser(u);

      if (data.user.levels) {
        setUserLevels(data.user.levels);
      }

      // 👉 User logged in
      setIsUserLoggedIn(true);

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
    setIsUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        userLevels,
        logout,
        refreshUser,
        isUserLoggedIn,
      }}
    >
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
