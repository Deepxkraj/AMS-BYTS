import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';

const categories = ['Damage', 'Maintenance', 'Safety', 'Other'];
const urgencies = ['Low', 'Medium', 'High', 'Critical'];

const NewComplaint = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Damage',
    urgency: 'Medium',
    asset: '',
  });

  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null); // { latitude, longitude }

  useEffect(() => {
    fetchAssets();
    captureLocation();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/api/assets');
      setAssets(res.data);
    } catch {
      // optional
    }
  };

  const captureLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      () => {
        toast.error('Unable to fetch location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error('Location is required (enable GPS / location permission).');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('category', form.category);
      fd.append('urgency', form.urgency);
      if (form.asset) fd.append('asset', form.asset);
      if (image) fd.append('image', image);
      fd.append('location', JSON.stringify(location));

      await api.post('/api/complaints', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Complaint submitted');
      setForm({ title: '', description: '', category: 'Damage', urgency: 'Medium', asset: '' });
      setImage(null);
    } catch (e2) {
      toast.error(e2.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="New Complaint" subtitle="Submit a new complaint with auto-captured location">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Streetlight not working"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset (optional)</label>
            <select
              value={form.asset}
              onChange={(e) => setForm((f) => ({ ...f, asset: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No asset selected</option>
              {assets.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} ({a.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the issue"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
            <select
              value={form.urgency}
              onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {urgencies.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm text-gray-700">
            <span className="font-medium">Location:</span>{' '}
            {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'Not captured'}
          </div>
          <button
            type="button"
            onClick={captureLocation}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-white"
          >
            Re-capture Location
          </button>
        </div>

        <button disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Submitting…' : 'Submit Complaint'}
        </button>
      </form>
    </Card>
  );
};

export default NewComplaint;


