import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';

const Users = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Users" subtitle="All user accounts (admin can activate / deactivate)">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin Approved</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOD Approved</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{u.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.department?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      disabled={u.role === 'admin'}
                      onClick={async () => {
                        try {
                          const next = !u.isActive;
                          const res = await api.put(`/api/users/${u._id}`, { isActive: next });
                          setItems((prev) =>
                            prev.map((x) => (x._id === u._id ? { ...x, isActive: res.data.isActive } : x))
                          );
                        } catch (e) {
                          // optional toast; kept minimal per brevity
                          console.error('Failed to toggle active', e);
                        }
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${
                        u.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      } ${u.role === 'admin' ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80'}`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.adminApproved ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.hodApproved ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Users;


