import React, { useState, useEffect } from 'react';
import {
  Briefcase, CheckCircle2, Clock, XCircle, TrendingUp,
  ArrowUpRight, Calendar, Sparkles, Globe, Activity
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statusColors = {
  Applied: '#6366f1',
  Interview: '#f59e0b',
  Rejected: '#ef4444',
  Offer: '#10b981',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function StatCard({ icon: Icon, label, value, color, change }) {
  return (
    <div className="stat-card group hover:border-dark-600 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-dark-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-0.5 mt-0.5 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className="w-3 h-3" />
            {change >= 0 ? '+' : ''}{change} this month
          </p>
        )}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 text-sm">
        <p className="text-dark-300 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dtech%2Bindustry%2Bhiring%2Bjob%2Bmarket%26hl%3Den-US%26gl%3DUS%26ceid%3DUS%3Aen');
      const data = await res.json();
      setNews((data.items || []).slice(0, 4));
    } catch (err) {
      console.error('Failed to fetch news');
    } finally {
      setNewsLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  // Stats
  const total = jobs.length;
  const byStatus = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { icon: Briefcase, label: 'Total Applications', value: total, color: 'bg-primary-600/20 text-primary-400', change: 3 },
    { icon: Clock, label: 'In Progress', value: (byStatus['Applied'] || 0) + (byStatus['Interview'] || 0), color: 'bg-yellow-500/20 text-yellow-400', change: 1 },
    { icon: CheckCircle2, label: 'Interviews', value: byStatus['Interview'] || 0, color: 'bg-green-500/20 text-green-400', change: 2 },
    { icon: XCircle, label: 'Rejected', value: byStatus['Rejected'] || 0, color: 'bg-red-500/20 text-red-400', change: -1 },
  ];

  // Monthly chart data
  const monthlyData = MONTHS.slice(0, new Date().getMonth() + 1).map((month, i) => ({
    month,
    Applied: jobs.filter(j => new Date(j.dateApplied).getMonth() === i && j.status === 'Applied').length,
    Interview: jobs.filter(j => new Date(j.dateApplied).getMonth() === i && j.status === 'Interview').length,
    Rejected: jobs.filter(j => new Date(j.dateApplied).getMonth() === i && j.status === 'Rejected').length,
  }));

  // Pie chart data
  const pieData = Object.entries(byStatus).map(([name, value]) => ({ name, value }));

  // Recent jobs
  const recent = [...jobs].sort((a, b) => new Date(b.dateApplied) - new Date(a.dateApplied)).slice(0, 5);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Welcome Banner */}
      <div className="glass-card p-6 flex items-center justify-between overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">Your Journey</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Track smarter. Land faster.</h2>
          <p className="text-dark-400 text-sm">You have <span className="text-primary-400 font-semibold">{total}</span> applications tracked so far.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-dark-400 text-sm">
          <Calendar className="w-4 h-4" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="xl:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-white">Applications Over Time</h3>
              <p className="text-xs text-dark-400 mt-0.5">Monthly breakdown by status</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                {Object.entries(statusColors).map(([key, color]) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              {['Applied', 'Interview', 'Rejected'].map(key => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={statusColors[key]}
                  strokeWidth={2}
                  fill={`url(#gradient-${key})`}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h3 className="text-base font-semibold text-white mb-1">Status Breakdown</h3>
          <p className="text-xs text-dark-400 mb-4">Distribution of all applications</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={statusColors[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span className="text-dark-300 text-xs">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-dark-500 text-sm">
              No data yet. Add your first application!
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Apps & Live News */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications (Left) */}
        <div className="xl:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white">Recent Applications</h3>
            <a href="/jobs" className="flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300 transition-colors">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
          {recent.length === 0 ? (
            <p className="text-dark-500 text-sm text-center py-8">No applications yet. Go add your first one!</p>
          ) : (
            <div className="space-y-3">
              {recent.map((job) => (
                <div key={job._id} className="flex items-center gap-4 p-3 rounded-lg bg-dark-800/40 hover:bg-dark-800/70 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-dark-700 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-dark-300">{job.company?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{job.company}</p>
                    <p className="text-xs text-dark-400 truncate">{job.role}</p>
                  </div>
                  <div className={`badge-${job.status?.toLowerCase()}`}>
                    {job.status}
                  </div>
                  <p className="text-xs text-dark-500 hidden sm:block">
                    {new Date(job.dateApplied).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tech Job Market News (Right) */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-400" />
              Live Tech Market
            </h3>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
              <Activity className="w-3 h-3 animate-pulse" /> Live
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {newsLoading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3 py-10 text-dark-400">
                <Spinner className="w-6 h-6 animate-spin text-primary-500" />
                <p className="text-sm">Fetching market updates...</p>
              </div>
            ) : news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item, idx) => {
                  const cleanedTitle = item.title.split(' - ')[0]; // Strip publisher name roughly
                  const publisher = item.title.split(' - ').pop() || 'Google News';
                  
                  return (
                    <a 
                      key={idx} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="p-3 rounded-xl bg-dark-800/30 border border-dark-700/50 group-hover:bg-dark-800/80 group-hover:border-primary-500/30 transition-all">
                        <h4 className="text-sm text-white font-medium line-clamp-2 leading-snug mb-2 group-hover:text-primary-300 transition-colors">
                          {cleanedTitle}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-dark-400 uppercase tracking-wide font-semibold">{publisher}</span>
                          <span className="text-[10px] text-dark-500">{new Date(item.pubDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-dark-500 text-sm text-center py-8">Unable to load live news Feed.</p>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-dark-700/50 flex justify-center">
            <a href="https://news.google.com/search?q=tech+job+market" target="_blank" rel="noopener noreferrer" className="text-xs text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1">
              Powered by Google News API <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

