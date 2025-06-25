import React, { useState, useContext } from 'react';
import { AuthContext } from '../../Auth/AuthContext';
import GradientButton from '../UI/GradientButton';

const passwordRequirements = [
  { regex: /.{8,}/, message: 'At least 8 characters' },
  { regex: /[A-Z]/, message: 'One uppercase letter' },
  { regex: /[a-z]/, message: 'One lowercase letter' },
  { regex: /[0-9]/, message: 'One number' },
  { regex: /[@$!%*?&]/, message: 'One special character (@$!%*?&)' },
];

export default function Signup() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [error, setError] = useState('');
  const [pwFeedback, setPwFeedback] = useState([]);

  const checkPassword = pw =>
    passwordRequirements.map(r => ({ ...r, ok: r.regex.test(pw) }));

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'password') setPwFeedback(checkPassword(value));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (form.password !== form.password_confirmation) return setError("Passwords don't match");
    if (pwFeedback.some(f => !f.ok)) return setError('Password does not meet requirements');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form), // Send form directly, no modification needed
      });
      const body = await res.json();
      if (res.ok && body.token) await login(body.token);
      else setError(body.message || 'Signup failed');
    } catch (e) {
      console.error(e);
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white">Get Started</h2>
            <p className="text-emerald-200 mt-2">Create your CampaignHub account</p>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-5 bg-red-50 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                <input
                  name="name"
                  placeholder="Your name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {pwFeedback.map((f, i) => (
                    <div key={i} className="flex items-center">
                      <span className={`mr-2 ${f.ok ? 'text-green-500' : 'text-gray-400'}`}>
                        {f.ok ? '✓' : '✗'}
                      </span>
                      <span className={`text-sm ${f.ok ? 'text-green-700' : 'text-gray-600'}`}>
                        {f.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Confirm Password</label>
                <input
                  name="password_confirmation"
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <GradientButton 
                type="submit" 
                variant="success"
                className="w-full py-3.5 text-base"
              >
                Create Account
              </GradientButton>
            </form>
            
            <div className="mt-6 pt-5 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-800">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}