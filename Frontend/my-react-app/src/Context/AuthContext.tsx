import { createContext, useState, useEffect, type ReactNode, useRef, useContext } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import jwt_decode from 'jwt-decode';


interface User {
  userType: 'admin' | 'employee' | null;
  role: 'admin' | 'employee' | null;
  name?: string;
  email?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage on mount
    try {
      const loginDataString = localStorage.getItem('loginData');
      if (loginDataString) {
        const { token: savedToken, user: savedUser } = JSON.parse(loginDataString);
        if (savedToken) {
          setToken(savedToken);
          setUser(savedUser || null);
        }
      }
    } catch (error) {
      console.error('AuthContext: Failed to parse loginData', error);
      localStorage.removeItem('loginData');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('loginData', JSON.stringify({ token: newToken, user: newUser }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('loginData');
  };

  const contextValue = {
    token,
    user,
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


