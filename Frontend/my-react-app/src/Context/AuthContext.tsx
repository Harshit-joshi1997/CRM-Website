import { secondsInDay } from "date-fns/constants";
import {
  createContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  useContext,
} from "react";
import { useIdleTimer } from "react-idle-timer";

// Define the User type
interface User {
  userType: "admin" | "employee" | null;
  role: "admin" | "employee" | null;
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  const IDLE_TIMEOUT = (5* 60 * 1000); // 5 minutes in ms

  // --- Logout logic ---
  const handleLogout = () => {
    console.log("Logging out due to token expiration or idle timeout");
    setToken(null);
    setUser(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    localStorage.removeItem("loginData");
  };

  // --- JWT expiry logic ---
  const setTokenExpiration = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        const timeUntilExpiration = exp - Date.now();
        if (timeUntilExpiration <= 0) {
          console.log("JWT expired. Logging out user.");
          handleLogout();
        } else {
          timeoutRef.current = setTimeout(() => {
            console.log("JWT expiry reached. Logging out user.");
            handleLogout();
          }, timeUntilExpiration);
          console.log(`JWT will expire in ${Math.floor(timeUntilExpiration / 1000)} seconds.`);
        }
      } catch (error) {
        console.error("Invalid token format", error);
        handleLogout();
      }
    }
  };


  // --- Idle timer setup ---
  const { reset } = useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: () => {
      console.log("Idle timeout reached. Logging out user.");
      handleLogout();
    },
    onAction: () => {
      console.log("User activity detected → resetting idle timer" , IDLE_TIMEOUT/1000);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        console.log("Idle timeout reached (manual). Logging out user.");
        handleLogout();
      }, IDLE_TIMEOUT);
    },
    debounce: 500,
  });

  // --- Load from localStorage on mount ---
  useEffect(() => {
    try {
      const loginDataString = localStorage.getItem("loginData");
      if (loginDataString) {
        const parsed = JSON.parse(loginDataString);
        if (parsed?.token && parsed?.user) {
          setToken(parsed.token);
          setUser(parsed.user);
          setTokenExpiration();
        } else {
          console.log("AuthContext: Invalid loginData, clearing");
          localStorage.removeItem("loginData");
        }
      }
    } catch (error) {
      console.error("AuthContext: Failed to parse loginData", error);
      localStorage.removeItem("loginData");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Keep localStorage in sync ---
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (token && user) {
      const loginData = { token, user };
      localStorage.setItem("loginData", JSON.stringify(loginData));
      setTokenExpiration();
      reset();
    } else {
      localStorage.removeItem("loginData");
    }
  }, [token, user]);

  // --- Auth methods ---
  const login = (newUser: User, newToken: string) => {
    setUser(newUser);
    setToken(newToken);
  };

  const logout = () => {
    handleLogout();
  };

  const contextValue: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
