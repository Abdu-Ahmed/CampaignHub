import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading campaigns…</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;