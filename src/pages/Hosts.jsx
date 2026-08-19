import { useEffect, useState } from 'react';
import api from '../api/axios';

function Hosts() {
  const [hosts, setHosts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
    type: 'xtream',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      const res = await api.get('/api/hosts');
      setHosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/hosts', form);
      setForm({ name: '', url: '', username: '', password: '', type: 'xtream', isActive: true });
      loadHosts();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('حذف الخادم؟')) {
      try {
        await api.delete(`/api/hosts/${id}`);
        loadHosts();
      } catch (err) {
        alert('حدث خطأ');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الخوادم</h1>
        <p>إدارة خوادم IPTV وأنواعها</p>
      </div>

      <div className="form-card">
        <h3>إضافة خادم جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="اسم الخادم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="الرابط"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="xtream">Xtream Codes</option>
            <option value="m3u">M3U</option>
            <option value="other">أخرى</option>
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
              <th>الاسم</th>
              <th>الرابط</th>
              <th>النوع</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((h) => (
              <tr key={h._id}>
                <td>{h.name}</td>
                <td>{h.url}</td>
                <td><span className="badge">{h.type}</span></td>
                <td>
                  <span className={`status-badge ${h.isActive ? 'active' : 'inactive'}`}>
                    {h.isActive ? 'نشط' : 'موقوف'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-delete" onClick={() => handleDelete(h._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Hosts;