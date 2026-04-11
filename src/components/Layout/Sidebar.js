import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  LogOut,
  Zap,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/resume', icon: FileText, label: 'Resume Analyzer' },
  { to: '/ai-search', icon: Zap, label: 'AI Job Finder' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 flex flex-col
        bg-dark-900 border-r border-dark-700/50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-dark-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">ApplyMate</span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-dark-400 hover:text-dark-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3 px-3">
          Navigation
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* AI Info Block */}
      <div className="px-4 py-2 mt-auto">
        <div className="bg-primary-900/40 border border-primary-500/20 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-primary-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> AI Analysis
            </span>
            <span className="text-xs font-bold text-white px-2 py-0.5 bg-primary-500/20 rounded border border-primary-500/30">
              {user?.aiCredits !== undefined ? user.aiCredits : 5} Left
            </span>
          </div>
          <div className="w-full bg-dark-700 h-1.5 rounded-full overflow-hidden mb-2">
            <div 
              className="bg-primary-500 h-full rounded-full transition-all"
              style={{ width: `${((user?.aiCredits !== undefined ? user.aiCredits : 5) / 5) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-primary-400/80 leading-tight">
            You get 5 AI resume analyses. Automatically refills every 24 hours!
          </p>
        </div>
      </div>

      {/* User + Logout */}
      <div className="p-4 border-t border-dark-700/50 mt-4">
        <div className="flex items-center gap-3 mb-3 px-3">
          <div className="w-8 h-8 rounded-full bg-primary-600/30 border border-primary-600/50 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary-400">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-dark-100 truncate">{user?.name}</p>
            <p className="text-xs text-dark-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogoutClick}
          className="nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowLogoutModal(false)}
          ></div>
          <div className="glass-card w-full max-w-sm p-6 relative z-10 animate-slide-up border border-red-500/20 bg-dark-900 shadow-2xl shadow-red-500/10">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sign Out</h3>
            <p className="text-sm text-dark-300 mb-6 leading-relaxed">
              Are you sure you want to log out of your ApplyMate account? You will need to sign back in to access your data.
            </p>
            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-dark-600 text-dark-200 font-medium hover:bg-dark-700 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-semibold hover:bg-red-500/20 border border-red-500/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
