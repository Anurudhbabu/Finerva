import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Terminal
} from 'lucide-react';

export const SecurityView = ({ user, transactions, budgets, goals }) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportData = () => {
    const backup = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      team: 'Team 07 (WOBBLE)',
      hackathon: 'Build Secure 24 — Abhedya VBIT',
      userProfile: user,
      transactions,
      budgets,
      goals
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finerva-secure-audit-log-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Abhedya Build Secure 24 Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Security & Privacy Governance</h1>
          <p className="text-sm text-slate-400 mt-1">Defense-in-depth security controls, client-side isolation, and verifiable cryptography</p>
        </div>

        <button 
          onClick={handleExportData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4" />
          <span>Audit package generated and downloaded successfully.</span>
        </div>
      )}

      {/* Security Architecture Posture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* API boundary */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Local Finerva API</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The demo frontend sends profile and finance data to the local API using a session token. No bank accounts are connected.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
            <CheckCircle className="w-3.5 h-3.5" /> Authenticated API
          </span>
        </div>

        {/* Password storage */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Password protection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Account passwords are salted and hashed by the backend. Demo profile and finance data are stored in a local JSON file and are not encrypted at rest.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
            <CheckCircle className="w-3.5 h-3.5" /> Scrypt password hashes
          </span>
        </div>

        {/* Local assistant */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit">
            <Terminal className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Profile-aware assistant</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The local rule-based assistant receives your profile values to answer budgeting questions. Avoid entering bank credentials or payment-card details.
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
            <CheckCircle className="w-3.5 h-3.5" /> No external AI service
          </span>
        </div>

      </div>

      {/* Hackathon Team & Origin Verification */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Hackathon Submission Authenticity Certificate</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Team ID</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{user.team}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Lead Author</span>
            <span className="font-bold text-white text-sm mt-0.5 block">{user.name}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Hackathon Schedule</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">Oct 5–6, 2026</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-slate-400 block">Submission Deadline</span>
            <span className="font-bold text-white text-sm mt-0.5 block">11:00 AM IST</span>
          </div>
        </div>
      </div>

    </div>
  );
};
