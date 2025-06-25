import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CAMPAIGNS, DELETE_CAMPAIGN, DUPLICATE_CAMPAIGN } from '../../graphql';
import CampaignList from '../Campaigns/CampaignList';
import CreateCampaignModal from '../Campaigns/modals/CreateCampaignModal';
import EditCampaignModal from '../Campaigns/modals/EditCampaignModal';
import SchedulerControls from '../Campaigns/SchedulerControls';
import GradientButton from '../UI/GradientButton';

export default function Home() {
  const { data, loading, error } = useQuery(GET_CAMPAIGNS);
  const [deleteCampaign] = useMutation(DELETE_CAMPAIGN);
  const [duplicateCampaign] = useMutation(DUPLICATE_CAMPAIGN);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign({ 
        variables: { id },
        refetchQueries: [{ query: GET_CAMPAIGNS }]
      });
    }
  };

  const handleDuplicate = (id) => {
    duplicateCampaign({ 
      variables: { id },
      refetchQueries: [{ query: GET_CAMPAIGNS }]
    });
  };

 
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white w-full">
      <div className="px-4 py-8 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-800 mb-4 sm:mb-0">
            Campaign Dashboard
          </h1>
          <GradientButton 
            onClick={() => setShowCreate(true)}
            className="text-base py-2.5 px-6 shadow-lg"
          >
            + New Campaign
          </GradientButton>
        </div>

        <SchedulerControls />
        
        <CampaignList 
          data={data}
          loading={loading}
          error={error}
          onEdit={setEditTarget}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      </div>

      <CreateCampaignModal 
        open={showCreate} 
        onClose={() => setShowCreate(false)} 
      />
      
      <EditCampaignModal
        open={!!editTarget}
        campaign={editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
}