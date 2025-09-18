import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../styles/LoginPage.module.css'; // ✅ import correct

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = new URLSearchParams(useLocation().search).get('token');

  useEffect(() => {
    if (!token) {
      setMessage("❌ Lien de réinitialisation invalide ou expiré.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setMessage("❌ Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    try {
      await axios.post('/api/auth/reset-password', {
        token,
        newPassword: password
      });
      setMessage("✅ Mot de passe modifié avec succès.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage("❌ Le lien est invalide ou expiré.");
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.loginTitle}>Réinitialiser le mot de passe</h2>

      {message && <p className={styles.loginText}>{message}</p>}

      {token && (
        <form onSubmit={handleSubmit} className={styles.formGroup}>
        <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.loginInput}
        />
        <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className={styles.loginInput}
        />
        <button type="submit" className={styles.loginButton}>
            Valider
        </button>
        </form>

      )}
    </div>
  );
}

export default ResetPasswordPage;
