import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalHosts: 0,
    activeLines: 0,
    expiredLines: 0,
    suspendedLines: 0,
    totalDevices: 0,
    totalRevenue: 0,
  });

  const [serverInfo, setServerInfo] = useState({
    reseller_host_url: '',
    reseller_username: '',
    reseller_password: '',
  });

  // حالة المستخدم الحالي
  const [currentUser, setCurrentUser] = useState({
    username: '',
    role: '',
  });

  useEffect(() => {
    // جلب الإحصائيات
    api.get('/api/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('فشل جلب الإحصائيات', err));

    // جلب معلومات السيرفر
    api.get('/api/settings/reseller-info')
      .then(res => setServerInfo(res.data))
      .catch(err => console.error('فشل جلب معلومات السيرفر', err));

    // جلب بيانات المستخدم الحالي
    api.get('/api/auth/me')
      .then(res => {
        if (res.data && res.data.user) {
          setCurrentUser({
            username: res.data.user.username,
            role: res.data.user.role,
          });
        }
      })
      .catch(err => console.error('فشل جلب بيانات المستخدم', err));
  }, []);

  // دالة التنقل
  const goTo = (path) => {
    navigate(path);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <p>
          مرحباً، <strong>{currentUser.username || 'المدير'}</strong>
          {currentUser.role && <span> ({currentUser.role === 'admin' ? 'مدير' : currentUser.role === 'reseller' ? 'موزع' : 'مستخدم'})</span>}
          {' '} - نظرة عامة على أداء النظام
        </p>
      </div>

      {/* بطاقة السيرفر - قابلة للضغط للذهاب للإعدادات */}
      <div
        className="server-card clickable"
        onClick={() => goTo('/settings')}
        title="الذهاب إلى الإعدادات"
      >
        <h3>سيرفر IPTV الخاص بك</h3>
        <div className="server-details">
          <p><strong>الرابط:</strong> {serverInfo.reseller_host_url || 'غير محدد'}</p>
          <p><strong>اسم المستخدم:</strong> {serverInfo.reseller_username || 'غير محدد'}</p>
          <p><strong>كلمة المرور:</strong> {serverInfo.reseller_password ? '••••••••' : 'غير محددة'}</p>
        </div>
      </div>

      {/* شبكة الإحصائيات مع بطاقات قابلة للضغط */}
      <div className="stats-grid">
        <div className="stat-card users clickable" onClick={() => goTo('/users')}>
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">مستخدمو اللوحة</span>
          </div>
        </div>

        <div className="stat-card packages clickable" onClick={() => goTo('/packages')}>
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalPackages}</span>
            <span className="stat-label">الباقات</span>
          </div>
        </div>

        <div className="stat-card hosts clickable" onClick={() => goTo('/hosts')}>
          <div className="stat-icon">🖥️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalHosts}</span>
            <span className="stat-label">الخوادم</span>
          </div>
        </div>

        <div className="stat-card active clickable" onClick={() => goTo('/lines')}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeLines}</span>
            <span className="stat-label">خطوط نشطة</span>
          </div>
        </div>

        <div className="stat-card expired clickable" onClick={() => goTo('/lines')}>
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.expiredLines}</span>
            <span className="stat-label">خطوط منتهية</span>
          </div>
        </div>

        <div className="stat-card suspended clickable" onClick={() => goTo('/lines')}>
          <div className="stat-icon">⏸️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.suspendedLines}</span>
            <span className="stat-label">خطوط موقوفة</span>
          </div>
        </div>

        <div className="stat-card devices clickable" onClick={() => goTo('/lines')}>
          <div className="stat-icon">📱</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalDevices}</span>
            <span className="stat-label">إجمالي الأجهزة</span>
          </div>
        </div>

        <div className="stat-card revenue clickable" onClick={() => goTo('/lines')}>
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalRevenue}</span>
            <span className="stat-label">الإيرادات</span>
          </div>
        </div>
      </div>

      {/* وصول سريع للصفحات الإدارية الأخرى */}
      <div className="quick-access">
        <h3 className="quick-access-title">وصول سريع</h3>
        <div className="quick-grid">
          <div className="quick-card" onClick={() => goTo('/offers')}>
            <span className="quick-icon">🏷️</span>
            <span>العروض</span>
          </div>
          <div className="quick-card" onClick={() => goTo('/coupons')}>
            <span className="quick-icon">🎟️</span>
            <span>الكوبونات</span>
          </div>
          <div className="quick-card" onClick={() => goTo('/notifications')}>
            <span className="quick-icon">🔔</span>
            <span>الإشعارات</span>
          </div>
          <div className="quick-card" onClick={() => goTo('/settings')}>
            <span className="quick-icon">⚙️</span>
            <span>الإعدادات</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;