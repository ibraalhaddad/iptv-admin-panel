import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPackages: 0,
    totalHosts: 0,
    activeLines: 0,
    expiredLines: 0,
    suspendedLines: 0,
    totalDevices: 0,
    totalRevenue: 0
  });
  const [serverInfo, setServerInfo] = useState({
    reseller_host_url: '',
    reseller_username: '',
    reseller_password: ''
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
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>لوحة التحكم</h1>
        <p>نظرة عامة على أداء النظام</p>
      </div>

      {/* بطاقة السيرفر */}
      <div className="server-card">
        <h3>سيرفر IPTV الخاص بك</h3>
        <div className="server-details">
          <p><strong>الرابط:</strong> {serverInfo.reseller_host_url || 'غير محدد'}</p>
          <p><strong>اسم المستخدم:</strong> {serverInfo.reseller_username || 'غير محدد'}</p>
          <p><strong>كلمة المرور:</strong> {serverInfo.reseller_password ? '••••••••' : 'غير محددة'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">مستخدمو اللوحة</span>
          </div>
        </div>
        <div className="stat-card packages">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalPackages}</span>
            <span className="stat-label">الباقات</span>
          </div>
        </div>
        <div className="stat-card hosts">
          <div className="stat-icon">🖥️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalHosts}</span>
            <span className="stat-label">الخوادم</span>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.activeLines}</span>
            <span className="stat-label">خطوط نشطة</span>
          </div>
        </div>
        <div className="stat-card expired">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.expiredLines}</span>
            <span className="stat-label">خطوط منتهية</span>
          </div>
        </div>
        <div className="stat-card suspended">
          <div className="stat-icon">⏸️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.suspendedLines}</span>
            <span className="stat-label">خطوط موقوفة</span>
          </div>
        </div>
        <div className="stat-card devices">
          <div className="stat-icon">📱</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalDevices}</span>
            <span className="stat-label">إجمالي الأجهزة</span>
          </div>
        </div>
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalRevenue}</span>
            <span className="stat-label">الإيرادات</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;