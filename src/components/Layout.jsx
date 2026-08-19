import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <span className="logo-icon">📡</span>
          <span>IPTV Admin</span>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>📊</span> لوحة التحكم
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>👥</span> المستخدمون
          </NavLink>
          <NavLink to="/packages" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>📦</span> الباقات
          </NavLink>
          <NavLink to="/hosts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>🖥️</span> الخوادم
          </NavLink>
          <NavLink to="/lines" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>📅</span> الخطوط
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
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