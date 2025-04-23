import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/components/Header/Header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen && menuRef.current) {
      const menuHeight = menuRef.current.offsetHeight;
      document.documentElement.style.setProperty('--menu-height', `${menuHeight}px`);
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      document.documentElement.style.setProperty('--menu-height', '0px');
    }
    
    return () => {
      document.body.classList.remove('menu-open');
      document.documentElement.style.setProperty('--menu-height', '0px');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isDropdownOpen) setIsDropdownOpen(false);
  };

  const toggleSearchBar = (e) => {
    e.preventDefault();
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Logo</div>
        <button
          className={styles.hamburgerButton}
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <span className={styles.hamburgerIcon}></span>
        </button>
        
        <div ref={menuRef} className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <div className={styles.menuContent}>
            <ul className={styles.navLinks}>
              <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
              <li>
                <Link to="/products" onClick={handleLinkClick}>Produits</Link>
              </li>
              <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
              <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard Admin</Link></li>
            </ul>

            {isMobile && (
              <div className={styles.mobileFooterLinks}>
                <div className={styles.divider}></div>
                <ul>
                  <li><Link to="/mentions-legales" onClick={handleLinkClick}>Mentions légales</Link></li>
                  <li><Link to="/cgu" onClick={handleLinkClick}>CGU</Link></li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className={styles.icons}>
          <a href="#" onClick={toggleSearchBar} aria-label="Recherche">
            <i className="fas fa-search"></i>
          </a>
          <a href="#login" aria-label="Connexion">
            <i className="fas fa-user"></i>
          </a>
          <a href="#cart" aria-label="Panier">
            <i className="fas fa-shopping-cart"></i>
          </a>
        </div>

        <div className={`${styles.searchBarContainer} ${isSearchVisible ? styles.visible : ''}`}>
          <input
            type="text"
            className={styles.searchBar}
            placeholder="Rechercher..."
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
