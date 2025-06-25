import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import GradientButton from '../UI/GradientButton';
import CampaignStatusBadge from './CampaignStatusBadge';

// Added formatDate function directly in the file
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  } catch {
    return dateString;
  }
};

const CampaignItem = ({ 
  campaign, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-white/90 to-indigo-50 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-all p-5 mb-4 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1 mb-4 md:mb-0">
          <div className="flex items-start gap-3">
            <Link
              to={`/campaign/${campaign.id}`}
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-800 hover:from-purple-700 hover:to-indigo-800 transition-all"
            >
              {campaign.title || 'Untitled Campaign'}
            </Link>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              {/* Fixed smaller icon size */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600">Start: {formatDate(campaign.start_date) || 'Not set'}</span>
            </div>
            
            {campaign.schedule_time && (
              <div className="flex items-center">
                {/* Fixed smaller icon size */}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Scheduled: {formatDate(campaign.schedule_time)}</span>
              </div>
            )}
          </div>
          
          {campaign.ab_config && (
            <div className="mt-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
              <div className="text-xs font-semibold text-indigo-700 mb-1">A/B TEST</div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Variation A</div>
                  <div className="text-xs text-gray-600">{campaign.ab_config.variationA || 'Control'}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Variation B</div>
                  <div className="text-xs text-gray-600">{campaign.ab_config.variationB || 'Test'}</div>
                </div>
                <div className="bg-indigo-100 px-2 py-1 rounded-md text-xs font-medium">
                  {campaign.ab_config.splitA || 50}/{100 - (campaign.ab_config.splitA || 50)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          <GradientButton 
            onClick={() => navigate(`/campaign/${campaign.id}/metrics`)}
            variant="secondary"
            className="text-sm"
          >
            Metrics
          </GradientButton>
          
          <GradientButton 
            onClick={() => onEdit(campaign)}
            className="text-sm"
          >
            Edit
          </GradientButton>
          
          <GradientButton 
            onClick={() => onDuplicate(campaign.id)}
            variant="success"
            className="text-sm"
          >
            Duplicate
          </GradientButton>
          
          <GradientButton 
            onClick={() => onDelete(campaign.id)}
            variant="danger"
            className="text-sm"
          >
            Delete
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default CampaignItem;