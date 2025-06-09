import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartDropdown from "./CartDropDown";
import styles from "../../styles/components/Header/Header.module.css";
import logo from '../../assets/images/logo.png';

const Header = () => {
  const { totalItems } = useCart();
  const { user, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toggleCart = () => setIsCartOpen(o => !o);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

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

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Annuler la recherche précédente si elle existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Attendre 300ms après la dernière frappe avant de lancer la recherche
    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleResultClick = (item) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchVisible(false);
    navigate(`/${item.type === 'product' ? 'products' : 'services'}/${item.id}`);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
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
              <li><Link to="/" onClick={handleLinkClick}>Accueil</Link></li>
              <li>
                <Link to="/products" onClick={handleLinkClick}>Produits</Link>
              </li>
              <li><Link to="/discover" onClick={handleLinkClick}>Découvrir</Link></li>
              <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
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
          {user ? (
            <>
              <Link to={getDashboardPath()} onClick={handleLinkClick} aria-label="Dashboard">
                <i className="fas fa-tachometer-alt"></i>
              </Link>
              <Link to="/auth" onClick={handleLinkClick} aria-label="Profil">
                <i className="fas fa-user"></i>
              </Link>
            </>
          ) : (
          <Link to="/auth" onClick={handleLinkClick} aria-label="Connexion">
            <i className="fas fa-user"></i>
          </Link>
          )}
          <div className={styles.cartLink} onClick={toggleCart} aria-label="Panier">
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </div>
          {isCartOpen && <CartDropdown />}
        </div>

        <div className={`${styles.searchBarContainer} ${isSearchVisible ? styles.visible : ''}`}>
          <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchBar}
              placeholder="Rechercher des produits ou services..."
              value={searchQuery}
              onChange={handleSearchChange}
              ref={searchRef}
            />
            {isLoading && (
              <div className={styles.searchLoading}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            )}
            {searchResults && (
              <div className={styles.searchResults}>
                {searchResults.products && searchResults.products.map((product) => (
                  <div
                    key={`product-${product.id}`}
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(product)}
                  >
                    <div className={styles.resultImage}>
                      {product.image ? (
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <i className="fas fa-box"></i>
                        </div>
                      )}
                    </div>
                    <div className={styles.resultInfo}>
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <span className={styles.price}>{product.price}€</span>
                    </div>
                  </div>
                ))}
                {searchResults.services && searchResults.services.map((service) => (
                  <div
                    key={`service-${service.id}`}
                    className={styles.searchResultItem}
                    onClick={() => handleResultClick(service)}
                  >
                    <div className={styles.resultImage}>
                      {service.image ? (
                        <img src={service.image} alt={service.name} />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <i className="fas fa-cogs"></i>
                        </div>
                      )}
                    </div>
                    <div className={styles.resultInfo}>
                      <h4>{service.name}</h4>
                      <p>{service.description}</p>
                      <span className={styles.price}>{service.price}€</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
