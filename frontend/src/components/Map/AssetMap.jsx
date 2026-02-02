import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from '../ui/StatusBadge';
import { fixLeafletIcon } from './leafletIconFix';

const statusColor = (status) => {
  switch (status) {
    case 'Safe':
      return '#16a34a';
    case 'Under Maintenance':
      return '#ca8a04';
    case 'Damaged':
      return '#dc2626';
    case 'Recently Repaired':
      return '#2563eb';
    default:
      return '#6b7280';
  }
};

const makeDotIcon = (color) =>
  L.divIcon({
    className: '',
    html: `<div style="
      width:14px;height:14px;border-radius:9999px;
      background:${color};
      border:2px solid #111827;
      box-shadow:0 0 0 3px rgba(255,255,255,0.9);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });

const AssetMap = ({ assets = [], complaints = [] }) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const center = useMemo(() => {
    const first = assets?.[0]?.location?.coordinates;
    if (first?.length === 2) return [first[1], first[0]];
    return [20.5937, 78.9629]; // India default
  }, [assets]);

  return (
    <div className="h-[70vh] w-full rounded-lg overflow-hidden border border-gray-200">
      <MapContainer center={center} zoom={5} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {assets.map((a) => {
          const coords = a.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const latlng = [coords[1], coords[0]];
          const icon = makeDotIcon(statusColor(a.status));
          return (
            <Marker key={a._id} position={latlng} icon={icon}>
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Type:</span> {a.category}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Status:</span> <StatusBadge status={a.status} />
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Department:</span> {a.department?.name || '-'}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Technician:</span> {a.assignedTechnician?.name || '-'}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Complaints:</span> {a.complaintCount ?? 0}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Updated:</span>{' '}
                      {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '-'}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {complaints.map((c) => {
          const coords = c.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const latlng = [coords[1], coords[0]];
          return (
            <Marker key={c._id} position={latlng}>
              <Popup>
                <div className="space-y-2">
                  <div className="font-semibold">{c.title}</div>
                  <div className="text-sm text-gray-700">
                    <div>
                      <span className="font-medium">Status:</span> <StatusBadge status={c.status} />
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Urgency:</span> {c.urgency}
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Asset:</span> {c.asset?.name || 'N/A'}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AssetMap;


