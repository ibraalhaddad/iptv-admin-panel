import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL/api || 'http://localhost:5000/api';

export default function Settings() {
  const [host, setHost] = useState('');
  const [theme, setTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHost(res.data.host);
        setTheme(res.data.theme);
      } catch (err) {
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/settings`, { host, theme }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('تم الحفظ بنجاح');
    } catch (err) {
      alert('فشل الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="text-white text-center mt-10">جارٍ التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl text-white font-bold">إعدادات التطبيق</h1>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">تسجيل خروج</button>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <label className="block text-white mb-2">رابط الخادم (الهوست)</label>
          <input
            type="url"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded mb-4"
            placeholder="http://example.com:8080"
          />

          <label className="block text-white mb-2">الثيم</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded mb-6"
          >
            <option value="dark">داكن</option>
            <option value="light">فاتح</option>
            <option value="oled">OLED</option>
            <option value="purple">بنفسجي</option>
          </select>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-yellow-500 text-black p-3 rounded font-bold hover:bg-yellow-400 disabled:opacity-50"
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  );
}