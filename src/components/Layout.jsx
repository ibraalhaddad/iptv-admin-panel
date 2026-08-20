import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="logo">
          <span className="logo-icon">📡</span>
          <span>IPTV Admin</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>📊</span> لوحة التحكم
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>👥</span> المستخدمون
          </NavLink>
          <NavLink to="/packages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>📦</span> الباقات
          </NavLink>
          <NavLink to="/hosts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>🖥️</span> الخوادم
          </NavLink>
          <NavLink to="/lines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>📅</span> الخطوط
          </NavLink>
          <NavLink to="/coupons" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>🎟️</span> الكوبونات
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>🔔</span> الإشعارات
          </NavLink>
          <NavLink to="/offers" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>🏷️</span> العروض
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
            <span>⚙️</span> الإعدادات
          </NavLink>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> تسجيل الخروج
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;