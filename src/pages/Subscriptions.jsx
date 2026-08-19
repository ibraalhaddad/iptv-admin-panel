import { useEffect, useState } from 'react';
import api from '../api/axios';

function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [hosts, setHosts] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    packageId: '',
    hostId: '',
    startDate: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subRes, userRes, pkgRes, hostRes] = await Promise.all([
        api.get('/api/subscriptions'),
        api.get('/api/users'),
        api.get('/api/packages'),
        api.get('/api/hosts'),
      ]);
      setSubscriptions(subRes.data);
      setUsers(userRes.data);
      setPackages(pkgRes.data);
      setHosts(hostRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/subscriptions', form);
      setForm({ userId: '', packageId: '', hostId: '', startDate: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const renew = async (id) => {
    try {
      await api.put(`/api/subscriptions/${id}/renew`);
      loadData();
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/api/subscriptions/${id}/status`, { status });
      loadData();
    } catch (err) {
      alert('حدث خطأ');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الاشتراكات</h1>
        <p>إدارة اشتراكات المستخدمين وتجديدها</p>
      </div>

      <div className="form-card">
        <h3>إنشاء اشتراك جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <select
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
          >
            <option value="">اختر مستخدم</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.username}</option>
            ))}
          </select>
          <select
            value={form.packageId}
            onChange={(e) => setForm({ ...form, packageId: e.target.value })}
            required
          >
            <option value="">اختر باقة</option>
            {packages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.durationDays} يوم / {p.maxConnections} جهاز)
              </option>
            ))}
          </select>
          <select
            value={form.hostId}
            onChange={(e) => setForm({ ...form, hostId: e.target.value })}
          >
            <option value="">اختر خادم (اختياري)</option>
            {hosts.map((h) => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <button type="submit" className="btn-primary">إنشاء</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>المستخدم</th>
              <th>الباقة</th>
              <th>الخادم</th>
              <th>تاريخ البداية</th>
              <th>تاريخ النهاية</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub._id}>
                <td>{sub.user?.username}</td>
                <td>{sub.package?.name}</td>
                <td>{sub.host?.name || '-'}</td>
                <td>{new Date(sub.startDate).toLocaleDateString()}</td>
                <td>{new Date(sub.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${sub.status}`}>
                    {sub.status === 'active' ? 'نشط' : sub.status === 'expired' ? 'منتهي' : sub.status === 'suspended' ? 'موقوف' : 'ملغي'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-action" onClick={() => renew(sub._id)}>تجديد</button>
                  <button className="btn-action warning" onClick={() => changeStatus(sub._id, 'suspended')}>إيقاف</button>
                  <button className="btn-action success" onClick={() => changeStatus(sub._id, 'active')}>تفعيل</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Subscriptions;