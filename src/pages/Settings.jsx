import { useEffect, useState } from 'react';
import api from '../api/axios';
import { APP_THEMES } from '../constants/themes';

function Settings() {
  const [settings, setSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSplash, setUploadingSplash] = useState(false);

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

  const handleUploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingLogo(true);
    try {
      const res = await api.post('/api/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleChange('user_app_logo', res.data.url);
      setMessage('تم رفع الشعار بنجاح');
    } catch (err) {
      console.error(err);
      setMessage('فشل رفع الشعار');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleUploadSplash = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploadingSplash(true);
    try {
      const res = await api.post('/api/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleChange('user_app_splash_image', res.data.url);
      setMessage('تم رفع صورة البداية بنجاح');
    } catch (err) {
      console.error(err);
      setMessage('فشل رفع صورة البداية');
    } finally {
      setUploadingSplash(false);
    }
  };

  const selectedThemeId = settings.user_app_theme_preset || 'default';
  const selectedTheme = APP_THEMES.find(t => t.id === selectedThemeId) || APP_THEMES[0];

  // الألوان النهائية: إما مخصصة من المدير أو من الثيم
  const finalPrimary = settings.user_app_primary_color || selectedTheme.primaryColor;
  const finalBg = settings.user_app_background_color || selectedTheme.backgroundColor;
  const finalText = settings.user_app_text_color || selectedTheme.textColor;

  return (
    <div className="page">
      <div className="page-header">
        <h1>الإعدادات</h1>
        <p>تخصيص إعدادات التطبيق وبيانات السيرفر</p>
      </div>

      {/* قسم مظهر تطبيق المستخدم */}
      <div className="form-card settings-card">
        <h3>مظهر تطبيق المستخدم</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>اختر الثيم</label>
            <div className="theme-selector">
              {APP_THEMES.map(theme => (
                <div
                  key={theme.id}
                  className={`theme-card ${selectedThemeId === theme.id ? 'active' : ''}`}
                  onClick={() => handleChange('user_app_theme_preset', theme.id)}
                >
                  <img src={theme.imageUrl} alt={theme.name} />
                  <span>{theme.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="setting-row">
            <label>الألوان المخصصة (اختياري – تتجاوز الثيم)</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div>
                <span>اللون الأساسي</span>
                <input
                  type="color"
                  value={settings.user_app_primary_color || finalPrimary}
                  onChange={e => handleChange('user_app_primary_color', e.target.value)}
                />
              </div>
              <div>
                <span>لون الخلفية</span>
                <input
                  type="color"
                  value={settings.user_app_background_color || finalBg}
                  onChange={e => handleChange('user_app_background_color', e.target.value)}
                />
              </div>
              <div>
                <span>لون النص</span>
                <input
                  type="color"
                  value={settings.user_app_text_color || finalText}
                  onChange={e => handleChange('user_app_text_color', e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn-action"
                onClick={() => {
                  handleChange('user_app_primary_color', '');
                  handleChange('user_app_background_color', '');
                  handleChange('user_app_text_color', '');
                }}
              >
                استخدام ألوان الثيم الافتراضية
              </button>
            </div>
          </div>

          <div className="setting-row">
            <label>اسم التطبيق</label>
            <input
              type="text"
              value={settings.user_app_name || ''}
              onChange={e => handleChange('user_app_name', e.target.value)}
              placeholder="مثال: My IPTV"
            />
          </div>

          <div className="setting-row">
            <label>الشعار</label>
            {settings.user_app_logo && (
              <div style={{ marginBottom: '10px' }}>
                <img src={settings.user_app_logo} alt="logo" style={{ maxHeight: '80px' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleUploadLogo} disabled={uploadingLogo} />
            {uploadingLogo && <span>جاري الرفع...</span>}
            {settings.user_app_logo && (
              <button type="button" className="btn-action" onClick={() => handleChange('user_app_logo', '')}>
                إزالة الشعار
              </button>
            )}
          </div>

          <div className="setting-row">
            <label>رسالة ترحيبية</label>
            <textarea
              value={settings.user_app_welcome_message || ''}
              onChange={e => handleChange('user_app_welcome_message', e.target.value)}
              placeholder="مرحباً بك في تطبيقنا"
              rows="3"
            />
          </div>

          <div className="setting-row">
            <label>اللغة الافتراضية</label>
            <select
              value={settings.user_app_language || 'ar'}
              onChange={e => handleChange('user_app_language', e.target.value)}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>

      {/* قسم شاشة البداية */}
      <div className="form-card settings-card">
        <h3>شاشة البداية (Splash Screen)</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>صورة شاشة البداية</label>
            {settings.user_app_splash_image && (
              <div style={{ marginBottom: '10px' }}>
                <img src={settings.user_app_splash_image} alt="splash" style={{ maxHeight: '80px' }} />
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleUploadSplash} disabled={uploadingSplash} />
            {uploadingSplash && <span>جاري الرفع...</span>}
            {settings.user_app_splash_image && (
              <button type="button" className="btn-action" onClick={() => handleChange('user_app_splash_image', '')}>
                إزالة الصورة
              </button>
            )}
          </div>
          <div className="setting-row">
            <label>لون خلفية شاشة البداية</label>
            <input
              type="color"
              value={settings.user_app_splash_background || '#ffffff'}
              onChange={e => handleChange('user_app_splash_background', e.target.value)}
            />
          </div>
          <div className="setting-row">
            <label>مدة العرض (ثانية)</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={settings.user_app_splash_duration || '3'}
              onChange={e => handleChange('user_app_splash_duration', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* قسم روابط التواصل الاجتماعي */}
      <div className="form-card settings-card">
        <h3>روابط التواصل الاجتماعي</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>تيليجرام</label>
            <input
              type="text"
              value={settings.user_app_telegram || ''}
              onChange={e => handleChange('user_app_telegram', e.target.value)}
              placeholder="https://t.me/username"
            />
          </div>
          <div className="setting-row">
            <label>واتساب</label>
            <input
              type="text"
              value={settings.user_app_whatsapp || ''}
              onChange={e => handleChange('user_app_whatsapp', e.target.value)}
              placeholder="https://wa.me/123456789"
            />
          </div>
          <div className="setting-row">
            <label>فيسبوك</label>
            <input
              type="text"
              value={settings.user_app_facebook || ''}
              onChange={e => handleChange('user_app_facebook', e.target.value)}
              placeholder="https://facebook.com/page"
            />
          </div>
        </div>
      </div>

      {/* معاينة حية */}
      <div className="form-card settings-card">
        <h3>معاينة تطبيق المستخدم</h3>
        <div
          className="app-preview"
          style={{
            background: finalBg,
            color: finalText,
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #e2e8f0',
            maxWidth: '300px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          {settings.user_app_logo && (
            <img src={settings.user_app_logo} alt="logo" style={{ maxHeight: '50px', marginBottom: '10px' }} />
          )}
          <h3 style={{ color: finalText }}>{settings.user_app_name || 'اسم التطبيق'}</h3>
          <p style={{ color: finalText, marginBottom: '10px' }}>
            {settings.user_app_welcome_message || 'رسالة ترحيبية'}
          </p>
          <button style={{ background: finalPrimary, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' }}>
            زر تجريبي
          </button>
        </div>
      </div>

      {/* قسم إعدادات عامة */}
      <div className="form-card settings-card">
        <h3>إعدادات عامة</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>اسم التطبيق (لوحة التحكم)</label>
            <input
              type="text"
              value={settings.appName || ''}
              onChange={e => handleChange('appName', e.target.value)}
              placeholder="أدخل اسم التطبيق"
            />
          </div>
          <div className="setting-row">
            <label>رسالة ترحيبية (لوحة التحكم)</label>
            <textarea
              value={settings.welcomeMessage || ''}
              onChange={e => handleChange('welcomeMessage', e.target.value)}
              placeholder="رسالة تظهر للمستخدمين"
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* قسم بيانات السيرفر */}
      <div className="form-card settings-card">
        <h3>بيانات السيرفر (اشتراكك لدى المزود)</h3>
        <div className="settings-form">
          <div className="setting-row">
            <label>رابط السيرفر</label>
            <input
              type="text"
              value={settings.reseller_host_url || ''}
              onChange={e => handleChange('reseller_host_url', e.target.value)}
              placeholder="مثال: http://provider.com:8080"
            />
          </div>
          <div className="setting-row">
            <label>اسم المستخدم (الموزع)</label>
            <input
              type="text"
              value={settings.reseller_username || ''}
              onChange={e => handleChange('reseller_username', e.target.value)}
              placeholder="اسم المستخدم الخاص بك"
            />
          </div>
          <div className="setting-row">
            <label>كلمة المرور</label>
            <input
              type="password"
              value={settings.reseller_password || ''}
              onChange={e => handleChange('reseller_password', e.target.value)}
              placeholder="كلمة مرور الموزع"
            />
          </div>
        </div>
      </div>

      <button
        className="btn-primary save-btn"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
      </button>
      {message && <div className={`${message.includes('بنجاح') ? 'success-message' : 'error-message'}`}>{message}</div>}
    </div>
  );
}

export default Settings;