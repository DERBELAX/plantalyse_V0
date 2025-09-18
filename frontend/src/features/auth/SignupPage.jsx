import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/SignupPage.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
function SignupPage() {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errs = {};

    const nameRegex = /^[A-Za-zÀ-ÿ\-'\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
;

    if (!nameRegex.test(form.firstname)) {
      errs.firstname = 'Prénom invalide';
    }
    if (!nameRegex.test(form.lastname)) {
      errs.lastname = 'Nom invalide';
    }
    if (!emailRegex.test(form.email)) {
      errs.email = 'Email invalide';
    }
    if (!passwordRegex.test(form.password)) {
      errs.password = 'Mot de passe trop faible (min 8 caractères, 1 majuscule, 1 chiffre)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('/api/auth/signup', form);
      alert("Inscription réussie, vous pouvez maintenant vous connecter !");
      navigate('/login');
    } catch (err) {
      alert("Erreur d'inscription");
    }
  };
  const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8085';


  return (
    <>
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2>Créer un compte</h2>

          <input name="firstname" placeholder="Prénom" onChange={handleChange} required />
          {errors.firstname && <p className="error">{errors.firstname}</p>}

          <input name="lastname" placeholder="Nom" onChange={handleChange} required />
          {errors.lastname && <p className="error">{errors.lastname}</p>}

          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          {errors.email && <p className="error">{errors.email}</p>}

          <input type="password" name="password" placeholder="Mot de passe" onChange={handleChange} required />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">S'inscrire</button>
          <br></br>
          <hr />
         <p>Ou</p>
           
             
 <button
           type="button"
          
           onClick={() => {
           window.location.href = `${backendURL}/oauth2/authorization/google`;
      
           }}
         >
           Connexion avec Google
         </button>


        
        </form>
      </div>
    </>
  );
}

export default SignupPage;
