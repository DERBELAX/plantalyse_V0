import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './features/public/Home';
import Products from './features/plants/Products';
import ProductDetail from './features/plants/ProductDetail';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPassword';

import OAuth2RedirectHandler from "./features/auth/OAuth2RedirectHandler";

import BlogList from './features/blog/BlogList';
import BlogDetail from './features/blog/BlogDetail';

import About from './features/public/About';
import Contact from './features/public/Contact';
import CGU from './features/public/CGU';

import CommunityPage from './features/community/CommunityPage';
import PostDetailPage from './features/community/PostDetailPage';

import CartPage from './features/cart/CartPage';
import MerciPage from './features/cart/MerciPage';
import PaymentSuccess from './features/cart/PaymentSuccess';

import PlantIdentifier from './features/plants/PlantIdentifier';
import IdentificationResults from './features/plants/IdentificationResult';

import UserDashboard from './features/user/UserDashboard';
import AdminDashboard from './features/admin/AdminDashboard';


import AdminRoute from './routes/AdminRoute';
import { AuthProvider } from './features/auth/AuthContext';
import { CartProvider } from './features/cart/CartContext';

import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Pages avec layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cgu" element={<CGU />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/community/:id" element={<PostDetailPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/merci" element={<MerciPage />} />
              <Route path="/identifier" element={<PlantIdentifier />} />
              <Route path="/success" element={<PaymentSuccess />} />
              <Route path="/identification-results" element={<IdentificationResults />} />
              {/* Pages sans layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            </Route>

            

            {/* Admin sécurisé */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              {/* Ici tu peux ajouter d’autres routes admin si besoin */}
              {/* <Route path="plants/new" element={<PlantForm />} /> */}
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
