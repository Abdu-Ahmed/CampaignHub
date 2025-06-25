import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGN_METRICS } from '../../graphql';
import  LoadingSpinner  from '../UI/LoadingSpinner';

export default function MetricsDashboard() {

  const navigate = useNavigate()

  const { id: campaignId } = useParams();
  const { data, loading, error } = useQuery(GET_CAMPAIGN_METRICS, {
    variables: { id: campaignId },
    fetchPolicy: 'network-only',
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <LoadingSpinner className="w-12 h-12 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 bg-red-50 p-4 rounded-lg">
        <p>Error loading metrics: {error.message}</p>
      </div>
    );
  }

  const metrics = data?.campaignMetrics;

  return (
    <div className="mt-6 p-4 shadow-xl rounded-2xl bg-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Campaign {campaignId} Metrics</h2>
                    <button
                      onClick={() => navigate(`/`)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                    >
                      Back to Home
                    </button>
      </div>

      {metrics ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg"> 
            <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
            <p className="text-2xl font-bold">{metrics.impressions}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg"> 
            <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
            <p className="text-2xl font-bold">{metrics.clicks}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg"> 
            <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
            <p className="text-2xl font-bold">{metrics.conversions}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg"> 
            <h3 className="text-sm font-medium text-gray-500">CTR</h3>
            <p className="text-2xl font-bold">{(metrics.ctr * 100).toFixed(2)}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg"> 
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="text-2xl font-bold">{(metrics.conversionRate * 100).toFixed(2)}%</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No metrics available.</p>
      )}
    </div>
  );
}
