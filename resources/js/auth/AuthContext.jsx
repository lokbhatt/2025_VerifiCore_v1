import { createContext, useContext, useState } from "react";
import { logout as apiLogout } from "../api/axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(()=> localStorage.getItem('role'));

  const login = (authToken, userRole) => {
    setToken(authToken);
    setRole(userRole);
    localStorage.setItem("token", authToken);
    localStorage.setItem("role", userRole);
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.warn("Token may have already expired.");
    } finally {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("remember_token");
      localStorage.removeItem("role");

      setToken(null);
      setRole(null);

      window.location.href = `/login/${role || "member"}`;
    }
  };
  const isAuthenticated = !!token;
  return (
    <AuthContext.Provider value={{ token, role, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
