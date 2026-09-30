import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  AlertTriangle, 
  Lightbulb, 
  Trash2, 
  Droplet, 
  Layers, 
  Building2, 
  X, 
  Upload, 
  Search, 
  MapPin, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { ComplaintServiceApi } from '../api';

export default function CitizenDashboard({ user, onSelectComplaint, preselectedCategory }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(Boolean(preselectedCategory));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // New Complaint Submission Modal State (Matches reference image)
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    category: preselectedCategory || 'Roads & Potholes',
    wardNumber: user?.wardNumber || 'WARD-12',
    file: null,
    filePreview: null
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, [user]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const data = await ComplaintServiceApi.getComplaintsByCitizen(user?.id || 1);
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewComplaint({
        ...newComplaint,
        file: file,
        filePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', newComplaint.title);
      formData.append('description', newComplaint.description);
      formData.append('category', newComplaint.category);
      if (newComplaint.file) {
        formData.append('file', newComplaint.file);
      }

      await ComplaintServiceApi.createComplaint(formData, user?.id || 1);
      setShowCreateModal(false);
      setNewComplaint({
        title: '',
        description: '',
        category: 'Roads & Potholes',
        wardNumber: user?.wardNumber || 'WARD-12',
        file: null,
        filePreview: null
      });
      fetchComplaints();
    } catch (err) {
      console.error('Failed to submit complaint', err);
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { id: 'roads', name: 'Roads & Potholes', icon: AlertTriangle },
    { id: 'lighting', name: 'Streetlights', icon: Lightbulb },
    { id: 'garbage', name: 'Garbage & Sanitation', icon: Trash2 },
    { id: 'water', name: 'Water Supply', icon: Droplet },
    { id: 'drainage', name: 'Drainage', icon: Layers },
    { id: 'public', name: 'Public Infrastructure', icon: Building2 }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Resolved</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30">In Progress</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Assigned</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300 border border-slate-600">Submitted</span>;
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      
      {/* Top Header matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-orange-400 font-semibold">{user?.firstName || 'Citizen'}</span> • Assigned Ward: <span className="text-slate-200 font-semibold">{user?.wardNumber || 'WARD-12'}</span>
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2.5 text-xs font-bold text-white btn-orange rounded-lg shadow-lg flex items-center gap-2 self-start sm:self-auto"
        >
          <FilePlus className="w-4 h-4" />
          File a Complaint Now
        </button>
      </div>

      {/* 2x3 Grid of Category Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => {
                setNewComplaint({ ...newComplaint, category: cat.name });
                setShowCreateModal(true);
              }}
              className="bg-[#1b1f2b] bg-dark-card-hover border border-slate-800 p-6 rounded-2xl cursor-pointer flex flex-col items-center text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6 text-slate-800" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors">
                {cat.name}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Tracker Section Header */}
      <div className="flex items-center justify-between mb-4 pt-4 border-t border-slate-800">
        <h2 className="text-xl font-bold text-white">My Filed Complaints</h2>
        <button onClick={fetchComplaints} className="p-2 text-slate-400 hover:text-white" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {['ALL', 'SUBMITTED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              selectedStatus === st
                ? 'bg-orange-600 text-white border-orange-500'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Grievances List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredComplaints.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectComplaint(item)}
            className="bg-[#1b1f2b] border border-slate-800 p-5 rounded-2xl cursor-pointer hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              {getStatusBadge(item.status)}
              <span className="text-[11px] text-slate-400 font-mono">#{item.id}</span>
            </div>
            <h4 className="text-base font-bold text-white line-clamp-1 mb-1">{item.title}</h4>
            <p className="text-xs text-slate-400 line-clamp-2 mb-3">{item.description}</p>
            {item.photoUrl && (
              <img src={item.photoUrl} alt="Complaint image" className="w-full h-32 object-cover rounded-lg mb-3" />
            )}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-orange-400" /> {item.ward?.wardNumber || 'WARD-12'}</span>
              <span className="text-orange-400 font-semibold flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Details</span>
            </div>
          </div>
        ))}
      </div>

      {/* NEW COMPLAINT SUBMISSION MODAL (Exact match to reference mockup image) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#1a1d27] p-6 rounded-2xl border border-slate-700 shadow-2xl">
            
            {/* Header matching image */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-white">New Complaint Submission</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-5">
              New Complaint Submitted: <span className="text-orange-400 font-semibold">{newComplaint.category}</span>
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Select Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Category (e.g. 01. Roads & Potholes)</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                  className="w-full bg-[#12141c] border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Roads & Potholes">01. Roads & Potholes</option>
                  <option value="Streetlights">02. Streetlights</option>
                  <option value="Garbage & Sanitation">03. Garbage & Sanitation</option>
                  <option value="Water Supply">04. Water Supply</option>
                  <option value="Drainage">05. Drainage</option>
                  <option value="Public Infrastructure">06. Public Infrastructure</option>
                </select>
              </div>

              {/* Complaint Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Complaint Title</label>
                <input
                  type="text"
                  required
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  placeholder="Complaint Title"
                  className="w-full bg-[#12141c] border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Description"
                  className="w-full bg-[#12141c] border border-slate-700 rounded-lg py-2.5 px-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Upload Photo Evidence */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Upload Photo Evidence</label>
                <div className="flex items-center gap-3 bg-[#12141c] border border-slate-700 rounded-lg p-2.5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Orange Full-width Submit Complaint button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 mt-2 rounded-lg text-sm font-bold btn-orange shadow-lg"
              >
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
