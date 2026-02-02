const StatusBadge = ({ status }) => {
  const colors = {
    Safe: 'bg-green-100 text-green-800 ring-green-200',
    'Under Maintenance': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Damaged: 'bg-red-100 text-red-800 ring-red-200',
    'Recently Repaired': 'bg-blue-100 text-blue-800 ring-blue-200',
    Submitted: 'bg-gray-100 text-gray-800 ring-gray-200',
    Assigned: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 ring-yellow-200',
    Resolved: 'bg-green-100 text-green-800 ring-green-200',
  };

  const cls = colors[status] || 'bg-gray-100 text-gray-800 ring-gray-200';

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${cls}`}>
      {status}
    </span>
  );
};

export default StatusBadge;


