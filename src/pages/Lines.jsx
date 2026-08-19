import { useEffect, useState } from 'react';
import api from '../api/axios';

function Lines() {
  const [lines, setLines] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    username: '',
    password: '',
    packageId: '',
    startDate: '',
    maxConnections: '',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [linesRes, pkgsRes] = await Promise.all([
        api.get('/api/lines'),
        api.get('/api/packages')
      ]);
      setLines(linesRes.data);
      setPackages(pkgsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/lines', form);
      setForm({ username: '', password: '', packageId: '', startDate: '', maxConnections: '', notes: '' });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const renew = async (id) => {
    try {
      await api.put(`/api/lines/${id}/renew`);
      loadData();
    } catch (err) { alert('خطأ'); }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/api/lines/${id}/status`, { status });
      loadData();
    } catch (err) { alert('خطأ'); }
  };

  const deleteLine = async (id) => {
    if (confirm('حذف الخط؟')) {
      try {
        await api.delete(`/api/lines/${id}`);
        loadData();
      } catch (err) { alert('خطأ'); }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>خطوط IPTV</h1>
        <p>إدارة خطوط العملاء</p>
      </div>

      <div className="form-card">
        <h3>إنشاء خط جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input type="text" placeholder="اسم المستخدم للخط" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="password" placeholder="كلمة المرور للخط" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <select value={form.packageId} onChange={e => setForm({...form, packageId: e.target.value})} required>
            <option value="">اختر باقة</option>
            {packages.map(p => (
              <option key={p._id} value={p._id}>{p.name} ({p.durationDays} يوم / {p.maxConnections} جهاز)</option>
            ))}
          </select>
          <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          <input type="number" placeholder="عدد الأجهزة" value={form.maxConnections} onChange={e => setForm({...form, maxConnections: e.target.value})} />
          <input type="text" placeholder="ملاحظات" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          <button type="submit" className="btn-primary">إنشاء</button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>اسم المستخدم</th>
              <th>كلمة المرور</th>
              <th>الباقة</th>
              <th>البداية</th>
              <th>النهاية</th>
              <th>الأجهزة</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {lines.map(line => (
              <tr key={line._id}>
                <td>{line.username}</td>
                <td>{line.password}</td>
                <td>{line.package?.name}</td>
                <td>{new Date(line.startDate).toLocaleDateString()}</td>
                <td>{new Date(line.endDate).toLocaleDateString()}</td>
                <td>{line.maxConnections}</td>
                <td><span className={`status-badge ${line.status}`}>{line.status}</span></td>
                <td className="action-buttons">
                  <button className="btn-action" onClick={() => renew(line._id)}>تجديد</button>
                  <button className="btn-action warning" onClick={() => changeStatus(line._id, 'suspended')}>إيقاف</button>
                  <button className="btn-action success" onClick={() => changeStatus(line._id, 'active')}>تفعيل</button>
                  <button className="btn-delete" onClick={() => deleteLine(line._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Lines;