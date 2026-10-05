import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ExternalLink, 
  CheckCircle, 
  Gift, 
  Tag 
} from 'lucide-react';
import { studentOffers } from '../data/mockData';

export const StudentPerksView = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Curated Student & Young Professional Tier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Offers & Financial Aid</h1>
          <p className="text-sm text-slate-400 mt-1">Unlock over $3,500+ in verified software subscriptions, high-yield bank perks, and cloud grants</p>
        </div>
      </div>

      {/* Perks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {studentOffers.map((offer) => (
          <div 
            key={offer.id}
            className="glass-panel glass-panel-hover p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {offer.tag}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{offer.validity}</span>
              </div>

              <h3 className="text-base font-bold text-white mt-1">{offer.title}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">{offer.partner}</p>

              <p className="text-xs text-slate-300 leading-relaxed mt-3 bg-slate-950/50 p-3.5 rounded-2xl border border-slate-800/60">
                {offer.benefit}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Verified Active
              </span>

              <button 
                onClick={() => alert(`Redirecting to official partner verification: ${offer.title}`)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-all"
              >
                <span>{offer.linkText}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Advice Box */}
      <div className="p-6 rounded-3xl glass-panel border border-teal-500/20 bg-gradient-to-r from-teal-950/20 to-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-teal-400" />
            <span>Are you a university researcher or hackathon competitor?</span>
          </h4>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            You can combine AWS Educate and GitHub Student Pack to host full-stack hackathon prototypes with zero infrastructure costs.
          </p>
        </div>

        <button 
          onClick={() => alert("Verification guide unlocked!")}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 whitespace-nowrap"
        >
          View Verification Guide
        </button>
      </div>

    </div>
  );
};
