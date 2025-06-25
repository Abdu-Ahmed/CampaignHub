// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from './Auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import PrivateRoute from './Auth/PrivateRoute';
import Layout from './components/Layout/Layout';
import { client } from './apollo';

import Login  from './components/Pages/Login';
import Signup from './components/Pages/Signup';
import Home   from './components/Pages/Home';
import CampaignDetails from './components/DetailsComponents/CampaignDetails';
import MetricsDashboard from './components/DetailsComponents/MetricsDashboard';
import DashboardBuilder from './components/Analytics/DashboardBuilder';


export default function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
       <ErrorBoundary>
        <Layout>
        <Routes>
          {/* public */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* private: protects "/" */}
            <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
            <Route path="/campaign/:id" element={<PrivateRoute><CampaignDetails/></PrivateRoute>} />
            <Route path="/campaign/:id/metrics" element={<PrivateRoute><MetricsDashboard/></PrivateRoute>} />
            <Route
            path="/dashboards"
            element={<PrivateRoute><DashboardBuilder/></PrivateRoute>}
            />
            <Route
            path="/dashboard/:id"
            element={<PrivateRoute><DashboardBuilder/></PrivateRoute>}
            />
          {/* catch-all: redirect unknowns back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Layout>
        </ErrorBoundary> 
      </AuthProvider>
    </ApolloProvider>
  );
}
