import React, { useState } from 'react';
import { Search, Loader2, Sparkles, MapPin, Briefcase } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import api from '../utils/api';

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
    setResults(null);
    try {
      const query = `Role: ${role}, Location: ${location}`;
      const res = await api.post('/ai/job-search', { query });
      
      setResults(res.data.result);
      notify('success', `Found job strategies! You have ${res.data.remainingCredits} AI tokens remaining.`);
    } catch (err) {
      notify('error', err.response?.data?.message || err.message || 'Network error or server is down.');
    }
    setSearching(false);
  };

  return (
    <div className="relative h-full flex flex-col animate-slide-up">
      <div className="space-y-6 flex-1 flex flex-col">
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
                  className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, Europe, or New York..."
                  className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={searching} 
              className="btn-primary py-3 px-8 justify-center whitespace-nowrap self-end disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {searching ? 'Finding Jobs...' : 'Find Jobs'}
            </button>
          </form>
        </div>

        <div className={`glass-card p-6 flex-1 flex flex-col min-h-[200px] ${results ? '' : 'items-center justify-center'}`}>
          {results ? (
            <div className="text-dark-200 text-sm whitespace-pre-wrap leading-relaxed">
              {results}
            </div>
          ) : (
            <p className="text-dark-500 text-center">Your job results will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
