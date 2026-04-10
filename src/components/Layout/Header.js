import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your job search' },
  '/jobs': { title: 'Job Applications', subtitle: 'Track and manage your applications' },
  '/resume': { title: 'Resume Analyzer', subtitle: 'Optimize your resume for ATS' },
  '/profile': { title: 'Profile', subtitle: 'Manage your account settings' },
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { title, subtitle } = pageTitles[pathname] || { title: 'ApplyMate', subtitle: '' };

  return (
    <header className="bg-dark-900/80 backdrop-blur-sm border-b border-dark-700/50 px-4 lg:px-6 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-dark-400 hover:text-dark-200 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          <p className="text-xs text-dark-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 w-56">
          <Search className="w-4 h-4 text-dark-400 shrink-0" />
          <span className="text-sm text-dark-400">Quick search...</span>
        </div>
        <button className="relative p-2 text-dark-400 hover:text-dark-200 hover:bg-dark-700/50 rounded-lg transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-600/50 flex items-center justify-center">
          <span className="text-sm font-semibold text-primary-400">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}
