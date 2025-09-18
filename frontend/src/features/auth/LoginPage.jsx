import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from './AuthContext';
import styles from '../../styles/LoginPage.module.css';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, role, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = localStorage.getItem("redirectAfterLogin");
      if (redirectTo) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo);
      } else if (role === "ADMIN") {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Adresse email invalide.");
      return;
    }

    if (!password || password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      const res = await axios.post('/api/auth/login', { email, password });
console.log("Token JWT reçu :", res.data.token);
      const token = res.data.token;
      if (!token) {
        alert("Email ou mot de passe invalide");
        return;
      }

      const decoded = jwtDecode(token);
      localStorage.setItem("token", token);
      login(token); // login gère déjà les rôles via le JWT

    } catch (err) {
      console.error("Erreur de connexion :", err);
      if (err.response?.status === 401) {
        alert("Email ou mot de passe incorrect.");
      } else {
        alert("Erreur serveur. Veuillez réessayer plus tard.");
      }
    }
  };
const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8085';

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.loginInput}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.loginInput}
          required
        />
        
        <button type="submit" className={styles.loginButton}>
          Se connecter
        </button>
          <p className={styles.loginText}>
            <Link to="/forgot-password" className={styles.link}>
              Mot de passe oublié ?
            </Link>
          </p>
        <hr className={styles.divider} />

        <button
          type="button"
          className={styles.loginButton}
          onClick={() => {
            window.location.href = `${backendURL}/oauth2/authorization/google`;
          }}
        >
          Connexion avec Google
        </button>


        <p className={styles.loginText}>
          Pas encore inscrit ?{' '}
          <Link to="/signup" className={styles.link}>
            Créer un compte
          </Link>
        </p>
      </form>
   </>
  );
}

export default LoginPage;
