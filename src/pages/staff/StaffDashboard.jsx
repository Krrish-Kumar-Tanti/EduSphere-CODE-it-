import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  PhoneCall
} from 'lucide-react';

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const { grievances, updateGrievanceStatus } = useData();
  const [activeDomain, setActiveDomain] = useState('All');

  const staffDomains = [
    'All',
    'Maintenance',
    'Cleaning & Hygiene',
    'Emergency Medical',
    'Anti-Bullying Hotline',
    'Admission Cell'
  ];

  const staffTickets = grievances.filter(g => g.destination === 'staff');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Ground Operations Staff
              </span>
              <span className="text-xs text-slate-400">{currentUser?.badgeLevel}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">{currentUser?.name}</h1>
            <p className="text-xs text-slate-400">{currentUser?.department}</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-3">
          <PhoneCall className="w-5 h-5 text-amber-400 animate-bounce" />
          <div>
            <span className="font-bold block">Campus Emergency Hotline</span>
            <span>Internal Ext: 108 / 112 (Active 24x7)</span>
          </div>
        </div>
      </div>

      {/* Domain Filter Pills */}
      <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none">
        {staffDomains.map((domain) => (
          <button
            key={domain}
            onClick={() => setActiveDomain(domain)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeDomain === domain
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Live Ticket Inbox */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-amber-400" />
          Active Service & Maintenance Requests
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffTickets.map((ticket) => (
            <div key={ticket.id} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{ticket.id}</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">{ticket.title}</h4>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  ticket.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {ticket.status}
                </span>
              </div>

              <p className="text-slate-300">{ticket.description}</p>

              {ticket.imageUrl && (
                <img src={ticket.imageUrl} alt="Proof" className="h-28 w-full object-cover rounded-xl border border-slate-700" />
              )}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Lodged: {ticket.timestamp}</span>
                
                {ticket.status !== 'Resolved' ? (
                  <button
                    onClick={() => updateGrievanceStatus(ticket.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Resolved</span>
                  </button>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
