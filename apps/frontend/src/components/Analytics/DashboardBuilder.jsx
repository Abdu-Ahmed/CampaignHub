import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import DailyMetricsChart from '../Analytics/DailyMetricsChart';
import { AuthContext } from '../../Auth/AuthContext';

// Simple styled components
const Button = ({ children, variant, onClick, className }) => {
  const base = 'px-4 py-2 rounded font-medium';
  const styles = variant === 'danger'
    ? 'bg-red-500 text-white hover:bg-red-600'
    : 'bg-blue-500 text-white hover:bg-blue-600';
  return (
    <button
      onClick={onClick}
      className={`${base} ${styles} ${className || ''}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange }) => (
  <div className="flex flex-col text-left">
    <label className="mb-1 font-medium text-gray-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const Select = ({ value, onChange, options }) => (
  <select
    value={value}
    onChange={onChange}
    className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default function DashboardBuilder() {
  const API_BASE = import.meta.env.VITE_ANALYTICS_URL || 'http://localhost:8005';
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [dashboards, setDashboards] = useState([]);
  const [layout, setLayout] = useState([]);
  const [name, setName] = useState('');

  // Load dashboards
  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/analytics/dashboards`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          console.error('Error fetching dashboards:', res.status, text);
          return;
        }
        const json = await res.json();
        setDashboards(json);
      } catch (err) {
        console.error('Unexpected error loading dashboards:', err);
      }
    }
    load();
  }, [token]);

  // Load single dashboard into state
  useEffect(() => {
    if (id && dashboards.length) {
      const dash = dashboards.find(d => String(d.id) === id);
      if (dash) {
        setName(dash.name);
        setLayout(dash.config.layout || []);
      }
    } else if (id === 'new') {
      setName('');
      setLayout([]);
    }
  }, [id, dashboards]);

  const handleSave = async () => {
    if (!token) return;
    const payload = { name, config: { layout } };
    const url = id && id !== 'new'
      ? `/api/analytics/dashboards/${id}`
      : '/api/analytics/dashboards';
    const method = id && id !== 'new' ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${method} dashboard: ${res.status}`);
      const listRes = await fetch(`${API_BASE}/api/analytics/dashboards`,  {
        headers: { Authorization: `Bearer ${token}` },
      });
      const listJson = await listRes.json();
      setDashboards(listJson);
      if (method === 'POST') {
        const newDash = listJson[listJson.length - 1];
        navigate(`/dashboard/${newDash.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!token || !id || id === 'new') return;
    try {
      const res = await fetch(`/api/analytics/dashboards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
      navigate('/dashboards');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboards</h1>
      <div className="flex space-x-4 mb-6">
        <Select
          value={id || ''}
          onChange={e => navigate(`/dashboard/${e.target.value}`)}
          options={[
            { value: '', label: '-- Select a dashboard --' },
            ...dashboards.map(d => ({ value: String(d.id), label: d.name })),
          ]}
        />
        <Button onClick={() => navigate('/dashboard/new')}>+ New</Button>
      </div>

      {(id || id === 'new') && (
        <div className="space-y-4">
          <Input
            label="Dashboard Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <GridLayout
            className="layout"
            layout={layout}
            cols={12}
            rowHeight={30}
            onLayoutChange={newLayout => setLayout(newLayout)}
          >
            {layout.map(item => (
              <div key={item.i} className="bg-white shadow rounded p-2">
                <DailyMetricsChart
                  campaignId={item.campaignId}
                  from={item.from}
                  to={item.to}
                />
              </div>
            ))}
          </GridLayout>

          <div className="flex space-x-2">
            <Button onClick={handleSave}>Save Dashboard</Button>
            {id !== 'new' && <Button variant="danger" onClick={handleDelete}>Delete</Button>}
          </div>
        </div>
      )}
    </div>
  );
}
