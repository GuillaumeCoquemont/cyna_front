import React, { useState } from 'react';
import styles from '../styles/pages/ProductsPage.module.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('20-50');
  const [selectedCategories, setSelectedCategories] = useState(['Catégorie 1']);
  const [availability, setAvailability] = useState('en-stock');
  const [visibleProducts, setVisibleProducts] = useState(6); // Nombre initial de produits affichés
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

  // Simulons une liste de produits (à remplacer par vos vrais produits)
  const allProducts = [
    {
      id: 1,
      title: 'Antivirus Pro',
      price: 199.99,
      discount: 15,
      image: '/path/to/image1.jpg'
    },
    {
      id: 2,
      title: 'Firewall Enterprise',
      price: 299.99,
      discount: 10,
      image: '/path/to/image2.jpg'
    },
    {
      id: 3,
      title: 'VPN Secure',
      price: 149.99,
      discount: 20,
      image: '/path/to/image3.jpg'
    },
    // ... ajoutez plus de produits ici
  ].concat(Array(15).fill(null).map((_, i) => ({
    id: i + 4,
    title: `Produit ${i + 4}`,
    price: 199.99,
    discount: 15,
    image: '/path/to/default.jpg'
  })));

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulons un chargement asynchrone
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 6, allProducts.length));
      setIsLoading(false);
    }, 500);
  };

  const displayedProducts = allProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < allProducts.length;

  return (
    <div className={styles.productsPage}>
      <Header />
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
                    onChange={() => setSelectedPriceRange(range.id)}
                  />
                  <span className={styles.checkboxText}>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Catégorie</h2>
            <div className={styles.categoryCheckboxList}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked />
                <span className={styles.checkboxText}>Catégorie 1</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span className={styles.checkboxText}>Catégorie 2</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span className={styles.checkboxText}>Catégorie 3</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" />
                <span className={styles.checkboxText}>Catégorie 4</span>
              </label>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Disponibilité</h2>
            <div className={styles.availabilityList}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="availability"
                  checked={availability === 'en-stock'}
                  onChange={() => setAvailability('en-stock')}
                />
                <span className={styles.radioText}>En stock</span>
              </label>
            </div>
          </div>

          <button className={styles.searchButton}>
            Rechercher par caractéristique
          </button>

          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Recherche par nom ou desc"
              className={styles.searchInput}
            />
            <button className={styles.searchIconButton}>
              <i className="fas fa-search"></i>
            </button>
          </div>
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
      <Footer />
    </div>
  );
};

export default ProductsPage; 