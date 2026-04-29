import { useState } from 'react';
import api from '../../api';

export default function AdminCreate() {
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await api.post('/admin/create-admin', form);
      setMessage(res.data.message);
      setForm({ name: '', email: '', password: '', password_confirmation: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>➕ Créer un administrateur</h2>
        
        {message && <div className="admin-message success">{message}</div>}
        {error && <div className="admin-message error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input 
              type="text" 
              className="form-input" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={form.email} 
              onChange={e => setForm({...form, email: e.target.value})}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-input" 
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})}
              required 
              minLength={8}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="form-input" 
              value={form.password_confirmation} 
              onChange={e => setForm({...form, password_confirmation: e.target.value})}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner" style={{width:20,height:20,borderWidth:2}}></span> : 'Créer l\'administrateur'}
          </button>
        </form>
      </div>
    </div>
  );
}