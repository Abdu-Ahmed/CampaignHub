import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { GET_CAMPAIGN, GET_CAMPAIGN_METRICS } from "../../graphql/queries";
import DailyMetricsChart from '../Analytics/DailyMetricsChart';

// Error handling component
const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-md my-4">
      <h3 className="text-red-700 font-semibold">Error</h3>
      <p className="text-red-600">{error.message}</p>
      {error.graphQLErrors?.length > 0 && (
        <details className="mt-2">
          <summary className="text-red-500 text-sm cursor-pointer">Show details</summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
            {JSON.stringify(error.graphQLErrors, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default function CampaignDetails() {
  const { id } = useParams();
  // Calculate date range: last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const formatDate = (d) => d.toISOString().split('T')[0];
  const fromDate = formatDate(sevenDaysAgo);
  const toDate = formatDate(today);

  const {
    data: campaignData,
    loading: campaignLoading,
    error: campaignError
  } = useQuery(GET_CAMPAIGN, {
    variables: { id },
    fetchPolicy: 'network-only'
  });

  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError
  } = useQuery(GET_CAMPAIGN_METRICS, {
    variables: { id },
    fetchPolicy: 'network-only'
  });

  const isLoading = campaignLoading || metricsLoading;
  const campaign = campaignData?.campaign;
  const metrics = metricsData?.campaignMetrics;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Link to="/" className="text-blue-600 hover:underline">
        ← Back to Home
      </Link>

      {/* Errors */}
      {campaignError && <ErrorDisplay error={campaignError} />}
      {metricsError && <ErrorDisplay error={metricsError} />}

      {/* Loading */}
      {isLoading && (
        <div className="text-center p-12">
          <p className="text-lg">Loading campaign data...</p>
        </div>
      )}

      {/* Campaign details */}
      {campaign && (
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-2">{campaign.title}</h1>
          <p className="text-gray-600">
            Starts: {new Date(campaign.start_date).toLocaleDateString()}<br />
            Ends: {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : '—'}<br />
            Scheduled At: {campaign.schedule_time ? new Date(campaign.schedule_time).toLocaleString() : '—'}<br />
            Status: <span className="capitalize">{campaign.status}</span>
          </p>
          {campaign.description && <p className="mt-4">{campaign.description}</p>}

          {/* A/B Config */}
          {campaign.ab_config && (
            <div className="mt-6 border-t pt-4">
              <h2 className="text-2xl font-semibold mb-2">A/B Test Configuration</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Variation A: {campaign.ab_config.variation_a}</li>
                <li>Variation B: {campaign.ab_config.variation_b}</li>
                <li>Split A: {campaign.ab_config.split_a}%</li>
                <li>Winner Metric: {campaign.ab_config.winner_metric}</li>
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Metrics Overview */}
      {metrics && (
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Metrics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Impressions</h3>
              <p className="text-2xl font-bold">{metrics.impressions}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Clicks</h3>
              <p className="text-2xl font-bold">{metrics.clicks}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Conversions</h3>
              <p className="text-2xl font-bold">{metrics.conversions}</p>
            </div>
          </div>

          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[{
                  name: 'Metrics',
                  Impressions: metrics.impressions,
                  Clicks: metrics.clicks,
                  Conversions: metrics.conversions
                }]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Impressions" />
                <Bar dataKey="Clicks" />
                <Bar dataKey="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">CTR</h3>
              <p className="text-2xl font-bold">{(metrics.ctr * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-indigo-800">Conversion Rate</h3>
              <p className="text-2xl font-bold">{(metrics.conversionRate * 100).toFixed(2)}%</p>
            </div>
          </div>
        </section>
      )}

      {/* Daily Metrics Chart */}
      <section className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Daily Metrics (Last 7 Days)</h2>
        <DailyMetricsChart
          campaignId={id}
          from={fromDate}
          to={toDate}
        />
      </section>
    </div>
  );
}
