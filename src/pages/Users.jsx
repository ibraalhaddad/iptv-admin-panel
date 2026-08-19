import { useEffect, useState } from 'react';
import api from '../api/axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
    isActive: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/users', form);
      setForm({ username: '', password: '', email: '', role: 'user', isActive: true });
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('حذف المستخدم؟')) {
      try {
        await api.delete(`/api/users/${id}`);
        loadUsers();
      } catch (err) {
        alert('حدث خطأ');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>المستخدمون</h1>
        <p>إدارة المستخدمين وصلاحياتهم</p>
      </div>

      <div className="form-card">
        <h3>إضافة مستخدم جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">مستخدم</option>
            <option value="reseller">موزع</option>
            <option value="admin">مدير</option>
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
              <th>اسم المستخدم</th>
              <th>البريد</th>
              <th>الدور</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email || '-'}</td>
                <td>
                  <span className={`badge role-${u.role}`}>
                    {u.role === 'admin' ? 'مدير' : u.role === 'reseller' ? 'موزع' : 'مستخدم'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                    {u.isActive ? 'نشط' : 'موقوف'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-delete" onClick={() => handleDelete(u._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;