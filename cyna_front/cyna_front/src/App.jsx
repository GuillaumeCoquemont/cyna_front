import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./styles/global.css";
import ProductsPage from "./pages/ProductsPage";
import DashboardAdmin from "./pages/DashboardAdmin";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="DashboardAdmin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
