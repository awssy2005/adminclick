import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api';
import './NotificationBell.css';

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

export default function NotificationBell() {
  const { t } = useLanguage();
  const [open, setOpen]             = useState(false);
  const [notifs, setNotifs]         = useState([]);
  const [count, setCount]           = useState(0);
  const [loading, setLoading]       = useState(false);
  const panelRef                    = useRef(null);

  // ── Fetch unread count (lightweight) ──
  const refreshCount = () => {
    api.get('/notifications/unread-count')
      .then(r => setCount(r.data.count ?? 0))
      .catch(() => {});
  };

  // ── Fetch full list when panel opens ──
  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
      setNotifs(list.slice(0, 15));
      setCount(list.filter(n => !n.is_read).length);
    } catch {
      /* silently ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCount();
    const iv = setInterval(refreshCount, 60_000); // poll every minute
    return () => clearInterval(iv);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (!open) fetchNotifs();
  };

  // ── Click-outside close ──
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Mark as read ──
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setCount(prev => Math.max(0, prev - 1));
    } catch {/* ignore */}
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
      setCount(0);
    } catch {/* ignore */}
  };

  return (
    <div className="nbell-wrap" ref={panelRef}>
      {/* ── Bell button ── */}
      <button
        id="notif-bell-btn"
        className={`nbell-btn ${open ? 'active' : ''}`}
        onClick={handleOpen}
        aria-label={t('الإشعارات', 'Notifications')}
      >
        <span className="nbell-icon">🔔</span>
        {count > 0 && (
          <span className="nbell-badge" key={count}>{count > 99 ? '99+' : count}</span>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div className="nbell-panel animate-scale-up">
          <div className="nbell-header">
            <h4>{t('الإشعارات', 'Notifications')}</h4>
            {count > 0 && (
              <button className="nbell-mark-all" onClick={markAllRead}>
                {t('تحديد الكل كمقروء', 'Tout marquer lu')}
              </button>
            )}
          </div>

          <div className="nbell-list">
            {loading ? (
              <div className="nbell-loading"><span className="nbell-spinner" /></div>
            ) : notifs.length === 0 ? (
              <div className="nbell-empty">
                <span>🎉</span>
                <p>{t('لا توجد إشعارات', 'Aucune notification')}</p>
              </div>
            ) : (
              notifs.map(n => (
                <div
                  key={n.id}
                  className={`nbell-item ${!n.is_read ? 'unread' : ''}`}
                  onClick={() => !n.is_read && markRead(n.id)}
                >
                  {!n.is_read && <span className="nbell-dot" />}
                  <div className="nbell-content">
                    <p className="nbell-title">{n.title}</p>
                    <p className="nbell-msg">{n.message}</p>
                    <span className="nbell-date">{fmtDate(n.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="nbell-footer">
            <Link to="/notifications" onClick={() => setOpen(false)}>
              {t('عرض كل الإشعارات', 'Voir toutes les notifications')} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
