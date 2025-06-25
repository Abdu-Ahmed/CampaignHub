import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CAMPAIGN_DAILY_METRICS } from '../../graphql/queries';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import  LoadingSpinner  from '../UI/LoadingSpinner';

export default function DailyMetricsChart({ campaignId, from, to }) {
  const { data, loading, error } = useQuery(
    GET_CAMPAIGN_DAILY_METRICS,
    {
      variables: { campaignId, from, to },
      fetchPolicy: 'network-only',
    }
  );

  if (loading) return <LoadingSpinner className="w-16 h-16" />;
  if (error) return <p className="text-red-600">Error loading chart</p>;

  const series = data.dailyMetrics.map((d) => ({
    date: d.date.split('T')[0],
    Impressions: d.impressions,
    Clicks: d.clicks,
    Conversions: d.conversions,
  }));

  // If only one point, bar chart makes the value more visible
  const ChartComponent = series.length === 1 ? BarChart : BarChart;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={series} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Impressions" stroke="" fill="" />
        <Bar dataKey="Clicks" fill="#3b82f6" />
        <Bar dataKey="Conversions" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
