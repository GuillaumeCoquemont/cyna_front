import React from "react";
import Header from "../components/layout/Header";
import HeroSection from "../components/sections/HeroSection";
import ProductsPreviewSection from "../components/sections/ProductsPreviewSection";
import styles from "../styles/components/Landing/LandingPage.module.css";
import ProductsSection from "../components/sections/ProductsSection";
import ProductsTop from "../components/sections/ProductsTop";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <main className={styles.mainContent}>
        <HeroSection />
        <ProductsSection />
        <ProductsPreviewSection />
        <ProductsTop />

        {/* Autres sections à venir */}
      </main>
    </div>
  );
};

export default LandingPage;
