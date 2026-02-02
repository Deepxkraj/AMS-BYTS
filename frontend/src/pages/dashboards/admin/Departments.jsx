import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';

const Departments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/departments');
      setItems(res.data);
    } catch (e) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/departments', { name, description });
      toast.success('Department created');
      setName('');
      setDescription('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="Departments"
        subtitle="Manage municipal departments"
        right={
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{items.length}</span>
          </div>
        }
      >
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Department name"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description (optional)"
          />
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            Add Department
          </button>
        </form>

        {loading ? (
          <div className="text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="text-gray-600">No departments yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HOD</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((d) => (
                  <tr key={d._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{d.description || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{d.hod?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Departments;


