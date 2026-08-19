import { useState, useEffect } from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [plans, setPlans] = useState([]);
    const [userId, setUserId] = useState('');
    const [planCode, setPlanCode] = useState('monthly');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            const [subsRes, plansRes] = await Promise.all([
                axios.get(`${API_URL}/subscriptions/admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }),

                axios.get(`${API_URL}/subscriptions/plans`),
            ]);

            setSubscriptions(subsRes.data);
            setPlans(plansRes.data);
        } catch (err) {
            console.error('Error fetching subscriptions:', err);
        }
    };

    const handleActivate = async () => {
        if (!userId.trim()) {
            alert('يرجى إدخال معرف المستخدم');
            return;
        }

        try {
            const token = localStorage.getItem('token');

            await axios.post(
                `${API_URL}/subscriptions/activate`,
                {
                    planCode,
                    userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUserId('');
            await fetchData();
        } catch (err) {
            console.error('Activation error:', err);
            alert('فشل التفعيل');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(
                `${API_URL}/subscriptions/admin/${id}`,
                {
                    status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchData();
        } catch (err) {
            console.error('Status update error:', err);
            alert('فشل التحديث');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl text-white mb-6">
                الاشتراكات
            </h1>

            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="معرف المستخدم"
                    className="bg-gray-800 text-white p-2 rounded"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <select
                    className="bg-gray-800 text-white p-2 rounded"
                    value={planCode}
                    onChange={(e) => setPlanCode(e.target.value)}
                >
                    {plans.map((plan) => (
                        <option key={plan.code} value={plan.code}>
                            {plan.name}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleActivate}
                    className="bg-yellow-500 text-black px-4 py-2 rounded"
                >
                    تفعيل
                </button>
            </div>

            <table className="w-full bg-gray-800 rounded">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="p-2">المستخدم</th>
                        <th className="p-2">الخطة</th>
                        <th className="p-2">الحالة</th>
                        <th className="p-2">تاريخ الانتهاء</th>
                        <th className="p-2">إجراء</th>
                    </tr>
                </thead>

                <tbody>
                    {subscriptions.map((sub) => (
                        <tr
                            key={sub._id}
                            className="text-white border-t border-gray-700"
                        >
                            <td className="p-2">
                                {sub.user?.username || '-'}
                            </td>

                            <td className="p-2">
                                {sub.plan?.name || '-'}
                            </td>

                            <td className="p-2">
                                <span
                                    className={
                                        sub.status === 'active'
                                            ? 'text-green-400'
                                            : 'text-red-400'
                                    }
                                >
                                    {sub.status}
                                </span>
                            </td>

                            <td className="p-2">
                                {sub.endDate
                                    ? new Date(sub.endDate).toLocaleDateString()
                                    : '-'}
                            </td>

                            <td className="p-2">
                                <button
                                    onClick={() =>
                                        handleStatusChange(
                                            sub._id,
                                            sub.status === 'active'
                                                ? 'cancelled'
                                                : 'active'
                                        )
                                    }
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    {sub.status === 'active'
                                        ? 'إيقاف'
                                        : 'تفعيل'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}