import React, { useState, useEffect } from 'react';
import {
  fetchAddressUserProfileLinks,
  addAddressUserProfileLink,
  deleteAddressUserProfileLink
} from '../../api/assoAddressesUserProfiles';
import { fetchAddresses } from '../../api/addresses';
import { fetchUserProfiles } from '../../api/userProfiles';
import styles from '../../styles/components/dashboard/DashboardAdressUserProfileLink.module.css';

export default function DashboardAddressUserProfileLinks() {
  const [links, setLinks] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);
  const [newAddressId, setNewAddressId] = useState('');
  const [newUserProfileId, setNewUserProfileId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) Load existing links
    fetchAddressUserProfileLinks()
      .then(data => setLinks(data))
      .catch(err => console.error('Erreur fetch links:', err));

    // 2) Load addresses for select
    fetchAddresses()
      .then(data => setAddresses(data))
      .catch(err => console.error('Erreur fetch addresses:', err));

    // 3) Load user profiles for select
    fetchUserProfiles()
      .then(data => setUserProfiles(data))
      .catch(err => console.error('Erreur fetch userProfiles:', err));
  }, []);

  const handleAddLink = async e => {
    e.preventDefault();
    setError(null);
    if (!newAddressId || !newUserProfileId) {
      setError('Veuillez sélectionner une adresse et un profil utilisateur.');
      return;
    }
    try {
      await addAddressUserProfileLink(+newAddressId, +newUserProfileId);
      const updated = await fetchAddressUserProfileLinks();
      setLinks(updated);
      setNewAddressId('');
      setNewUserProfileId('');
    } catch (err) {
      console.error('Erreur ajout liaison:', err);
      setError(err.message || 'Impossible d’ajouter cette liaison.');
    }
  };

  const handleDeleteLink = async (addressId, userProfileId) => {
    if (!window.confirm('Confirmez la suppression de cette liaison ?')) return;
    try {
      await deleteAddressUserProfileLink(addressId, userProfileId);
      setLinks(prev =>
        prev.filter(l => !(l.address_id === addressId && l.user_profile_id === userProfileId))
      );
    } catch (err) {
      console.error('Erreur suppression liaison:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Adresses ↔ Profils Utilisateur</h3>

      {/* Table of existing links */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Adresse</th>
            <th>Profil Utilisateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => {
            const addressLabel =
              addresses.find(a => a.id === link.address_id)?.Address1 ||
              `ID : ${link.address_id}`;
            const userProfileLabel =
              userProfiles.find(u => u.id === link.user_profile_id)?.user_id ||
              `ID : ${link.user_profile_id}`;
            return (
              <tr key={`${link.address_id}-${link.user_profile_id}`}>
                <td>{addressLabel} (ID : {link.address_id})</td>
                <td>Profil #{link.user_profile_id}</td>
                <td>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteLink(link.address_id, link.user_profile_id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
          {links.length === 0 && (
            <tr>
              <td colSpan="3">Aucune liaison trouvée.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Form to add new link */}
      <form className={styles.form} onSubmit={handleAddLink}>
        <div className={styles.field}>
          <label>Choisir Adresse</label>
          <select
            value={newAddressId}
            onChange={e => setNewAddressId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {addresses.map(address => (
              <option key={address.id} value={address.id}>
                {address.Address1} (ID : {address.id})
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Choisir Profil Utilisateur</label>
          <select
            value={newUserProfileId}
            onChange={e => setNewUserProfileId(e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            {userProfiles.map(profile => (
              <option key={profile.id} value={profile.id}>
                Profil #{profile.id} (Utilisateur : #{profile.user_id})
              </option>
            ))}
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.saveBtn}>
          Ajouter la liaison
        </button>
      </form>
    </div>
  );
}