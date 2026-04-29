import { useState, useEffect } from 'react';
import api from '../../api';
import './Notifications.css';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {}
  };

  const typeIcons = {
    info: '📘',
    success: '✅',
    error: '❌',
    warning: '⚠️',
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifs-page">
      <div className="container">
        <div className="notifs-header animate-fade-in-up">
          <div>
            <h1 className="notifs-title">🔔 Notifications</h1>
            <p className="notifs-subtitle">
              {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Toutes lues'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-secondary btn-sm">
              Tout marquer comme lu
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="card animate-fade-in-up">
            <div className="dash-empty" style={{ padding: 'var(--space-3xl)' }}>
              <p>🔕 Aucune notification pour le moment</p>
            </div>
          </div>
        ) : (
          <div className="notifs-list animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {notifications.map((n, i) => (
              <div
                key={n.id}
                className={`notif-card card ${!n.is_read ? 'notif-card-unread' : ''}`}
                onClick={() => !n.is_read && markAsRead(n.id)}
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <div className="card-body notif-card-body">
                  <div className="notif-card-icon">{typeIcons[n.type] || '📘'}</div>
                  <div className="notif-card-content">
                    <h3 className="notif-card-title">{n.title}</h3>
                    <p className="notif-card-message">{n.message}</p>
                    <span className="notif-card-time">
                      {new Date(n.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                  {!n.is_read && <div className="notif-card-dot"></div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
