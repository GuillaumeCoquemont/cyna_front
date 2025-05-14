import React, { useState } from 'react';
import styles from '../../styles/components/checkout/ShippingForm.module.css';

export default function ShippingForm() {
  const [activeTab, setActiveTab] = useState('shipping');
  const [shippingForm, setShippingForm] = useState({
    shipping_prenom: '',
    shipping_nom: '',
    shipping_adresse: '',
    shipping_ville: '',
    shipping_code_postal: '',
  });
  const [billingForm, setBillingForm] = useState({
    billing_prenom: '',
    billing_nom: '',
    billing_adresse: '',
    billing_ville: '',
    billing_code_postal: '',
    billing_pays: '',
    billing_telephone: '',
    billing_email: '',
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={activeTab === 'shipping' ? styles.activeTab : ''}
          onClick={() => setActiveTab('shipping')}
        >
          Adresse de livraison
        </button>
        <button
          type="button"
          className={activeTab === 'billing' ? styles.activeTab : ''}
          onClick={() => setActiveTab('billing')}
        >
          Adresse de facturation
        </button>
      </div>
      <h2>{activeTab === 'shipping' ? 'Adresse de livraison' : 'Adresse de facturation'}</h2>
      <div>
        {activeTab === 'shipping' && (
          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="shipping_prenom">Prénom</label>
              <input
                id="shipping_prenom"
                name="shipping_prenom"
                value={shippingForm.shipping_prenom}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="shipping_nom">Nom</label>
              <input
                id="shipping_nom"
                name="shipping_nom"
                value={shippingForm.shipping_nom}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="shipping_adresse">Adresse</label>
              <input
                id="shipping_adresse"
                name="shipping_adresse"
                value={shippingForm.shipping_adresse}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="shipping_ville">Ville</label>
              <input
                id="shipping_ville"
                name="shipping_ville"
                value={shippingForm.shipping_ville}
                onChange={handleShippingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="shipping_code_postal">Code postal</label>
              <input
                id="shipping_code_postal"
                name="shipping_code_postal"
                value={shippingForm.shipping_code_postal}
                onChange={handleShippingChange}
                required
              />
            </div>
          </form>
        )}
        {activeTab === 'billing' && (
          <form className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="billing_prenom">Prénom</label>
              <input
                id="billing_prenom"
                name="billing_prenom"
                value={billingForm.billing_prenom}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_nom">Nom</label>
              <input
                id="billing_nom"
                name="billing_nom"
                value={billingForm.billing_nom}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_adresse">Adresse</label>
              <input
                id="billing_adresse"
                name="billing_adresse"
                value={billingForm.billing_adresse}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_ville">Ville</label>
              <input
                id="billing_ville"
                name="billing_ville"
                value={billingForm.billing_ville}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_code_postal">Code postal</label>
              <input
                id="billing_code_postal"
                name="billing_code_postal"
                value={billingForm.billing_code_postal}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_pays">Pays</label>
              <input
                id="billing_pays"
                name="billing_pays"
                value={billingForm.billing_pays}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_telephone">Téléphone</label>
              <input
                id="billing_telephone"
                name="billing_telephone"
                value={billingForm.billing_telephone}
                onChange={handleBillingChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="billing_email">Email</label>
              <input
                id="billing_email"
                name="billing_email"
                type="email"
                value={billingForm.billing_email}
                onChange={handleBillingChange}
                required
              />
            </div>
          </form>
        )}
      </div>
      <button
        type="button"
        className={styles.nextStep}
        onClick={() => {/* handle next step here */}}
      >
        Étape de paiement
      </button>
    </div>
  );
}