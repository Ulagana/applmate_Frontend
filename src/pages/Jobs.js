import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Filter, Edit2, Trash2, X, Loader2,
  Building2, Briefcase, Calendar, StickyNote, ChevronDown,
  LayoutGrid, List
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const STATUSES = ['All', 'Applied', 'Interview', 'Rejected', 'Offer'];

const statusBadge = {
  Applied: 'badge-applied',
  Interview: 'badge-interview',
  Rejected: 'badge-rejected',
  Offer: 'badge-offer',
};

const EMPTY_FORM = {
  company: '',
  role: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().split('T')[0],
  notes: '',
  location: '',
  salary: '',
};

function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState(job || EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const { notify } = useNotification();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      notify('error', 'Company and role are required');
      return;
    }
    setLoading(true);
    try {
      let res;
      if (job?._id) {
        res = await api.put(`/jobs/${job._id}`, form);
      } else {
        res = await api.post('/jobs', form);
      }
      onSave(res.data.job);
      notify('success', job?._id ? 'Application updated!' : 'Application added!');
      onClose();
    } catch (err) {
      notify('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="glass-card w-full max-w-lg p-6 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">
            {job?._id ? 'Edit Application' : 'Add Application'}
          </h2>
          <button onClick={onClose} className="text-dark-400 hover:text-dark-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Company *</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Role *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Dev"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field appearance-none pr-8"
                >
                  {STATUSES.filter(s => s !== 'All').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Date Applied</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="date"
                  name="dateApplied"
                  value={form.dateApplied}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Remote / City"
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Salary (optional)</label>
              <input
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="e.g. $80k - $100k"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <div className="relative">
              <StickyNote className="absolute left-3 top-3 w-4 h-4 text-dark-400" />
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any notes about this role..."
                className="input-field pl-10 resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : job?._id ? 'Update' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalJob, setModalJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [deleting, setDeleting] = useState(null);
  const { notify } = useNotification();

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error(err);
      notify('error', 'Failed to load jobs from database.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    const updatedJobs = jobs.map(job => 
      job._id === draggableId ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);

    try {
      await api.put(`/jobs/${draggableId}`, { status: newStatus });
      notify('success', `Moved to ${newStatus}`);
    } catch (err) {
      notify('error', 'Failed to update status');
      // Revert on error
      fetchJobs();
    }
  };

  const handleSave = useCallback((savedJob) => {
    setJobs(prev => {
      const idx = prev.findIndex(j => j._id === savedJob._id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedJob;
        return updated;
      }
      return [savedJob, ...prev];
    });
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(prev => prev.filter(j => j._id !== id));
      notify('success', 'Application deleted');
    } catch (err) {
      notify('error', err.message);
    } finally {
      setDeleting(null);
    }
  };

  const openAdd = () => { setModalJob(null); setShowModal(true); };
  const openEdit = (job) => { setModalJob(job); setShowModal(true); };

  const filtered = jobs.filter(j => {
    const matchSearch =
      j.company?.toLowerCase().includes(search.toLowerCase()) ||
      j.role?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter className="w-4 h-4 text-dark-400 shrink-0" />
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  filterStatus === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700/50 text-dark-400 hover:bg-dark-700 hover:text-dark-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-dark-700/50 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-dark-200'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'board' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-dark-200'}`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-dark-400">
        Showing <span className="text-white font-medium">{filtered.length}</span> of {jobs.length} applications
      </p>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Briefcase className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <p className="text-dark-300 font-medium mb-1">No applications found</p>
          <p className="text-dark-500 text-sm">Try adjusting your search or add a new application.</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700/50">
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Company</th>
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Location</th>
                  <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Applied</th>
                  <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/30">
                {filtered.map((job) => (
                  <tr key={job._id} className="hover:bg-dark-800/30 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-dark-700 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-dark-300">{job.company?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-medium text-white">{job.company}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-dark-300">{job.role}</td>
                    <td className="px-4 py-4">
                      <span className={statusBadge[job.status] || 'badge bg-dark-600 text-dark-300'}>{job.status}</span>
                    </td>
                    <td className="px-4 py-4 text-sm text-dark-400 hidden md:table-cell">{job.location || '—'}</td>
                    <td className="px-4 py-4 text-sm text-dark-400 hidden sm:table-cell">
                      {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(job)}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job._id)}
                          disabled={deleting === job._id}
                          className="p-1.5 rounded-lg text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          {deleting === job._id
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {STATUSES.filter(s => s !== 'All').map(status => {
              const statusJobs = filtered.filter(j => j.status === status);
              return (
                <div key={status} className="flex-1 min-w-[280px] sm:min-w-[320px] snap-center">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-semibold text-dark-200 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        status === 'Applied' ? 'bg-primary-500' :
                        status === 'Interview' ? 'bg-yellow-500' :
                        status === 'Offer' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {status}
                    </h3>
                    <span className="text-xs text-dark-400 bg-dark-700/50 px-2 py-0.5 rounded-full">
                      {statusJobs.length}
                    </span>
                  </div>
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`bg-dark-800/20 backdrop-blur-sm border border-dark-700/30 rounded-xl p-3 min-h-[400px] transition-colors ${
                          snapshot.isDraggingOver ? 'bg-dark-700/20 border-dark-600/50' : ''
                        }`}
                      >
                        {statusJobs.map((job, index) => (
                          <Draggable key={job._id} draggableId={job._id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-dark-800 border border-dark-700 rounded-lg p-4 mb-3 transition-all ${
                                  snapshot.isDragging ? 'shadow-xl shadow-black/40 scale-105 border-primary-500/50 z-50' : 'hover:border-dark-600 hover:-translate-y-0.5 group'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-dark-700 flex items-center justify-center shrink-0">
                                      <span className="text-[10px] font-bold text-dark-300">{job.company?.[0]?.toUpperCase()}</span>
                                    </div>
                                    <h4 className="text-sm font-medium text-white truncate max-w-[140px]">{job.company}</h4>
                                  </div>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(job)} className="p-1 text-dark-400 hover:text-primary-400"><Edit2 className="w-3.5 h-3.5"/></button>
                                  </div>
                                </div>
                                <p className="text-xs text-dark-300 mb-3 truncate">{job.role}</p>
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-dark-700/50">
                                  <span className="text-[10px] text-dark-500 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(job.dateApplied).toLocaleDateString()}
                                  </span>
                                  {job.salary && (
                                    <span className="text-[10px] text-green-400/80 bg-green-500/10 px-1.5 py-0.5 rounded">
                                      {job.salary}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {statusJobs.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-full flex flex-col items-center justify-center text-dark-500 py-10 opacity-50">
                            <p className="text-xs font-medium border border-dashed border-dark-600 rounded-lg px-4 py-6 w-full text-center">
                              Drop here
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}

      {/* Modal */}
      {showModal && (
        <JobModal
          job={modalJob}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}


