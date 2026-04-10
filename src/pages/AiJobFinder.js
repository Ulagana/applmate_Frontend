import React, { useState } from 'react';
import { Search, Loader2, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function AiJobFinder() {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const { notify } = useNotification();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!role.trim() || !location.trim()) {
      notify('error', 'Please enter both a role and a location');
      return;
    }

    setSearching(true);
    try {
      const token = localStorage.getItem('applymate_token');
      const query = `Role: ${role}, Location: ${location}`;
      const res = await fetch((process.env.REACT_APP_API_URL || 'https://applmate-backend.onrender.com/api') + '/ai/job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      });

      const data = await res.json();
      
      if (!res.ok) {
        notify('error', data.message || 'Search failed');
        setSearching(false);
        return;
      }

      setResults(data.result);
      notify('success', `Found job strategies! You have ${data.remainingCredits} AI tokens remaining.`);
    } catch (err) {
      notify('error', 'Network error or server is down.');
    }
    setSearching(false);
  };

  return (
    <div className="space-y-6 animate-slide-up h-full flex flex-col">
      <div className="glass-card p-6 border-primary-500/20 bg-primary-500/5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary-400" />
          AI Job Finder
        </h2>
        <p className="text-sm text-dark-300">
          Describe the exact role and location you're looking for. Our AI will search and generate daily job posting links and customized strategies.
        </p>
      </div>

      <div className="glass-card p-6">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. React Developer..."
                className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote, Europe, or New York..."
                className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching || !role || !location}
            className="btn-primary py-3 px-8 justify-center whitespace-nowrap self-end"
          >
            {searching ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Searching...</>
            ) : (
              'Find Jobs'
            )}
          </button>
        </form>
      </div>

      {results && (
        <div className="glass-card p-6 flex-1 overflow-y-auto">
          <h3 className="text-lg font-semibold text-white mb-4 border-b border-dark-700/50 pb-2">Your Daily Job Links & Strategy</h3>
          <div className="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed font-mono bg-dark-900/50 p-6 rounded-xl border border-dark-700">
            {results}
          </div>
        </div>
      )}
    </div>
  );
}
