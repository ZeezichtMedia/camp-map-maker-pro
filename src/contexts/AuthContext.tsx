
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  checkWordPressAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for WordPress user authentication
  const checkWordPressAuth = () => {
    // Check if running in WordPress context
    if (typeof window !== 'undefined' && (window as any).wpMapEditor) {
      const wpAuth = (window as any).wpMapEditor.isAdmin;
      setIsAuthenticated(wpAuth);
      setIsLoading(false);
      return;
    }

    // Fallback: check localStorage for demo purposes
    const savedAuth = localStorage.getItem('mapEditor_auth');
    setIsAuthenticated(savedAuth === 'authenticated');
    setIsLoading(false);
  };

  const login = async (password: string): Promise<boolean> => {
    // Demo password - in WordPress this would be handled server-side
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('mapEditor_auth', 'authenticated');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('mapEditor_auth');
  };

  useEffect(() => {
    checkWordPressAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkWordPressAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
