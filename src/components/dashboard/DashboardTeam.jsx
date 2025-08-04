import React, { useState, useEffect } from 'react';
import { fetchTeam, updateTeamMember, addTeamMember, deleteTeamMember } from '../../api/team';
import styles from '../../styles/components/dashboard/DashboardTeam.module.css';
import AddTeamMemberModal from '../modals/AddTeamModal';
import EditTeamModal from '../modals/EditTeamModal';

export default function TeamEditor() {
  const [members, setMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchTeam().then(setMembers).catch(console.error);
  }, []);

  const handleChange = (id, field, value) => {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleOpenEdit = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };
  const handleCloseEdit = () => {
    setSelectedMember(null);
    setShowEditModal(false);
  };
  const handleSaveEdit = async (updatedMember) => {
    await updateTeamMember(updatedMember.id, updatedMember);
    setMembers(ms => ms.map(m => m.id === updatedMember.id ? updatedMember : m));
    handleCloseEdit();
  };

  const handleAdd = () => setShowAddModal(true);
  const handleCloseAdd = () => setShowAddModal(false);
  const handleSaveAdd = async (newMember) => {
    const addedMember = await addTeamMember(newMember);
    setMembers(ms => [...ms, addedMember]);
    setShowAddModal(false);
  };

  const handleDelete = async (id) => {
    await deleteTeamMember(id);
    setMembers(ms => ms.filter(m => m.id !== id));
  };

  return (
    <div className={styles.editorContainer}>
      <h2>Éditeur de l’équipe</h2>
      <button className={styles.addButton} onClick={handleAdd}>Ajouter un membre</button>
      {members.map(m => (
        <div key={m.id} className={styles.card}>
          <input
            type="text"
            value={m.name}
            onChange={e => handleChange(m.id, 'name', e.target.value)}
          />
          <input
            type="text"
            value={m.role}
            onChange={e => handleChange(m.id, 'role', e.target.value)}
          />
          <input
            type="text"
            value={m.avatar}
            onChange={e => handleChange(m.id, 'avatar', e.target.value)}
          />
          <textarea
            value={m.description}
            onChange={e => handleChange(m.id, 'description', e.target.value)}
          />
      <button className={styles.editBtn} onClick={() => { setSelectedMember(m); setShowEditModal(true); }}>Modifier</button>
      <button className={styles.deleteBtn} onClick={() => handleDelete(m.id)}>Supprimer</button>
        </div>
      ))}
      <AddTeamMemberModal
        isOpen={showAddModal}
        onClose={handleCloseAdd}
        onSave={handleSaveAdd}
      />
      <EditTeamModal
        isOpen={showEditModal}
        member={selectedMember}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
}