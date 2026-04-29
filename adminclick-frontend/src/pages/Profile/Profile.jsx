import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      // Simulate password change - you'd add this endpoint
      setMessage('Fonctionnalité en cours de développement.');
    } catch (err) {
      setError('Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header animate-fade-in-up">
          <h1 className="profile-title">👤 Mon profil</h1>
          <p className="profile-subtitle">Gérez vos informations personnelles</p>
        </div>

        <div className="profile-grid">
          {/* User Info Card */}
          <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-body">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {user?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="avatar-info">
                  <h2>{user?.name}</h2>
                  <p>{user?.email}</p>
                  <span className={`badge ${user?.role === 'admin' ? 'badge-admin' : 'badge-processing'}`}>
                    {user?.role === 'admin' ? '👑 Administrateur' : '🧑 Citoyen'}
                  </span>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Nom complet</span>
                  <span className="profile-detail-value">{user?.name}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Email</span>
                  <span className="profile-detail-value">{user?.email}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Rôle</span>
                  <span className="profile-detail-value">{user?.role === 'admin' ? 'Administrateur' : 'Citoyen'}</span>
                </div>
                <div className="profile-detail-row">
                  <span className="profile-detail-label">Membre depuis</span>
                  <span className="profile-detail-value">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-body">
              <h2 className="profile-section-title">🔒 Changer le mot de passe</h2>

              {message && <div className="admin-message success">{message}</div>}
              {error && <div className="admin-message error">{error}</div>}

              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">Mot de passe actuel</label>
                  <input type="password" className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Minimum 6 caractères" required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirmez" required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Mettre à jour'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card profile-danger animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-body">
            <h2 className="profile-section-title">⚠️ Zone de danger</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
              La déconnexion supprimera votre session active.
            </p>
            <button className="btn btn-danger" onClick={logout}>Déconnexion de tous les appareils</button>
          </div>
        </div>
      </div>
    </div>
  );
}
