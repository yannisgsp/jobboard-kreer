import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  role?: "admin" | "company" | "user";
  description: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const check_auth_url = "/api/users/profile";
  const checkAuth = async () => {
    try {
      const response = await fetch(check_auth_url, {
        method: "GET",
        credentials: "include",
      });
      response.status === 200 ? setIsLoggedIn(true) : setIsLoggedIn(false);
      const data = await response.json();

      setUser({
        id: data.user_id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        description: data.description,
        role: data.role,
      });
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
