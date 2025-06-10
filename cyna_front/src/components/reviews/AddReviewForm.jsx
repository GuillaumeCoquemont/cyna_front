import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import styles from '../../styles/components/reviews/AddReviewForm.module.css';
import { createReview } from '../../api/reviews';

const AddReviewForm = ({ productId, serviceId, onReviewAdded, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Le commentaire doit contenir au moins 10 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        rating,
        comment: comment.trim(),
        product_id: productId || null,
        service_id: serviceId || null
      };

      const newReview = await createReview(reviewData);
      
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }

      // Réinitialiser le formulaire
      setRating(0);
      setComment('');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <FaStar
          key={index}
          className={`${styles.star} ${
            starValue <= (hoverRating || rating) ? styles.filled : styles.empty
          }`}
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
        />
      );
    });
  };

  return (
    <div className={styles.addReviewForm}>
      <h3>Laisser un avis</h3>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.ratingSection}>
          <label>Note :</label>
          <div className={styles.starsContainer}>
            {renderStars()}
            <span className={styles.ratingText}>
              {rating > 0 && `${rating}/5`}
            </span>
          </div>
        </div>

        <div className={styles.commentSection}>
          <label htmlFor="comment">Commentaire :</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce produit/service..."
            rows={4}
            maxLength={500}
            className={styles.commentInput}
          />
          <div className={styles.charCount}>
            {comment.length}/500 caractères
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || rating === 0 || comment.trim().length < 10}
          >
            {loading ? 'Envoi...' : 'Publier l\'avis'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewForm; 