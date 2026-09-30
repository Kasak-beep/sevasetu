import React from 'react';
import { X, MapPin, Calendar, User, UserCheck, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function ComplaintDetailModal({ complaint, onClose }) {
  if (!complaint) return null;

  const steps = [
    { title: 'Ticket Submitted', date: complaint.createdAt, done: true },
    { title: 'Ward Auto-Routed', date: complaint.createdAt, done: true },
    { title: 'Technician Assigned', date: complaint.updatedAt, done: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(complaint.status) },
    { title: 'Grievance Resolved', date: complaint.status === 'RESOLVED' ? complaint.updatedAt : null, done: complaint.status === 'RESOLVED' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {complaint.category?.name || 'Municipal Grievance'}
          </span>
          <span className="text-xs text-slate-400 font-mono">ID #{complaint.id}</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-3 leading-snug">{complaint.title}</h2>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-6 border-b border-slate-800/80 mb-6">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-indigo-400" />
            {complaint.ward?.wardNumber || 'WARD-12'}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-purple-400" />
            {new Date(complaint.createdAt).toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4 text-emerald-400" />
            {complaint.citizen?.firstName} {complaint.citizen?.lastName || 'Citizen'}
          </span>
        </div>

        {/* Photo Image Attachment */}
        {complaint.photoUrl && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-slate-700/80 max-h-72">
            <img src={complaint.photoUrl} alt="Evidence photo" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description & Notes</h4>
          <p className="text-sm text-slate-200 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 leading-relaxed font-light">
            {complaint.description}
          </p>
        </div>

        {/* Assigned Technician */}
        <div className="mb-6 glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned Technician</p>
              <p className="text-sm font-bold text-white">
                {complaint.assignedWorker ? `${complaint.assignedWorker.firstName} ${complaint.assignedWorker.lastName}` : 'Pending Dispatch'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            SLA: 24h Guarantee
          </span>
        </div>

        {/* Resolution Timeline */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Live Resolution Timeline</h4>
          <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {steps.map((st, i) => (
              <div key={i} className="flex items-start gap-4 relative z-10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${st.done ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-900 border border-slate-700 text-slate-500'}`}>
                  {st.done ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${st.done ? 'text-white' : 'text-slate-500'}`}>{st.title}</p>
                  {st.date && <p className="text-[11px] text-slate-400 font-mono">{new Date(st.date).toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
