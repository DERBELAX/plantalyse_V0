// AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken && typeof savedToken === "string") {
      try {
        const decoded = jwtDecode(savedToken);
        const extractedRole = decoded.roles?.[0] || null;
        

        setToken(savedToken);
        setRole(extractedRole);
        setUser({
          id: decoded.id,
          firstname: decoded.firstname,
          email: decoded.email,
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("❌ Token invalide (init) :", err);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      const extractedRole = decoded.roles?.[0] || null;

      setToken(newToken);
      setRole(extractedRole);
      setUser({
        id: decoded.id,
        firstname: decoded.firstname,
        email: decoded.email,
      });
      setIsAuthenticated(true);
      localStorage.setItem("token", newToken);
    } catch (err) {
      console.error("❌ Erreur de décodage du token :", err);
      logout();
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, role, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
