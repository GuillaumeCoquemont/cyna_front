import React from "react";
import { CartProvider } from "./context/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./styles/global.css";
import ProductsPage from "./pages/ProductsPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/layout/Layout";
import Contact from "./pages/Contact";
import Discover from "./pages/Discover";
import DashboardClient from "./pages/DashboardClient";
import ProductDetails from "./pages/ProductDetails";
import CheckoutPage from "./pages/CheckoutPage";

const App = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path ="/dashboardClient" element={<DashboardClient/>} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            {/* Redirect base /auth to login */}
            <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<AuthPage />} />
            <Route path="/auth/register" element={<AuthPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
