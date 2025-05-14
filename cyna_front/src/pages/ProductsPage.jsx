import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/ProductsPage.module.css';
import { useCart } from '../context/CartContext';


const ProductsPage = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('');  // 'Produit' or 'Service'
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const priceRanges = [
    { id: '20-50', label: '$20.00 - $50.00' },
    { id: '50-100', label: '$50.00 - $100.00' },
    { id: '100-200', label: '$100.00 - $200.00' },
    { id: '200-500', label: '$200.00 - $500.00' }
  ];

  // Liste explicite de produits de cybersécurité avec catégorie ajoutée
  const allProducts = [
    { id: 1, title: 'Antivirus Pro',           price: 199.99, image: '/path/to/image1.jpg', category: 'Antivirus', type: 'Produit', shortDescription: "Brève description du produit." },
    { id: 2, title: 'Firewall Enterprise',      price: 299.99, image: '/path/to/image2.jpg', category: 'Firewall', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 3, title: 'VPN Secure',               price: 149.99, discount: 20, image: '/path/to/image3.jpg', category: 'VPN', type: 'Produit', shortDescription: "Brève description du produit." },
    { id: 4, title: 'Vulnerability Scanner',    price: 249.99, discount: 20, image: '/path/to/vulnerability.jpg', category: 'Scanner', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 5, title: 'SIEM Analytics',           price: 399.99, discount: 10, image: '/path/to/siem.jpg', category: 'SIEM', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 6, title: 'Endpoint Protection',      price: 179.99, image: '/path/to/endpoint.jpg', category: 'Endpoint', type: 'Produit', shortDescription: "Brève description du produit." },
    { id: 7, title: 'Secure Email Gateway',     price: 129.99, discount: 15, image: '/path/to/email.jpg', category: 'Email', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 8, title: 'DDoS Mitigation Service',  price: 499.99, discount: 25, image: '/path/to/ddos.jpg', category: 'DDoS', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 9, title: 'Threat Intelligence Feed', price: 299.99, discount: 15, image: '/path/to/threat.jpg', category: 'Threat Intelligence', type: 'Service', shortDescription: "Brève description du produit." },
    { id: 10, title: 'Multi-Factor Auth',       price: 99.99,  image: '/path/to/mfa.jpg', category: 'Authentication', type: 'Produit', shortDescription: "Brève description du produit." },
  ];

  // derive unique categories
  const categories = Array.from(
    new Set(allProducts.map(p => p.category))
  ).map(cat => ({ id: cat, name: cat }));

  // Filtrage selon la requête de recherche, type, et catégories sélectionnées
  const filteredProducts = allProducts
    .filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product =>
      !selectedType || product.type === selectedType
    )
    .filter(product =>
      selectedCategories.length === 0 || selectedCategories.includes(product.category)
    );

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => Math.min(prev + 6, filteredProducts.length));
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
            <h2 className={styles.filterTitle}>Type</h2>
            <div className={styles.categoryCheckboxList}>
              {['Produit', 'Service'].map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedType === type}
                    onChange={() =>
                      setSelectedType(prev => (prev === type ? '' : type))
                    }
                  />
                  <span className={styles.checkboxText}>{type}</span>
                </label>
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
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => {
                      setSelectedCategories(prev =>
                        prev.includes(category.name)
                          ? prev.filter(cat => cat !== category.name)
                          : [...prev, category.name]
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
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className={styles.productLink}
              >
                <div className={styles.productCard}>
                  <div className={styles.productImage}>
                    {product.discount && (
                      <span className={styles.saleTag}>-{product.discount}%</span>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <p className={styles.productDescription}>{product.shortDescription}</p>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <button
                      className={styles.addToCartButton}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({ 
                          id: product.id,
                          name: product.title, 
                          price: product.price, 
                          image: product.image,
                          // include other fields if needed
                        }, 1);
                      }}
                      aria-label="Ajouter au panier"
                    >
                      <i className="fas fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className={styles.pagination}>
            <p className={styles.showingText}>
              Showing 1–{visibleProducts} of {filteredProducts.length} item(s)
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