import React, { useState } from 'react';
import styles from '../styles/pages/ProductsPage.module.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const priceRanges = [
    { id: '20-50', label: '$20.00 - $50.00' },
    { id: '50-100', label: '$50.00 - $100.00' },
    { id: '100-200', label: '$100.00 - $200.00' },
    { id: '200-500', label: '$200.00 - $500.00' }
  ];

  const categories = [
    { id: 'cat1', name: 'Lorem ipsum (3)' },
    { id: 'cat2', name: 'Lorem ipsum (3)' },
    { id: 'cat3', name: 'Lorem ipsum (3)' },
    { id: 'cat4', name: 'Lorem ipsum (3)' },
    { id: 'cat5', name: 'Lorem ipsum (3)' },
    { id: 'cat6', name: 'Lorem ipsum (3)' }
  ];

  // Liste explicite de produits de cybersécurité
  const allProducts = [
    { id: 1, title: 'Antivirus Pro',           price: 199.99, discount: 15, image: '/path/to/image1.jpg' },
    { id: 2, title: 'Firewall Enterprise',      price: 299.99, discount: 10, image: '/path/to/image2.jpg' },
    { id: 3, title: 'VPN Secure',               price: 149.99, discount: 20, image: '/path/to/image3.jpg' },
    { id: 4, title: 'Vulnerability Scanner',    price: 249.99, discount: 20, image: '/path/to/vulnerability.jpg' },
    { id: 5, title: 'SIEM Analytics',           price: 399.99, discount: 10, image: '/path/to/siem.jpg' },
    { id: 6, title: 'Endpoint Protection',      price: 179.99, discount: 5,  image: '/path/to/endpoint.jpg' },
    { id: 7, title: 'Secure Email Gateway',     price: 129.99, discount: 15, image: '/path/to/email.jpg' },
    { id: 8, title: 'DDoS Mitigation Service',  price: 499.99, discount: 25, image: '/path/to/ddos.jpg' },
    { id: 9, title: 'Threat Intelligence Feed', price: 299.99, discount: 15, image: '/path/to/threat.jpg' },
    { id: 10, title: 'Multi-Factor Auth',       price: 99.99,  discount: 0,  image: '/path/to/mfa.jpg' },
  ];

  // Filtrage selon la requête de recherche
  const filteredProducts = allProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 6, allProducts.length));
      setIsLoading(false);
    }, 500);
  };

  const displayedProducts = filteredProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < filteredProducts.length;

  return (
    <div className={styles.productsPage}>
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Categories</h2>
            <div className={styles.categoryList}>
              {categories.map((category) => (
                <div key={category.id} className={styles.categoryItem}>
                  <button className={styles.categoryButton}>
                    {category.name}
                    <span className={styles.arrow}>›</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Price Range</h2>
            <div className={styles.priceRangeList}>
              {priceRanges.map((range) => (
                <label key={range.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedPriceRange === range.id}
                    onChange={() =>
                      setSelectedPriceRange(prev => prev === range.id ? '' : range.id)
                    }
                  />
                  <span className={styles.checkboxText}>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Catégorie</h2>
            <div className={styles.categoryCheckboxList}>
              {categories.map(category => (
                <label key={category.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => {
                      setSelectedCategories(prev =>
                        prev.includes(category.id)
                          ? prev.filter(id => id !== category.id)
                          : [...prev, category.id]
                      );
                    }}
                  />
                  <span className={styles.checkboxText}>{category.name}</span>
                </label>
              ))}
            </div>
          </div>


          <button
            className={styles.searchButton}
            onClick={() => setVisibleProducts(filteredProducts.length > 6 ? 6 : filteredProducts.length)}
          >
            Rechercher
          </button>

        </aside>

        <section className={styles.productSection}>
          <h1 className={styles.pageTitle}>Nos produits</h1>
          
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Rechercher par nom ou desc"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.mainSearchInput}
            />
            <button className={styles.searchButton}>
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className={styles.productsGrid}>
            {displayedProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.discount && (
                    <span className={styles.saleTag}>-{product.discount}%</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                  <button className={styles.addToCartButton}>
                    <i className="fas fa-shopping-cart"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <p className={styles.showingText}>
              Showing 1–{visibleProducts} of {allProducts.length} item(s)
            </p>
            {hasMoreProducts && (
              <button 
                className={`${styles.loadMoreButton} ${isLoading ? styles.loading : ''}`}
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Load More'}
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsPage; 