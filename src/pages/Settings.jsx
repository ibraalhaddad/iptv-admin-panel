import { useEffect, useState } from 'react';
import api from '../api/axios';

function Settings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/api/settings');
      setSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await api.put('/api/settings', settings);
      setMessage('تم حفظ الإعدادات بنجاح');
    } catch (err) {
      setMessage('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>الإعدادات</h1>
        <p>تخصيص إعدادات التطبيق وبيانات السيرفر</p>
      </div>

      <div className="form-card settings-card">
        <h3>إعدادات عامة</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>اسم التطبيق</label>
            <input type="text" value={settings.appName || ''} onChange={e => handleChange('appName', e.target.value)} placeholder="أدخل اسم التطبيق" />
          </div>
          <div className="setting-row">
            <label>رسالة ترحيبية</label>
            <textarea value={settings.welcomeMessage || ''} onChange={e => handleChange('welcomeMessage', e.target.value)} placeholder="رسالة تظهر للمستخدمين" rows="3" />
          </div>

          <h3 style={{ marginTop: '20px' }}>بيانات السيرفر (اشتراكك لدى المزود)</h3>
          <div className="setting-row">
            <label>رابط السيرفر</label>
            <input type="text" value={settings.reseller_host_url || ''} onChange={e => handleChange('reseller_host_url', e.target.value)} placeholder="مثال: http://provider.com:8080" />
          </div>
          <div className="setting-row">
            <label>اسم المستخدم (الموزع)</label>
            <input type="text" value={settings.reseller_username || ''} onChange={e => handleChange('reseller_username', e.target.value)} placeholder="اسم المستخدم الخاص بك" />
          </div>
          <div className="setting-row">
            <label>كلمة المرور</label>
            <input type="password" value={settings.reseller_password || ''} onChange={e => handleChange('reseller_password', e.target.value)} placeholder="كلمة مرور الموزع" />
          </div>

          <button className="btn-primary save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
          {message && <div className="success-message">{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Settings;