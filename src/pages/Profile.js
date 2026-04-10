import React, { useState } from 'react';
import { User, Mail, Lock, Save, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../utils/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { notify } = useNotification();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

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
    <div className="max-w-2xl space-y-6 animate-slide-up">
      {/* Avatar Card */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-5">Profile Information</h2>
        <div className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/20 border-2 border-primary-500/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-400">{initials}</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{user?.name}</p>
            <p className="text-sm text-dark-400">{user?.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400 border border-primary-500/30 mt-1">
              Free Plan
            </span>
          </div>
        </div>

        <form onSubmit={handleProfile} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field pl-10"
                placeholder="Your full name"
              />
            </div>
          </div>
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              placeholder="Brief bio or job-seeking summary..."
              className="input-field resize-none"
            />
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary">
            {savingProfile
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Changes</>
            }
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="glass-card p-6">
        <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary-400" />
          Change Password
        </h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <input
              type="password"
              value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              type="password"
              value={passwords.newPass}
              onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
              className="input-field"
              placeholder="Min. 6 characters"
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              className="input-field"
              placeholder="Repeat new password"
            />
          </div>
          <button type="submit" disabled={savingPass} className="btn-primary">
            {savingPass
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</>
              : <><Lock className="w-4 h-4" /> Update Password</>
            }
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/20">
        <h2 className="text-base font-semibold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-dark-400 mb-4">Permanently delete your account and all data. This cannot be undone.</p>
        <button className="btn-danger">Delete Account</button>
      </div>
    </div>
  );
}
