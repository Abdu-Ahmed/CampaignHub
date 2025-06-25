// src/components/ErrorBoundary.jsx
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { error };
  }

  componentDidCatch(error, info) {
    // You could also log to an external service here
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="bg-white border border-red-200 rounded-lg shadow p-6 max-w-xl w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Oops — something went wrong.
            </h1>
            <p className="mb-4 text-gray-700">
              <strong>Error:</strong> {error.message}
            </p>
            {info?.componentStack && (
              <details className="bg-gray-100 p-3 rounded overflow-auto text-sm text-gray-800">
                <summary className="cursor-pointer">Stack trace</summary>
                <pre className="whitespace-pre-wrap">{info.componentStack}</pre>
              </details>
            )}
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    // When there's not an error, render children untouched
    return this.props.children;
  }
}
