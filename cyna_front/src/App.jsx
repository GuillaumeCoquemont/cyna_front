import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/dashboard" element={<DashboardAdmin />} />
          <Route path ="/dashboardClient" element={<DashboardClient/>} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
