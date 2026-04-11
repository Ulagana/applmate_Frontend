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
    try {
      const query = `Role: ${role}, Location: ${location}`;
      const res = await api.post('/ai/job-search', { query });
      
      setResults(res.data.result);
      notify('success', `Found job strategies! You have ${res.data.remainingCredits} AI tokens remaining.`);
    } catch (err) {
      notify('error', err.message || 'Network error or server is down.');
    }
    setSearching(false);
  };

  return (
    <div className="relative h-full flex flex-col animate-slide-up">
      {/* Glass Coming Soon Overlay */}
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-950/60 backdrop-blur-[6px] rounded-3xl">
        <div className="glass-card p-10 flex flex-col items-center border border-primary-500/30 bg-primary-500/10 shadow-2xl shadow-primary-500/20 transform hover:scale-105 transition-transform duration-500 text-center max-w-md">
          <Sparkles className="w-14 h-14 text-primary-400 mb-5 animate-pulse" />
          <h2 className="text-3xl font-bold text-white mb-3">Coming Soon</h2>
          <p className="text-sm font-medium text-primary-200 mb-2">Automated AI Job Matching</p>
          <p className="text-sm text-dark-300 leading-relaxed">
            We are finalizing secure API integrations. Soon, this agent will automatically aggregate and deliver daily, tailored job postings straight to your dashboard!
          </p>
        </div>
      </div>

      {/* Blurred & Disabled Background Content */}
      <div className="space-y-6 flex-1 flex flex-col opacity-40 blur-[4px] pointer-events-none select-none">
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
                  className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote, Europe, or New York..."
                  className="w-full bg-dark-800 border border-dark-600 rounded-xl py-3 pl-10 pr-4 text-white placeholder-dark-400 focus:outline-none"
                />
              </div>
            </div>
            <button type="submit" disabled className="btn-primary py-3 px-8 justify-center whitespace-nowrap self-end">
              Find Jobs
            </button>
          </form>
        </div>

        <div className="glass-card p-6 flex-1 flex items-center justify-center min-h-[200px]">
          <p className="text-dark-500">Your job results will appear here...</p>
        </div>
      </div>
    </div>
  );
}
