import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/ProductsPage.module.css';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api/products';



const ProductsPage = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedType, setSelectedType] = useState('');  // 'Produit' or 'Service'
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(data => setAllProducts(data))
      .catch(err => {
        console.error('Erreur fetchProducts:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des produits…</p>;
  if (error) return <p>Erreur : {error}</p>;

  const priceRanges = [
    { id: '20-50', label: '$20.00 - $50.00' },
    { id: '50-100', label: '$50.00 - $100.00' },
    { id: '100-200', label: '$100.00 - $200.00' },
    { id: '200-500', label: '$200.00 - $500.00' }
  ];

  // derive unique categories
  const categories = Array.from(
    new Set(allProducts.map(p => p.category))
  ).map(cat => ({ id: cat, name: cat }));

  // Filtrage selon la requête de recherche, type, et catégories sélectionnées
  const filteredProducts = allProducts
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                    <img src={product.image} alt={product.name} className={styles.productImageTag} />
                  </div>
                  <div className={styles.productInfo}>
                    <h3 className={styles.productTitle}>{product.name}</h3>
                    <p className={styles.productDescription}>{product.description}</p>
                    <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                    <button
                      className={styles.addToCartButton}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({ 
                          id: product.id,
                          name: product.name, 
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