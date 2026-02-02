import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';
import { CheckCircle2, XCircle } from 'lucide-react';

const Approvals = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/approvals/pending');
      setItems(res.data);
    } catch {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.put(`/api/approvals/${id}/approve`, { type: 'hod' });
      toast.success('Technician approved');
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to approve');
    }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this account?')) return;
    try {
      await api.put(`/api/approvals/${id}/reject`);
      toast.success('Rejected');
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to reject');
    }
  };

  return (
    <Card title="Technician Approvals" subtitle="Approve technicians in your department">
      {loading ? (
        <div className="text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">No pending technicians.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Proof</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((u) => (
                <tr key={u._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.phone || '-'}</td>
                  <td className="px-6 py-4 text-sm">
                    {u.idProof ? (
                      <a className="text-blue-600 hover:underline" href={u.idProof} target="_blank" rel="noreferrer">
                        View
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium flex gap-3">
                    <button onClick={() => approve(u._id)} className="text-green-600 hover:text-green-800" title="Approve">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => reject(u._id)} className="text-red-600 hover:text-red-800" title="Reject">
                      <XCircle className="w-5 h-5" />
                    </button>
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

export default Approvals;


