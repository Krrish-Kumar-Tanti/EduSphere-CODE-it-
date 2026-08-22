import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  ShieldCheck, 
  Users, 
  Send, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export default function HodDashboard() {
  const { currentUser } = useAuth();
  const { broadcasts, grievances } = useData();
  const [broadcastText, setBroadcastText] = useState('');
  const [showSignedSuccess, setShowSignedSuccess] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                HOD Command Console
              </span>
              <span className="text-xs text-slate-400">{currentUser?.cabin}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">{currentUser?.name}</h1>
            <p className="text-xs text-slate-400">{currentUser?.department}</p>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
          <span className="font-bold block">Department Metrics</span>
          <span>1,240 Enrolled • 32 Faculty • 98.2% Class Efficiency</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Teacher Substitution Matrix */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Teacher Substitution Matrix
          </h3>
          
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400">Absent Faculty: Prof. Vikram Seth</span>
              <span className="text-[10px] text-slate-400">CSE-304 (Algorithms) • 03:00 PM</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300">Auto-Assigned Substitute:</span>
              <span className="font-bold text-emerald-400">Dr. Manish Verma (Available)</span>
            </div>
          </div>
        </div>

        {/* Digital Signature & Approvals */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-purple-400" />
            Digital Signatures & Approvals
          </h3>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Tech Fest 2026 Budget Approval</span>
              <span className="text-[10px] text-slate-400">Requested by Krrish Kumar Tanti • ₹45,000</span>
            </div>

            <button
              onClick={() => setShowSignedSuccess(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign & Stamp</span>
            </button>
          </div>

          {showSignedSuccess && (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Digitally signed with cryptographic HOD RSA key!
            </p>
          )}
        </div>

      </div>

    </div>
  );
}
