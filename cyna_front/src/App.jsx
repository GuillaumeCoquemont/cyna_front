import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./styles/global.css";
import ProductsPage from "./pages/ProductsPage";
import DashboardAdmin from "./pages/DashboardAdmin";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/layout/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/dashboard" element={<DashboardAdmin />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
