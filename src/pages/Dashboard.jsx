import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    packages: 0,
    hosts: 0,
    activeLines: 0,
    expiredLines: 0
  });
  const [serverInfo, setServerInfo] = useState({
    reseller_host_url: '',
    reseller_username: '',
    reseller_password: ''
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, pkgsRes, hostsRes, linesRes, serverRes] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/packages'),
          api.get('/api/hosts'),
          api.get('/api/lines'),
          api.get('/api/settings/reseller-info')
        ]);
        const active = linesRes.data.filter(l => l.status === 'active').length;
        const expired = linesRes.data.filter(l => l.status === 'expired').length;
        setStats({
          users: usersRes.data.length,
          packages: pkgsRes.data.length,
          hosts: hostsRes.data.length,
          activeLines: active,
          expiredLines: expired
        });
        setServerInfo(serverRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
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
            <span className="stat-value">{stats.users}</span>
            <span className="stat-label">مستخدمو اللوحة</span>
          </div>
        </div>
        <div className="stat-card packages">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.packages}</span>
            <span className="stat-label">الباقات</span>
          </div>
        </div>
        <div className="stat-card hosts">
          <div className="stat-icon">🖥️</div>
          <div className="stat-info">
            <span className="stat-value">{stats.hosts}</span>
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
      </div>
    </div>
  );
}

export default Dashboard;