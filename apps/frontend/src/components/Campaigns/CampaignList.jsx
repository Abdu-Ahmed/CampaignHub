import React from 'react';
import CampaignItem from './CampaignItem';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorDisplay from '../UI/ErrorDisplay';

const CampaignList = ({ data, loading, error, onEdit, onDelete, onDuplicate }) => {
  const campaigns = data?.campaigns || [];

  if (loading && !data) {
    return <LoadingSpinner />;
  }

  // Handle error state more safely
  if (error || (!loading && !data)) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div className="space-y-6 mt-6">
      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex items-center justify-center text-gray-400 mb-4">
<div className="flex flex-col items-center justify-center mb-4">
  <div className="w-12 h-16 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-center">
    <div className="text-indigo-500 text-6xl">📄</div>
  </div>
</div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first campaign.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <CampaignItem
              key={campaign.id}
              campaign={campaign}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;