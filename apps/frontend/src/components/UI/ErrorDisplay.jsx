import React from 'react';

const ErrorDisplay = (props) => {
  // Safely access error from props
  const error = props.error || {};
  
  // Create a safe error object with default values
  const safeError = {
    message: error.message || 'An unknown error occurred',
    graphQLErrors: error.graphQLErrors || [],
    networkError: error.networkError || null
  };

  return (
    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
      <h3 className="text-red-800 font-semibold mb-2">Error Loading Content</h3>
      <p className="text-red-600 mb-4">{safeError.message}</p>
      
      {safeError.graphQLErrors.length > 0 && (
        <details className="mb-4">
          <summary className="text-red-700 cursor-pointer font-medium">
            GraphQL Errors
          </summary>
          <pre className="bg-red-100 p-2 rounded mt-2 text-xs overflow-auto">
            {JSON.stringify(safeError.graphQLErrors, null, 2)}
          </pre>
        </details>
      )}
      
      {safeError.networkError && (
        <details>
          <summary className="text-red-700 cursor-pointer font-medium">
            Network Error
          </summary>
          <pre className="bg-red-100 p-2 rounded mt-2 text-xs overflow-auto">
            {JSON.stringify(safeError.networkError, null, 2)}
          </pre>
        </details>
      )}
      
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Reload Page
      </button>
    </div>
  );
};

export default ErrorDisplay;