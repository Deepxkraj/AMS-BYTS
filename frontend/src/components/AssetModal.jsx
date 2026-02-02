import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const categories = ['Streetlights', 'Roads', 'Buildings', 'Water Pipelines', 'Public Utilities'];

const AssetModal = ({ asset, departments, onClose, onSuccess }) => {
  const isEdit = Boolean(asset?._id);
  const [loading, setLoading] = useState(false);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    name: asset?.name || '',
    category: asset?.category || 'Streetlights',
    department: asset?.department?._id || asset?.department || (departments?.[0]?._id || ''),
    status: asset?.status || 'Safe',
    latitude: asset?.location?.coordinates?.[1] ?? '',
    longitude: asset?.location?.coordinates?.[0] ?? '',
    description: asset?.description || '',
    assignedTechnician: asset?.assignedTechnician?._id || asset?.assignedTechnician || '',
  });

  const canAssign = true;

  const deptId = form.department;

  useEffect(() => {
    // If admin, we don't have "all technicians by department" endpoint; as a fallback,
    // we'll only support assignment from HOD screens. In admin modal, keep assignment optional.
    setTechnicians([]);
  }, [deptId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        department: form.department,
        status: form.status,
        description: form.description,
        assignedTechnician: form.assignedTechnician || undefined,
        location: {
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },
      };

      if (!Number.isFinite(payload.location.latitude) || !Number.isFinite(payload.location.longitude)) {
        toast.error('Please provide a valid latitude and longitude');
        setLoading(false);
        return;
      }

      if (isEdit) {
        await api.put(`/api/assets/${asset._id}`, payload);
        toast.success('Asset updated');
      } else {
        await api.post('/api/assets', payload);
        toast.success('Asset created');
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{isEdit ? 'Edit Asset' : 'Add Asset'}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Streetlight #A-102"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                required
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select department</option>
                {departments?.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {['Safe', 'Under Maintenance', 'Damaged', 'Recently Repaired'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                required
                value={form.latitude}
                onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 28.6139"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                required
                value={form.longitude}
                onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 77.2090"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional notes"
            />
          </div>

          {canAssign && (
            <div className="opacity-70">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign technician (optional)</label>
              <select
                value={form.assignedTechnician}
                onChange={(e) => setForm((f) => ({ ...f, assignedTechnician: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Not assigned</option>
                {technicians.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Assignment is fully supported from the HOD screens (department technicians list). Admin assignment can be added next.
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;


