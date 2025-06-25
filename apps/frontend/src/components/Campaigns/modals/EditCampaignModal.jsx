import React, { useState, useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_CAMPAIGN, GET_CAMPAIGNS } from '../../../graphql/queries';

const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
      <p className="text-red-700 font-semibold">Error updating campaign</p>
      <p className="text-red-600">{error.message}</p>
      {error.graphQLErrors?.length > 0 && (
        <details className="mt-2 text-red-500 text-sm">
          <summary className="cursor-pointer">Details</summary>
          <pre className="bg-red-100 p-2 rounded text-xs mt-1">
            {JSON.stringify(error.graphQLErrors, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
};

export default function EditCampaignModal({ open, campaign, onClose }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [status, setStatus] = useState('draft');
  const [abConfig, setAbConfig] = useState({
    variationA: '',
    variationB: '',
    splitA: 50,
    winnerMetric: '',
  });
  const ref = useRef();

  const [updateCampaign, { loading, error }] = useMutation(
    UPDATE_CAMPAIGN,
    {
      refetchQueries: [{ query: GET_CAMPAIGNS }],
      awaitRefetchQueries: true,
      onCompleted: onClose,
    }
  );

  // seed form when campaign prop changes
  useEffect(() => {
    if (!campaign) return;
    setTitle(campaign.title);
    setStartDate(campaign.start_date.slice(0, 10));
    setScheduleTime(
      campaign.schedule_time
        ? campaign.schedule_time.replace(' ', 'T').slice(0, 16)
        : ''
    );
    setStatus(campaign.status);
    setAbConfig({
      variationA: campaign.ab_config?.variationA || '',
      variationB: campaign.ab_config?.variationB || '',
      splitA: campaign.ab_config?.splitA ?? 50,
      winnerMetric: campaign.ab_config?.winnerMetric || '',
    });
  }, [campaign]);

  // close on escape / outside click
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onClickOutside = (e) =>
      ref.current && !ref.current.contains(e.target) && onClose();
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div 
        ref={ref} 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-200 ease-out"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Campaign</h2>
          <ErrorDisplay error={error} />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateCampaign({
                variables: {
                  id: campaign.id,
                  title,
                  start_date: startDate,
                  schedule_time: scheduleTime || null,
                  status,
                  abConfig,
                },
              });
            }}
          >
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Title</span>
              <input
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Start Date</span>
              <input
                type="date"
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Schedule Time</span>
              <input
                type="datetime-local"
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Status</span>
              <select
                className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
              </select>
            </label>

            <fieldset className="border border-gray-200 p-4 rounded-lg space-y-3 mb-4">
              <legend className="px-2 text-sm font-medium text-gray-700">A/B Test Config</legend>
              <label className="block">
                <span className="text-sm text-gray-600 mb-1 block">Variation A</span>
                <input
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={abConfig.variationA}
                  onChange={(e) =>
                    setAbConfig({ ...abConfig, variationA: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600 mb-1 block">Variation B</span>
                <input
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={abConfig.variationB}
                  onChange={(e) =>
                    setAbConfig({ ...abConfig, variationB: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600 mb-1 block">Split % A</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={abConfig.splitA}
                  onChange={(e) =>
                    setAbConfig({ ...abConfig, splitA: +e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-sm text-gray-600 mb-1 block">Winner Metric</span>
                <select
                  className="border border-gray-300 p-2 w-full rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={abConfig.winnerMetric}
                  onChange={(e) =>
                    setAbConfig({ ...abConfig, winnerMetric: e.target.value })
                  }
                >
                  <option value="">– select –</option>
                  <option value="clicks">Clicks</option>
                  <option value="conversions">Conversions</option>
                </select>
              </label>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}