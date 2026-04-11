import React, { useState } from 'react';
import { User, Mail, Lock, Save, Loader2, Camera, Key, Copy, CheckCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../utils/api';

export default function Profile() {
  const { user, token, updateUser } = useAuth();
  const { notify } = useNotification();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePic: user?.profilePic || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token).then(() => {
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2500);
    });
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/auth/profile', form);
      updateUser(res.data.user);
      notify('success', 'Profile updated successfully!');
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      notify('error', 'Image must be under 2MB, try a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, profilePic: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      notify('error', 'Passwords do not match');
      return;
    }
    if (passwords.newPass.length < 6) {
      notify('error', 'Password must be at least 6 characters');
      return;
    }
    setSavingPass(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      notify('success', 'Password changed successfully!');
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      notify('error', err.message);
    } finally {
      setSavingPass(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up max-w-6xl">
      
      {/* LEFT COLUMN: Premium Identity Card */}
      <div className="lg:col-span-4 space-y-6">
        <div className="glass-card overflow-hidden relative">
          {/* Stunning Background Banner */}
          <div className="h-32 w-full bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-dark-900 border-4 border-dark-950 flex items-center justify-center overflow-hidden shadow-2xl relative z-10">
                  <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors"></div>
                  {form.profilePic ? (
                    <img src={form.profilePic} alt="Profile" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="text-3xl font-extrabold bg-gradient-to-br from-white to-primary-200 bg-clip-text text-transparent relative z-10">{initials}</span>
                  )}
                </div>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  id="profilePicUpload" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <label 
                  htmlFor="profilePicUpload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 hover:bg-primary-400 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 border-2 border-dark-950 z-20 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">{user?.name}</h2>
            <p className="text-sm text-dark-300 mt-1 pb-5 border-b border-dark-700/50 w-full">{user?.email}</p>
            
            <div className="w-full mt-5 flex items-center justify-between">
              <span className="text-dark-400 text-sm font-medium">Subscription</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500/20 to-purple-500/20 text-primary-300 border border-primary-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                Free Plan
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone Minified */}
        <div className="glass-card p-6 border border-red-500/20 bg-red-500/5 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 group-hover:bg-red-500/10 transition-colors duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-widest">Danger Zone</h2>
            <p className="text-xs text-dark-400 mb-5 leading-relaxed">Permanently delete your account and all stored resumes/data. This cannot be reversed.</p>
            <button className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 font-semibold text-sm hover:bg-red-500/10 hover:text-red-300 transition-colors shadow-lg shadow-red-500/5">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Settings Forms */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Profile Info Form */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
            <User className="w-5 h-5 text-primary-400" />
            General Information
          </h2>
          
          <form onSubmit={handleProfile} className="space-y-5 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-dark-200 mb-2 block">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-200 mb-2 block">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 group-focus-within:text-primary-400 transition-colors" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 pl-11 pr-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-200 mb-2 block">Professional Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                placeholder="Write a short summary about your professional background and goals..."
                className="w-full bg-dark-900 border border-dark-600 rounded-xl p-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={savingProfile} className="btn-primary py-2.5 px-8 shadow-lg shadow-primary-500/20">
                {savingProfile ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" /> Save Profile</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security / Password Form */}
        <div className="glass-card p-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3 border-b border-dark-700/50 pb-4">
            <Lock className="w-5 h-5 text-primary-400" />
            Security & Login
          </h2>
          
          <form onSubmit={handlePassword} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-dark-200 mb-2 block">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                className="w-full sm:max-w-md bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div>
                <label className="text-sm font-medium text-dark-200 mb-2 block">New Password</label>
                <input
                  type="password"
                  value={passwords.newPass}
                  onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                  placeholder="Min. 6 characters"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-dark-200 mb-2 block">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full bg-dark-900 border border-dark-600 rounded-xl py-3 px-4 text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all text-sm"
                  placeholder="Repeat new password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={savingPass} className="px-6 py-2.5 bg-dark-800 border border-dark-600 text-white font-medium rounded-xl hover:bg-dark-700 hover:border-dark-500 transition-colors flex items-center justify-center shadow-lg">
                {savingPass ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Chrome Extension Token Card */}
        <div className="glass-card p-8 relative overflow-hidden border border-indigo-500/20 bg-indigo-500/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-3 relative z-10">
            <Key className="w-5 h-5 text-indigo-400" />
            Chrome Extension Token
          </h2>
          <p className="text-sm text-dark-400 mb-5 relative z-10">
            Copy this token and paste it into the <span className="text-indigo-400 font-semibold">ApplyMate Chrome Extension</span> to enable 1-click job autofill.
          </p>

          <div className="flex gap-2 items-center relative z-10 mb-3">
            <div className="flex-1 bg-dark-900 border border-dark-600 rounded-xl py-2.5 px-4 font-mono text-xs text-dark-300 truncate select-all cursor-text">
              {token ? `${token.slice(0, 40)}...` : '⚠ Not available — please log out and log in again.'}
            </div>
            <button
              onClick={handleCopyToken}
              disabled={!token}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shadow-lg shadow-indigo-500/20 shrink-0"
            >
              {tokenCopied ? (
                <><CheckCheck className="w-4 h-4" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4" /> Copy</>
              )}
            </button>
          </div>

          <button
            onClick={() => window.open('chrome://extensions', '_blank')}
            className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold relative z-10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open Chrome Extensions Page
          </button>

          <p className="text-[10px] text-dark-500 mt-3 relative z-10">
            ⚠️ Keep this token private. It grants full access to your ApplyMate account.
          </p>
        </div>

      </div>
    </div>
  );
}
