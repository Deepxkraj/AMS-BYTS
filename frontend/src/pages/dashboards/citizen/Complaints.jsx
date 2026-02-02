import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';
import StatusBadge from '../../../components/ui/StatusBadge';

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
    <Card title="My Complaints" subtitle="Track complaint progress">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No complaints yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div key={c._id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-gray-900">{c.title}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Category: {c.category} • Urgency: {c.urgency} • Asset: {c.asset?.name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{c.description}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={c.status} />
                  <div className="text-xs text-gray-500">{c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Complaints;


