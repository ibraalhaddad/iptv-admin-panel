import { useEffect, useState } from 'react';
import api from '../api/axios';

function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 1,
    validFrom: '',
    validUntil: '',
    isActive: true
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const res = await api.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/coupons', form);
      setForm({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        maxUses: 1,
        validFrom: '',
        validUntil: '',
        isActive: true
      });
      loadCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('حذف الكوبون؟')) {
      try {
        await api.delete(`/api/coupons/${id}`);
        loadCoupons();
      } catch (err) {
        alert('خطأ في الحذف');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الكوبونات</h1>
        <p>إدارة كوبونات الخصم</p>
      </div>

      <div className="form-card">
        <h3>إنشاء كوبون جديد</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="كود الكوبون"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
          >
            <option value="percentage">نسبة مئوية</option>
            <option value="fixed">مبلغ ثابت</option>
          </select>
          <input
            type="number"
            placeholder="القيمة"
            value={form.discountValue}
            onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="عدد الاستخدامات"
            value={form.maxUses}
            onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.validFrom}
            onChange={(e) => setForm({ ...form, validFrom: e.target.value })}
          />
          <input
            type="date"
            value={form.validUntil}
            onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
            required
          />
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
              <th>الكود</th>
              <th>النوع</th>
              <th>القيمة</th>
              <th>الاستخدامات</th>
              <th>الصالحية</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discountType === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}</td>
                <td>{coupon.discountValue}</td>
                <td>{coupon.usedCount}/{coupon.maxUses}</td>
                <td>{new Date(coupon.validUntil).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${coupon.isActive ? 'active' : 'inactive'}`}>
                    {coupon.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-delete" onClick={() => handleDelete(coupon._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Coupons;