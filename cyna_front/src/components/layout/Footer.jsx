import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/Footer/Footer.module.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'inscription à la newsletter
    console.log("Email souscrit:", email);
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Services</h3>
          <ul>
            <li><Link to="/categorie-1">Services 1</Link></li>
            <li><Link to="/categorie-2">Services 2</Link></li>
            <li><Link to="/categorie-3">Services 3</Link></li>
            <li><Link to="/categorie-4">Services 4</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Produits</h3>
          <ul>
            <li><Link to="/categorie-1">Produits 1</Link></li>
            <li><Link to="/categorie-2">Produits 2</Link></li>
            <li><Link to="/categorie-3">Produits 3</Link></li>
            <li><Link to="/categorie-4">Produits 4</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Entreprise</h3>
          <ul>
            <li><Link to="/discover">Découvrir</Link></li>
            <li><Link to="/products">Nos produits</Link></li>
            <li><Link to="/contact">Contact us</Link></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h3>Newsletter</h3>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse mail"
              className={styles.emailInput}
            />
            <button type="submit" className={styles.submitButton}>
              →
            </button>
          </form>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <div className={styles.footerLogo}>
          <img src="/assets/logo.svg" alt="LIFT" />
        </div>
        <div className={styles.footerLinks}>
          <Link to="/cgu">CGU</Link>
          <Link to="/confidentialite">Mentions Légales</Link>
        </div>
        <div className={styles.socialLinks}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
