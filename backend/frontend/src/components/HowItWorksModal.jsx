import React from 'react';
import { X, FilePlus, Building2, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function HowItWorksModal({ isOpen, onClose, onFileComplaint }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#181c28] p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-orange-500" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            Transparency Protocol
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">How SevaSetu Works</h2>
        <p className="text-xs text-slate-300 mb-6">
          Our platform connects citizens directly with municipal ward officers to ensure rapid, transparent civic resolution.
        </p>

        <div className="space-y-4 mb-6">
          {[
            { step: '01', title: 'File Grievance', desc: 'Submit issue details, select municipal ward, and attach photo evidence.', icon: FilePlus },
            { step: '02', title: 'Automated Routing', desc: 'Ticket is instantly routed to your local Ward Officer and logged on backend.', icon: Building2 },
            { step: '03', title: 'Technician Dispatch', desc: 'Municipal technician is assigned with a mandatory 24-hour SLA deadline.', icon: Clock },
            { step: '04', title: 'Resolution & Closure', desc: 'Work is inspected, photo proof uploaded, and ticket closed upon verification.', icon: CheckCircle2 }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-4 p-3.5 rounded-xl bg-[#11141e] border border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center justify-center flex-shrink-0 font-bold font-mono text-sm">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { onClose(); onFileComplaint(); }}
            className="w-full py-3 text-sm font-bold text-white bg-gradient-to-r from-[#f95716] to-[#ea4b0c] hover:from-[#ff6426] hover:to-[#f95716] rounded-xl shadow-lg"
          >
            File a Complaint Now
          </button>
        </div>

      </div>
    </div>
  );
}
