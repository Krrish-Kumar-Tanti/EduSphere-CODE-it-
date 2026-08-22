import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { AlertTriangle, Radio, X, Volume2, ShieldAlert } from 'lucide-react';

export default function GlobalAlertBanner() {
  const { broadcasts } = useData();
  const [dismissedIds, setDismissedIds] = useState([]);

  // Find the latest urgent broadcast that hasn't been dismissed
  const urgentBroadcast = broadcasts.find(
    b => (b.isUrgent === true || b.isUrgent === 1 || b.priority === 'Urgent') && !dismissedIds.includes(b.id)
  );

  if (!urgentBroadcast) return null;

  const handleDismiss = () => {
    setDismissedIds(prev => [...prev, urgentBroadcast.id]);
  };

  return (
    <div className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white px-4 py-3 shadow-lg border-b border-rose-800 animate-fadeIn flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0 max-w-5xl mx-auto w-full">
        
        <div className="flex-shrink-0 flex items-center justify-center p-2 rounded-2xl bg-white/20 text-white ring-2 ring-white/30 animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-rose-700 font-mono shadow-xs">
              🚨 CAMPUS EMERGENCY BROADCAST
            </span>
            <span className="text-[10px] font-semibold text-rose-100 bg-rose-900/40 px-2 py-0.5 rounded-full border border-rose-400/30">
              Target: {urgentBroadcast.targetAudience || 'All Campus'}
            </span>
            <span className="text-[10px] text-rose-200 font-mono hidden sm:inline">
              • {urgentBroadcast.time || 'Just now'}
            </span>
          </div>

          <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
            {urgentBroadcast.title}
          </h4>
          <p className="text-xs text-rose-100 line-clamp-1 font-medium mt-0.5">
            {urgentBroadcast.message}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition self-center"
          title="Dismiss emergency banner"
        >
          <X className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
