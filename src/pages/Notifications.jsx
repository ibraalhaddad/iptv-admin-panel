import { useEffect, useState } from 'react';
import api from '../api/axios';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    isActive: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/notifications', form);
      setForm({ title: '', message: '', type: 'info', isActive: true });
      loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('حذف الإشعار؟')) {
      try {
        await api.delete(`/api/notifications/${id}`);
        loadNotifications();
      } catch (err) {
        alert('خطأ في الحذف');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الإشعارات</h1>
        <p>إدارة الإشعارات العامة لتطبيق المستخدم</p>
      </div>

      <div className="form-card">
        <h3>إنشاء إشعار جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="عنوان الإشعار"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="الرسالة"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows="3"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="info">معلومات</option>
            <option value="warning">تحذير</option>
            <option value="maintenance">صيانة</option>
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span>نشط</span>
          </label>
          <button type="submit" className="btn-primary">إضافة</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>العنوان</th>
              <th>الرسالة</th>
              <th>النوع</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notif) => (
              <tr key={notif._id}>
                <td>{notif.title}</td>
                <td>{notif.message}</td>
                <td>{notif.type}</td>
                <td>
                  <span className={`status-badge ${notif.isActive ? 'active' : 'inactive'}`}>
                    {notif.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td>{new Date(notif.createdAt).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <button className="btn-delete" onClick={() => handleDelete(notif._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notifications;