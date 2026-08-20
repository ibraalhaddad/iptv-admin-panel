import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Packages from './pages/Packages';
import Hosts from './pages/Hosts';
import Lines from './pages/Lines';
import Coupons from './pages/Coupons';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Offers from './pages/Offers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/hosts" element={<Hosts />} />
          <Route path="/lines" element={<Lines />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/offers" element={<Offers />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;