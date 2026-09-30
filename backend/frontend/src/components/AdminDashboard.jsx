import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Building2, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  Search, 
  RefreshCw,
  UserPlus,
  Edit3,
  MapPin,
  Eye,
  Check
} from 'lucide-react';
import { ComplaintServiceApi } from '../api';

export default function AdminDashboard({ onSelectComplaint }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWard, setSelectedWard] = useState('12');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Action Modals State
  const [assignModal, setAssignModal] = useState({ open: false, complaintId: null });
  const [workerIdInput, setWorkerIdInput] = useState('201');

  useEffect(() => {
    fetchAdminComplaints();
  }, [selectedWard]);

  const fetchAdminComplaints = async () => {
    setLoading(true);
    try {
      const data = await ComplaintServiceApi.getComplaintsByWard(selectedWard);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load admin complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ComplaintServiceApi.updateStatus(id, newStatus);
      fetchAdminComplaints();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAssignWorkerSubmit = async (e) => {
    e.preventDefault();
    if (!assignModal.complaintId) return;

    try {
      await ComplaintServiceApi.assignWorker(assignModal.complaintId, Number(workerIdInput));
      setAssignModal({ open: false, complaintId: null });
      fetchAdminComplaints();
    } catch (err) {
      console.error('Failed to assign worker', err);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.citizen?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl mb-8 border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="px-3 py-1 text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full">
              Municipal Administration Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Ward Grievance <span className="gradient-text">Command Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dispatch technicians, monitor SLA deadlines, and update grievance status across municipal wards.
          </p>
        </div>

        {/* Ward Selector & Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-2 rounded-2xl">
            <Building2 className="w-4 h-4 text-purple-400" />
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none"
            >
              <option value="12" className="bg-slate-900 text-white">Ward 12 (Central Market)</option>
              <option value="5" className="bg-slate-900 text-white">Ward 05 (North Extension)</option>
              <option value="8" className="bg-slate-900 text-white">Ward 08 (Civic Lines)</option>
            </select>
          </div>

          <button
            onClick={fetchAdminComplaints}
            className="p-3 text-slate-400 hover:text-white glass-panel rounded-2xl"
            title="Refresh Ward Data"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ward Complaints</p>
          <p className="text-3xl font-black text-white font-mono">{complaints.length}</p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">Pending Assignment</p>
          <p className="text-3xl font-black text-amber-300 font-mono">
            {complaints.filter(c => c.status === 'SUBMITTED').length}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">Active Dispatches</p>
          <p className="text-3xl font-black text-indigo-300 font-mono">
            {complaints.filter(c => ['ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length}
          </p>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Resolved Tickets</p>
          <p className="text-3xl font-black text-emerald-300 font-mono">
            {complaints.filter(c => c.status === 'RESOLVED').length}
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or citizen name..."
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints Table Container */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <th className="py-4 px-6">ID & Title</th>
                <th className="py-4 px-6">Citizen</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Assigned Technician</th>
                <th className="py-4 px-6">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs font-medium">
                    No complaints match current ward and status filter.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* ID & Title */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-purple-400 font-bold">#{c.id}</span>
                        <span className="font-semibold text-white line-clamp-1">{c.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{c.description}</p>
                    </td>

                    {/* Citizen Info */}
                    <td className="py-4 px-6">
                      <div className="text-xs">
                        <p className="font-semibold text-white">{c.citizen?.firstName || 'Citizen'} {c.citizen?.lastName}</p>
                        <p className="text-[11px] text-slate-400">{c.citizen?.email || 'Registered User'}</p>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-xs font-semibold rounded-xl py-1.5 px-3 text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value="SUBMITTED">SUBMITTED</option>
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>

                    {/* Assigned Worker */}
                    <td className="py-4 px-6 text-xs">
                      {c.assignedWorker ? (
                        <span className="flex items-center gap-1.5 text-indigo-300 font-medium">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          {c.assignedWorker.firstName} {c.assignedWorker.lastName}
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs font-semibold italic flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Unassigned
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAssignModal({ open: true, complaintId: c.id })}
                          className="px-3 py-1.5 text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          Assign
                        </button>

                        <button
                          onClick={() => onSelectComplaint(c)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Inspect Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Worker Modal */}
      {assignModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Assign Municipal Worker</h3>
            <p className="text-xs text-slate-400 mb-6">
              Select technician ID to dispatch for Ticket <span className="text-purple-300 font-mono font-bold">#{assignModal.complaintId}</span>.
            </p>

            <form onSubmit={handleAssignWorkerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Technician</label>
                <select
                  value={workerIdInput}
                  onChange={(e) => setWorkerIdInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="201">RAMESH KUMAR (Sanitation Specialist)</option>
                  <option value="202">SURESH PATEL (Road & Pothole Crew)</option>
                  <option value="203">ANIL SHARMA (Electrical & Lighting Engineer)</option>
                  <option value="204">VIJAY VERMA (Water Supply Inspector)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModal({ open: false, complaintId: null })}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-300 glass-panel rounded-xl hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Dispatch Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
