import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      login(token);
    } else {
      navigate("/login");
    }
  }, [location]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // ou dashboard
    }
  }, [isAuthenticated]);

  return <div>🔁 Redirection...</div>;
};

export default OAuth2RedirectHandler;
