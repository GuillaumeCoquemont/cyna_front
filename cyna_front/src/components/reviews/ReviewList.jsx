import React, { useState } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import styles from '../../styles/components/reviews/ReviewList.module.css';
import { deleteReview } from '../../api/reviews';

const ReviewList = ({ reviews, currentUserId, onReviewDeleted, onEditReview }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      return;
    }

    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);
      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'avis');
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? styles.starFilled : styles.starEmpty}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aucun avis pour le moment. Soyez le premier à laisser un avis !</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewList}>
      {reviews.map((review) => (
        <div key={review.id} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.userInfo}>
              <strong className={styles.userName}>
                {review.userName || 
                 (review.userProfile?.user?.name) ||
                 `${review.userProfile?.firstName || ''} ${review.userProfile?.lastName || ''}`.trim() ||
                 'Utilisateur anonyme'
                }
              </strong>
              <div className={styles.rating}>
                {renderStars(review.rating)}
                <span className={styles.ratingNumber}>({review.rating}/5)</span>
              </div>
            </div>
            
            <div className={styles.reviewMeta}>
              <span className={styles.date}>
                {formatDate(review.reviewDate || review.createdAt)}
              </span>
              
              {currentUserId && review.user_profile_id === currentUserId && (
                <div className={styles.actions}>
                  <button
                    onClick={() => onEditReview && onEditReview(review)}
                    className={styles.editButton}
                    title="Modifier"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className={styles.deleteButton}
                    disabled={deletingId === review.id}
                    title="Supprimer"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className={styles.reviewContent}>
            <p>{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 