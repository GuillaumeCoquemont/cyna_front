// This file contains the data for the carrousel elements in the dashboard.
import styles from '../../styles/components/dashboard/DashboardCarrousselElement.module.css';

const carrouselElements = [
    {
        id: 1,
        order: 1,
        image: '/path/to/product1.jpg',
        name: 'Solution Antivirus Pro',
        description: 'Protection avancée contre les malwares',
        characteristic: 'Détection en temps réel',
        price: '£905.00',
        availability: 'En stock'
      },
      {
        id: 2,
        order: 2,
        image: '/path/to/product2.jpg',
        name: 'Firewall Enterprise',
        description: 'Sécurité réseau complète',
        characteristic: 'Protection périmétrique avancée',
        price: '£120.00',
        availability: 'En stock'
      },
      {
        id: 3,
        order: 3,
        image: '/path/to/product3.jpg',
        name: 'Audit de Sécurité',
        description: 'Analyse complète de votre infrastructure',
        characteristic: 'Rapport détaillé et recommandations',
        price: '£150.00',
        availability: 'Sur demande'
      },
      {
        id: 4,
        order: 4,
        image: '/path/to/product4.jpg',
        name: 'VPN Secure Connect',
        description: 'Navigation anonyme et sécurisée',
        characteristic: 'Chiffrement 256-bit',
        price: '£80.00',
        availability: 'En stock'
      },
      {
        id: 5,
        order: 5,
        image: '/path/to/product5.jpg',
        name: 'Gestionnaire de mots de passe',
        description: 'Sécurisez et centralisez vos identifiants',
        characteristic: 'Authentification multi-facteurs',
        price: '£50.00',
        availability: 'En stock'
      },
      {
        id: 6,
        order: 6,
        image: '/path/to/product6.jpg',
        name: 'Formation cybersécurité',
        description: 'Sensibilisation des équipes aux risques',
        characteristic: 'Modules interactifs en ligne',
        price: '£200.00',
        availability: 'Sur demande'
      }
    ];

import React, { useState } from 'react';

export const CarrouselEditor = () => {
  const [elements, setElements] = useState(carrouselElements);

  const handleChange = (id, field, value) => {
    setElements(prevElements =>
      prevElements.map(el => el.id === id ? { ...el, [field]: value } : el)
    );
  };

  const handleSave = (id) => {
    const updatedElement = elements.find(el => el.id === id);
    console.log("Enregistré :", updatedElement);
    // Ici tu pourrais envoyer l'élément à un serveur ou déclencher une autre action
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Éditeur de Carrousel</h2>
      {elements.map(product => (
        <div key={product.id} className={styles.editorCard}>
          {product.image && (
            <div className={styles.imagePreview}>
              <img src={product.image} alt={product.name} />
            </div>
          )}
          <input
            type="text"
            value={product.name}
            onChange={(e) => handleChange(product.id, 'name', e.target.value)}
            placeholder="Nom"
            className={styles.inputField}
          />
          <input
            type="text"
            value={product.description}
            onChange={(e) => handleChange(product.id, 'description', e.target.value)}
            placeholder="Description"
            className={styles.inputField}
          />
          <input
            type="text"
            value={product.characteristic}
            onChange={(e) => handleChange(product.id, 'characteristic', e.target.value)}
            placeholder="Caractéristique"
            className={styles.inputField}
          />
          <input
            type="text"
            value={product.price}
            onChange={(e) => handleChange(product.id, 'price', e.target.value)}
            placeholder="Prix"
            className={styles.inputField}
          />
          <input
            type="text"
            value={product.availability}
            onChange={(e) => handleChange(product.id, 'availability', e.target.value)}
            placeholder="Disponibilité"
            className={styles.inputField}
          />
          <input
            type="number"
            value={product.order}
            onChange={(e) => handleChange(product.id, 'order', e.target.value)}
            placeholder="Ordre d'affichage"
            className={styles.inputField}
          />
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const maxSizeMB = 2; // Limite de 2MB
                const maxSizeBytes = maxSizeMB * 1024 * 1024;
                if (file.size > maxSizeBytes) {
                  alert(`L'image est trop grande. Taille maximale autorisée : ${maxSizeMB}MB.`);
                  return;
                }
                const imageUrl = URL.createObjectURL(file);
                handleChange(product.id, 'image', imageUrl);
              }
            }}
            className={styles.inputField}
          />
          <button onClick={() => handleSave(product.id)} className={styles.saveButton}>Enregistrer</button>
        </div>
      ))}
    </div>
  );
};

export default carrouselElements;