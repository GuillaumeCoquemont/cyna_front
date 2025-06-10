// src/components/produitDetails/ProductTabs.jsx
import React, { useState, useEffect } from 'react';
import { FaStar, FaPlus } from 'react-icons/fa';
import styles from '../../styles/components/productDetails/ProductTabs.module.css';
import { 
  fetchProductReviews, 
  fetchServiceReviews, 
  fetchProductReviewStats, 
  fetchServiceReviewStats 
} from '../../api/reviews';
import ReviewList from '../reviews/ReviewList';
import AddReviewForm from '../reviews/AddReviewForm';
import { useAuth } from '../../context/AuthContext';

const ProductTabs = ({ product, type = 'product' }) => {
  const [activeTab, setActiveTab] = useState('desc');
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  // Utiliser le contexte d'authentification
  const { user } = useAuth();

  // Déterminer l'ID et le type en fonction des props
  const itemId = product?.id;
  const isService = type === 'service' || product?.type === 'service';

  // Récupérer l'ID de l'utilisateur connecté depuis le contexte
  const currentUserId = user?.user_profile?.id || user?.userProfile?.id || null;
  const isLoggedIn = !!user && !!localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'reviews' && itemId) {
      loadReviews();
      loadReviewStats();
    }
  }, [activeTab, itemId, isService]);

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const reviewsData = isService 
        ? await fetchServiceReviews(itemId)
        : await fetchProductReviews(itemId);
      setReviews(reviewsData || []);
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
      setError('Erreur lors du chargement des avis');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadReviewStats = async () => {
    try {
      const statsData = isService 
        ? await fetchServiceReviewStats(itemId)
        : await fetchProductReviewStats(itemId);
      setReviewStats(statsData);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setShowAddForm(false);
    loadReviewStats(); // Recharger les statistiques
  };

  const handleReviewDeleted = (deletedId) => {
    setReviews(prev => prev.filter(review => review.id !== deletedId));
    loadReviewStats(); // Recharger les statistiques
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const renderReviewsTab = () => {
    if (loading) {
      return <div className={styles.loading}>Chargement des avis...</div>;
    }

    if (error) {
      return <div className={styles.error}>{error}</div>;
    }

    return (
      <div className={styles.reviewsContent}>
        {/* Statistiques des avis */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className={styles.reviewStats}>
            <div className={styles.averageRating}>
              <div className={styles.ratingValue}>
                {renderStars(Math.round(reviewStats.averageRating))}
                <span className={styles.ratingNumber}>
                  {reviewStats.averageRating}/5
                </span>
              </div>
              <div className={styles.totalReviews}>
                Basé sur {reviewStats.totalReviews} avis
              </div>
            </div>

            <div className={styles.ratingDistribution}>
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className={styles.ratingRow}>
                  <span>{star} étoiles</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ 
                        width: `${(reviewStats.ratingDistribution[star] / reviewStats.totalReviews) * 100}%` 
                      }}
                    />
                  </div>
                  <span className={styles.count}>
                    {reviewStats.ratingDistribution[star]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton pour ajouter un avis */}
        {isLoggedIn && !showAddForm && (
          <div className={styles.addReviewSection}>
            <button 
              className={styles.addReviewButton}
              onClick={() => setShowAddForm(true)}
            >
              <FaPlus /> Laisser un avis
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <div className={styles.loginPrompt}>
            <p>Connectez-vous pour laisser un avis</p>
          </div>
        )}

        {/* Formulaire d'ajout d'avis */}
        {showAddForm && (
          <AddReviewForm
            productId={!isService ? itemId : null}
            serviceId={isService ? itemId : null}
            onReviewAdded={handleReviewAdded}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Liste des avis */}
        <ReviewList
          reviews={reviews}
          currentUserId={currentUserId}
          onReviewDeleted={handleReviewDeleted}
          onEditReview={(review) => {
            // TODO: Implémenter la modification d'avis
            console.log('Modifier l\'avis:', review);
          }}
        />
      </div>
    );
  };

  const getReviewsCount = () => {
    return reviewStats?.totalReviews || reviews.length || 0;
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.headers}>
        <button
          className={activeTab === 'desc' ? styles.active : ''}
          onClick={() => setActiveTab('desc')}
        >
          Description
        </button>
        <button
          className={activeTab === 'reviews' ? styles.active : ''}
          onClick={() => setActiveTab('reviews')}
        >
          Avis ({getReviewsCount()})
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'desc' && (
          <div className={styles.description}>
            <p>{product?.longDescription || product?.description}</p>
            {product?.features && product.features.length > 0 && (
              <div className={styles.features}>
                <h4>Caractéristiques :</h4>
                <ul>
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {activeTab === 'reviews' && renderReviewsTab()}
      </div>
    </div>
  );
};

export default ProductTabs;