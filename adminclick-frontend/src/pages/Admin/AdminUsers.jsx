import { useState, useEffect } from 'react';
import api from '../../api';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchUsers = (page = 1) => {
    setLoading(true);
    api.get(`/admin/users?page=${page}`)
      .then(res => {
        const data = res.data;
        setUsers(data.data || data);
        setCurrentPage(data.current_page || 1);
        setLastPage(data.last_page || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && users.length === 0) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header animate-fade-in-up">
          <div>
            <h1 className="admin-title">👥 Utilisateurs</h1>
            <p className="admin-subtitle">Liste de tous les utilisateurs inscrits</p>
          </div>
        </div>

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Demandes</th>
                    <th>Inscrit le</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td><strong>#{u.id}</strong></td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-processing'}`}>
                          {u.role === 'admin' ? '👑 Admin' : '🧑 Citoyen'}
                        </span>
                      </td>
                      <td>{u.demandes_count || 0}</td>
                      <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {lastPage > 1 && (
          <div className="pagination animate-fade-in-up">
            <button className="btn btn-sm btn-secondary" disabled={currentPage <= 1} onClick={() => fetchUsers(currentPage - 1)}>← Précédent</button>
            <span className="pagination-info">Page {currentPage} sur {lastPage}</span>
            <button className="btn btn-sm btn-secondary" disabled={currentPage >= lastPage} onClick={() => fetchUsers(currentPage + 1)}>Suivant →</button>
          </div>
        )}
      </div>
    </div>
  );
}
