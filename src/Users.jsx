import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('import.meta.env.VITE_API_URL/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('import.meta.env.VITE_API_URL/api/auth/register', { username, password, role }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsername('');
      setPassword('');
      fetchUsers();
    } catch (err) {
      alert('فشل إنشاء المستخدم');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-white mb-6">المستخدمون</h1>
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="اسم المستخدم"
          className="bg-gray-800 text-white p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="bg-gray-800 text-white p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="bg-gray-800 text-white p-2 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">مستخدم</option>
          <option value="admin">مدير</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-yellow-500 text-black px-4 py-2 rounded"
        >
          إضافة
        </button>
      </div>

      <table className="w-full bg-gray-800 rounded">
        <thead>
          <tr className="bg-gray-700 text-white">
            <th className="p-2">الاسم</th>
            <th className="p-2">البريد</th>
            <th className="p-2">الدور</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-white border-t border-gray-700">
              <td className="p-2">{user.username}</td>
              <td className="p-2">{user.email || '-'}</td>
              <td className="p-2">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}