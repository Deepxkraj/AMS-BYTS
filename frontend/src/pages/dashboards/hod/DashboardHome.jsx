import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import { Building2, AlertCircle, Users, CheckCircle2 } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/api/dashboard/stats');
        setStats(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-gray-600">Loading…</div>;

  const cards = [
    { title: 'Department Assets', value: stats?.departmentAssets || 0, icon: Building2, color: 'bg-blue-600' },
    { title: 'Department Complaints', value: stats?.departmentComplaints || 0, icon: AlertCircle, color: 'bg-red-600' },
    { title: 'Pending Tech Approvals', value: stats?.pendingTechnicianApprovals || 0, icon: CheckCircle2, color: 'bg-yellow-500' },
    { title: 'Technicians', value: stats?.technicians || 0, icon: Users, color: 'bg-green-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{c.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{c.value}</p>
              </div>
              <div className={`${c.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardHome;


