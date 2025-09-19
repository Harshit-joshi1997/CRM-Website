import { createContext, useState, useEffect, type ReactNode, useContext } from 'react';
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
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage on mount
    try {
      const loginDataString = localStorage.getItem('loginData');
      if (loginDataString) {
        const { token: savedToken, user: savedUser } = JSON.parse(loginDataString);
        if (savedUser) {
          
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

  const login = ( newUser: User) => {
    
    setUser(newUser);
    localStorage.setItem('loginData', JSON.stringify({  user: newUser }));
  };

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem('loginData');
  };

  const contextValue = {
    
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue }>
      {children}
    </AuthContext.Provider>
  );
};


// --- This is the custom hook you need ---
// Now, other components can easily access the context data
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};