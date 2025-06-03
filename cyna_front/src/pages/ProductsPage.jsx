// src/pages/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/ProductsPage.module.css';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../api/products';
import { fetchServices } from '../api/services';

const ProductsPage = () => {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charge produits + services
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchServices()])
      .then(([products, services]) => {
        // Map services to same shape as products
        const svcNormalized = services.map(s => ({
          id: s.id,
          name: s.name,
          description: s.description,
          price: Number(s.price),
          image: s.image,
          category: s.subscription ? 'Abonnement' : 'Service à la carte',
          type: 'service',
        }));
        const prodNormalized = products.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          image: p.image,
          category: typeof p.category === 'object' && p.category ? p.category.name : (p.category || 'Produit'),
          type: 'product',
        }));
        setAllItems([...prodNormalized, ...svcNormalized]);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement en cours…</p>;
  if (error)   return <p className={styles.error}>Erreur : {error}</p>;

  const priceRanges = [
    { id: '0-50',   label: '€0 - €50' },
    { id: '50-100', label: '€50 - €100' },
    { id: '100-200',label: '€100 - €200' },
    { id: '200-500',label: '€200 - €500' },
  ];

  // catégories dynamiques
  const categories = Array.from(
    new Set(allItems.map(i => i.category))
  );

  const filtered = allItems
    // recherche sur name + description
    .filter(i =>
      (i.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    // filtre catégories
    .filter(i => !selectedCategories.length || selectedCategories.includes(i.category))
    // filtre prix
    .filter(i => {
      if (!selectedPriceRange) return true;
      const [min, max] = selectedPriceRange.split('-').map(Number);
      return i.price >= min && i.price <= max;
    });

  const displayed = filtered.slice(0, visibleItems);
  const hasMore = visibleItems < filtered.length;

  const loadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleItems(v => Math.min(v + 6, filtered.length));
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <div className={styles.productsPage}>
      <main className={styles.main}>
        <aside className={styles.sidebar}>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Catégorie</h2>
            <div className={styles.checkboxList}>
              {categories.map(cat => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() =>
                      setSelectedCategories(prev =>
                        prev.includes(cat)
                          ? prev.filter(c => c !== cat)
                          : [...prev, cat]
                      )
                    }
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h2 className={styles.filterTitle}>Prix</h2>
            <div className={styles.checkboxList}>
              {priceRanges.map(r => (
                <label key={r.id} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedPriceRange === r.id}
                    onChange={() =>
                      setSelectedPriceRange(pr => pr === r.id ? '' : r.id)
                    }
                  />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className={styles.productSection}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.productsGrid}>
            {displayed.map(item => (
              <Link key={`${item.type}-${item.id}`} to={`/${item.type}/${item.id}`}>
                <div className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.productInfo}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className={styles.price}>
                      €{typeof item.price === 'number' ? item.price.toFixed(2) : '—'}
                    </p>
                    <button
                      className={styles.addToCartButton}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image
                        }, 1);
                      }}
                    >
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hasMore && (
            <button
              className={styles.loadMoreButton}
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Chargement…' : 'Voir plus'}
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductsPage;