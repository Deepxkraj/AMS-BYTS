import { useEffect, useState } from 'react';
import api from '../../../utils/api';
import Card from '../../../components/ui/Card';
import AssetMap from '../../../components/Map/AssetMap';

const MapView = () => {
  const [data, setData] = useState({ assets: [], complaints: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/dashboard/map-data');
        setData(res.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Card title="My Map" subtitle="Your assigned assets and complaints">
      {loading ? <div className="text-gray-600">Loading…</div> : <AssetMap assets={data.assets} complaints={data.complaints} />}
    </Card>
  );
};

export default MapView;


