import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle } from 'lucide-react';

// Custom event to notify dashboard to refresh
const dispatchStatsRefresh = () => {
  window.dispatchEvent(new CustomEvent('statsRefresh'));
};

const Approvals = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    try {
      const response = await api.get('/api/approvals/pending');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      toast.error('Failed to fetch pending approvals');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, type) => {
    try {
      await api.put(`/api/approvals/${userId}/approve`, { type });
      toast.success('User approved successfully');
      fetchPendingApprovals();
      dispatchStatsRefresh(); // Notify dashboard to refresh
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject this user?')) return;

    try {
      await api.put(`/api/approvals/${userId}/reject`);
      toast.success('User rejected');
      fetchPendingApprovals();
      dispatchStatsRefresh(); // Notify dashboard to refresh
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Approvals</h2>

        {users.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No pending approvals</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {!user.adminApproved && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                            Admin Pending
                          </span>
                        )}
                        {user.role === 'technician' && user.hodApproved && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            HOD Approved
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!user.adminApproved && (
                        <button
                          onClick={() => handleApproval(user._id, 'admin')}
                          className="text-green-600 hover:text-green-900"
                          title="Approve (Admin)"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleReject(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;

