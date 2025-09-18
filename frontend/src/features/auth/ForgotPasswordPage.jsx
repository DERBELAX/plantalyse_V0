import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/LoginPage.module.css'; 

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/forgot-password', { email });
      setMessage("📨 Un e-mail de réinitialisation vous a été envoyé.");
    } catch (error) {
      setMessage("❌ Erreur : " + (error.response?.data?.message || "Essayez plus tard."));
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.loginTitle}>Mot de passe oublié</h2>
    <form onSubmit={handleSubmit} className={styles.formGroup}>
        <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.loginInput}
        />
        <button type="submit" className={styles.loginButton}>
            Envoyer le lien
        </button>
    </form>

      {message && <p className={styles.loginText}>{message}</p>}
    </div>
  );
}

export default ForgotPasswordPage;
