import { useEffect, useState } from 'react';
import api from '../api/axios';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'percentage',
    discountValue: 0,
    packageId: '',
    startDate: '',
    endDate: '',
    isActive: true,
    image: null, // سيتم استخدامه عند الإرسال
    imagePreview: '',
    ctaText: 'اشترك الآن',
    ctaLink: '',
    sortOrder: 0
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offersRes, pkgsRes] = await Promise.all([
        api.get('/api/offers'),
        api.get('/api/packages')
      ]);
      setOffers(offersRes.data);
      setPackages(pkgsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('discountValue', form.discountValue);
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      formData.append('isActive', form.isActive);
      formData.append('ctaText', form.ctaText);
      formData.append('ctaLink', form.ctaLink);
      formData.append('sortOrder', form.sortOrder);
      if (form.packageId) formData.append('packageId', form.packageId);
      if (form.image) formData.append('image', form.image);

      if (editingId) {
        await api.put(`/api/offers/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/api/offers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      type: 'percentage',
      discountValue: 0,
      packageId: '',
      startDate: '',
      endDate: '',
      isActive: true,
      image: null,
      imagePreview: '',
      ctaText: 'اشترك الآن',
      ctaLink: '',
      sortOrder: 0
    });
    setEditingId(null);
  };

  const handleEdit = (offer) => {
    setEditingId(offer._id);
    setForm({
      title: offer.title || '',
      description: offer.description || '',
      type: offer.type,
      discountValue: offer.discountValue || 0,
      packageId: offer.package?._id || '',
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      isActive: offer.isActive,
      image: null,
      imagePreview: offer.image || '',
      ctaText: offer.ctaText || 'اشترك الآن',
      ctaLink: offer.ctaLink || '',
      sortOrder: offer.sortOrder || 0
    });
  };

  const handleDelete = async (id) => {
    if (confirm('حذف العرض؟')) {
      try {
        await api.delete(`/api/offers/${id}`);
        loadData();
      } catch (err) {
        alert('خطأ في الحذف');
      }
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>العروض</h1>
        <p>إدارة عروض الأسعار والباقات والبanners</p>
      </div>

      <div className="form-card">
        <h3>{editingId ? 'تعديل عرض' : 'إنشاء عرض جديد'}</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="عنوان العرض"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
          <textarea
            placeholder="الوصف"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows="2"
          />
          <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
            <option value="percentage">خصم نسبة مئوية</option>
            <option value="fixed">خصم مبلغ ثابت</option>
            <option value="free_days">أيام مجانية</option>
            <option value="banner">بانر ترويجي</option>
          </select>
          <input
            type="number"
            placeholder="قيمة الخصم"
            value={form.discountValue}
            onChange={(e) => handleChange('discountValue', e.target.value)}
          />
          <select
            value={form.packageId}
            onChange={(e) => handleChange('packageId', e.target.value)}
          >
            <option value="">كل الباقات</option>
            {packages.map(pkg => (
              <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="نص الزر (CTA)"
            value={form.ctaText}
            onChange={(e) => handleChange('ctaText', e.target.value)}
          />
          <input
            type="text"
            placeholder="رابط الزر (اختياري)"
            value={form.ctaLink}
            onChange={(e) => handleChange('ctaLink', e.target.value)}
          />
          <input
            type="number"
            placeholder="ترتيب العرض"
            value={form.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
            />
            <span>نشط</span>
          </label>
          <div className="file-upload">
            <label>صورة العرض</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {form.imagePreview && (
              <img src={form.imagePreview} alt="preview" style={{ maxHeight: '80px', marginTop: '5px' }} />
            )}
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? 'تحديث' : 'إضافة'}
          </button>
          {editingId && (
            <button type="button" className="btn-action" onClick={resetForm}>إلغاء التعديل</button>
          )}
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>العنوان</th>
              <th>النوع</th>
              <th>القيمة</th>
              <th>الباقة</th>
              <th>البداية</th>
              <th>النهاية</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer._id}>
                <td>
                  {offer.image ? (
                    <img src={offer.image} alt={offer.title} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  ) : '-'}
                </td>
                <td>{offer.title}</td>
                <td>
                  {offer.type === 'percentage' ? 'خصم نسبة' :
                   offer.type === 'fixed' ? 'خصم مبلغ' :
                   offer.type === 'free_days' ? 'أيام مجانية' : 'بانر'}
                </td>
                <td>{offer.discountValue}</td>
                <td>{offer.package?.name || 'كل الباقات'}</td>
                <td>{new Date(offer.startDate).toLocaleDateString()}</td>
                <td>{new Date(offer.endDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${offer.isActive ? 'active' : 'inactive'}`}>
                    {offer.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="action-buttons">
                  <button className="btn-action" onClick={() => handleEdit(offer)}>تعديل</button>
                  <button className="btn-delete" onClick={() => handleDelete(offer._id)}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Offers;