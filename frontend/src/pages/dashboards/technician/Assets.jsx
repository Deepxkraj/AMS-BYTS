import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

const Assets = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/assets');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/assets/${id}`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <Card title="My Assigned Assets" subtitle="Update maintenance status">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No assigned assets.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Update</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((a) => (
                <tr key={a._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {['Safe', 'Under Maintenance', 'Damaged', 'Recently Repaired'].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Assets;


