import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TicketInbox from './TicketInbox';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  PhoneCall,
  Users,
  Layers,
  MapPin,
  Flame,
  Radio,
  Zap,
  Activity
} from 'lucide-react';

export default function StaffDashboard() {
  const { currentUser } = useAuth();
  const { grievances } = useData();
  const [activeDomain, setActiveDomain] = useState('All');
  const [showHotlineModal, setShowHotlineModal] = useState(false);
  const [hotlineCalling, setHotlineCalling] = useState(false);

  const staffTickets = grievances.filter(g => g.destination === 'staff' || !g.destination);
  const openCount = staffTickets.filter(t => t.status !== 'Resolved').length;
  const inProgressCount = staffTickets.filter(t => t.status === 'In-Progress').length;
  const resolvedCount = staffTickets.filter(t => t.status === 'Resolved').length;

  const onDutySquad = [
    { name: 'Ramu K.', role: 'Senior Electrician', zone: 'Block A & B Labs', status: 'Active on Field' },
    { name: 'Suresh M.', role: 'Lead Plumber', zone: 'Block B & Cafeteria', status: 'Active on Field' },
    { name: 'Amit Verma', role: 'Network & Lab IT', zone: 'Central Library & Server Room', status: 'Standby' },
    { name: 'Dr. Kavita S.', role: 'Medical First Responder', zone: 'Campus Dispensary Block 1', status: 'Available 24x7' }
  ];

  const handleSimulateCall = () => {
    setHotlineCalling(true);
    setTimeout(() => {
      setHotlineCalling(false);
      alert('Emergency Dispatch Connected to Campus Security Nodal Desk (Ext: 108)');
      setShowHotlineModal(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  Ground Operations & Facilities
                </span>
                <span className="text-xs text-slate-500 font-semibold">{currentUser?.badgeLevel}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • ID: <span className="font-mono text-slate-700 font-bold">{currentUser?.id}</span>
              </p>
            </div>
          </div>

          {/* Emergency Hotline Trigger Box */}
          <div 
            onClick={() => setShowHotlineModal(true)}
            className="p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:border-amber-400 transition cursor-pointer shadow-xs flex items-center gap-3 w-full lg:w-auto"
          >
            <div className="p-3 rounded-xl bg-amber-100 text-amber-700">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Campus Emergency Hotline
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-[11px] text-amber-800 font-semibold mt-0.5">
                Internal Ext: <span className="font-bold font-mono">108 / 112</span> • Click to Trigger
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Ground Operations KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 font-bold block uppercase tracking-wider">Active Open Tickets</span>
            <span className="text-2xl font-black text-slate-900">{openCount} Incident{openCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-amber-800 font-bold block uppercase tracking-wider">In-Progress Repairs</span>
            <span className="text-2xl font-black text-amber-700">{inProgressCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider">Resolved Today</span>
            <span className="text-2xl font-black text-emerald-700">{resolvedCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] text-indigo-800 font-bold block uppercase tracking-wider">Avg Response Time</span>
            <span className="text-2xl font-black text-indigo-700">14.2 Mins</span>
          </div>
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
            <Zap className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Ticket Inbox & Domain Triage */}
      <TicketInbox activeDomain={activeDomain} setActiveDomain={setActiveDomain} />

      {/* On-Duty Field Squad Roster */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            On-Duty Ground Worker Squad & Active Zones
          </h3>
          <span className="text-xs text-slate-500 font-mono font-medium">Live Shift 08:00 - 20:00</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {onDutySquad.map((worker, index) => (
            <div key={index} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{worker.name}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {worker.status}
                </span>
              </div>
              <p className="text-amber-700 font-semibold">{worker.role}</p>
              <div className="flex items-center gap-1 text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span className="truncate">{worker.zone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotline Modal */}
      {showHotlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl space-y-5 text-center relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 animate-pulse" />
                Emergency Fast Dispatch
              </span>
              <button
                onClick={() => setShowHotlineModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 ring-4 ring-amber-200 animate-pulse">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-3">Campus Central SOS Hotline</h4>
              <p className="text-xs text-slate-500 mt-1">Connects to Campus Security, Medical First Responder & Electrician Dispatch</p>
              <span className="text-2xl font-black font-mono text-amber-700 mt-2">EXT: 108 / 112</span>
            </div>

            <button
              onClick={handleSimulateCall}
              disabled={hotlineCalling}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-xs"
            >
              {hotlineCalling ? (
                <span>Dialing Internal Gateway...</span>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Emergency Dispatch (Ext 108)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}


