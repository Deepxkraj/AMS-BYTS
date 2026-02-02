import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';

const Technicians = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/users/technicians');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Technicians" subtitle="Approved technicians in your department">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No technicians found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((t) => (
                <tr key={t._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{t.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default Technicians;


