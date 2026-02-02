import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import StatusBadge from '../../../components/ui/StatusBadge';
import Card from '../../../components/ui/Card';

const Complaints = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/complaints');
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="All Complaints" subtitle="System-wide complaints overview">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No complaints found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Citizen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.citizen?.name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.asset?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.urgency}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}
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

export default Complaints;


