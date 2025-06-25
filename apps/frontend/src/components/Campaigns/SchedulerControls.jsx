import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DISPATCH_SCHEDULED, GET_CAMPAIGNS } from '../../graphql';
import GradientButton from '../UI/GradientButton';

export default function SchedulerControls() {
  const [dispatchScheduled, { loading, error }] = useMutation(
    DISPATCH_SCHEDULED,
    {
      refetchQueries: [{ query: GET_CAMPAIGNS }],
      awaitRefetchQueries: true,
    }
  );
  const [message, setMessage] = useState(null);

  const handleDispatch = async () => {
    setMessage(null);
    try {
      const result = await dispatchScheduled();
      const count = result.data.dispatchScheduledCampaigns;
      setMessage(`🚀 Dispatched ${count} scheduled campaign${count !== 1 ? 's' : ''}`);
    } catch (e) {
      // Error handled by the error variable
    }
  };

  return (
    <div className="mb-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-indigo-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Campaign Scheduler
          </h3>
          <p className="text-sm text-indigo-600 mt-1">
            Dispatch campaigns scheduled to run now
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <GradientButton
            onClick={handleDispatch}
            disabled={loading}
            variant="primary"
            className="flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Dispatching...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
                Dispatch Scheduled
              </>
            )}
          </GradientButton>
        </div>
      </div>

      {(error || message) && (
        <div className={`mt-4 text-center px-4 py-2 rounded-lg ${
          error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {error ? `Error: ${error.message}` : message}
        </div>
      )}
    </div>
  );
}