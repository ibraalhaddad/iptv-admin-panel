import { useEffect, useState } from 'react';
import api from '../api/axios';

function Packages() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    durationDays: 30,
    maxConnections: 1,
    type: 'full',
    price: 0,
    currency: 'USD',
    features: '',
    isActive: true,
    sortOrder: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const res = await api.get('/api/packages');
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // تحويل الميزات من سلسلة إلى مصفوفة
      const featuresArray = form.features.split(',').map(f => f.trim()).filter(f => f);
      const payload = { ...form, features: featuresArray };
      await api.post('/api/packages', payload);
      setForm({
        name: '',
        code: '',
        description: '',
        durationDays: 30,
        maxConnections: 1,
        type: 'full',
        price: 0,
        currency: 'USD',
        features: '',
        isActive: true,
        sortOrder: 0
      });
      loadPackages();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('حذف الباقة؟')) {
      try {
        await api.delete(`/api/packages/${id}`);
        loadPackages();
      } catch (err) {
        alert('حدث خطأ');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الباقات</h1>
        <p>إدارة باقات IPTV والمدة وعدد الأجهزة</p>
      </div>

      <div className="form-card">
        <h3>إضافة باقة جديدة</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input type="text" placeholder="اسم الباقة" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="text" placeholder="الكود (اختياري)" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
          <input type="text" placeholder="الوصف" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="number" placeholder="المدة بالأيام" value={form.durationDays} onChange={e => setForm({...form, durationDays: e.target.value})} required />
          <input type="number" placeholder="عدد الأجهزة" value={form.maxConnections} onChange={e => setForm({...form, maxConnections: e.target.value})} required />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="full">كامل</option>
            <option value="live">مباشر</option>
            <option value="vod">فيديو حسب الطلب</option>
            <option value="series">مسلسلات</option>
          </select>
          <input type="number" placeholder="السعر" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <input type="text" placeholder="العملة" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} />
          <input type="text" placeholder="المميزات (افصل بفاصلة)" value={form.features} onChange={e => setForm({...form, features: e.target.value})} />
          <input type="number" placeholder="ترتيب العرض" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: e.target.value})} />
          <label className="checkbox-label">
            <input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
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
              <th>الكود</th>
              <th>المدة</th>
              <th>الأجهزة</th>
              <th>النوع</th>
              <th>السعر</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg._id}>
                <td>{pkg.name}</td>
                <td>{pkg.code || '-'}</td>
                <td>{pkg.durationDays}</td>
                <td>{pkg.maxConnections}</td>
                <td>{pkg.type}</td>
                <td>{pkg.price} {pkg.currency}</td>
                <td>
                  <span className={`status-badge ${pkg.isActive ? 'active' : 'inactive'}`}>
                    {pkg.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-delete" onClick={() => handleDelete(pkg._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Packages;