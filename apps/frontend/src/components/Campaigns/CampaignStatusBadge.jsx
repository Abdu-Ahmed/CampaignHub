import React from 'react';

const CampaignStatusBadge = ({ status }) => {
  const statusColors = {
    active: 'from-green-500 to-emerald-600',
    scheduled: 'from-blue-500 to-cyan-600',
    draft: 'from-gray-500 to-slate-600',
    completed: 'from-purple-500 to-indigo-600'
  };

  return (
    <span className={`bg-gradient-to-r ${statusColors[status?.toLowerCase()] || 'from-gray-500 to-slate-600'} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {status || 'Draft'}
    </span>
  );
};

export default CampaignStatusBadge;