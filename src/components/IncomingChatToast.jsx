import React from 'react';
import { useData } from '../context/DataContext';
import { MessageSquare, X, CornerDownLeft, Bell } from 'lucide-react';

export default function IncomingChatToast() {
  const { incomingChatToast, dismissIncomingToast, openDirectChat } = useData();

  if (!incomingChatToast) return null;

  const handleAccept = () => {
    openDirectChat({
      id: incomingChatToast.senderId,
      name: incomingChatToast.senderName,
      role: incomingChatToast.senderRole,
      avatar: incomingChatToast.senderAvatar,
      designation: incomingChatToast.senderRole === 'student' ? 'Student Scholar' : 'Faculty Member'
    });
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-3xl border border-emerald-500/40 shadow-2xl backdrop-blur-md animate-slideUp flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={incomingChatToast.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={incomingChatToast.senderName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-slate-900 animate-ping"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                🔔 Incoming Query
              </span>
              <span className="text-[10px] text-slate-400">• {incomingChatToast.time || 'Just now'}</span>
            </div>
            <h4 className="text-xs font-bold text-white leading-tight">
              {incomingChatToast.senderName} ({incomingChatToast.senderRole?.toUpperCase()})
            </h4>
          </div>
        </div>

        <button
          onClick={dismissIncomingToast}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-200 bg-white/5 p-2.5 rounded-2xl border border-white/10 leading-relaxed font-medium line-clamp-2">
        "{incomingChatToast.message}"
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>Accept & Reply</span>
        </button>

        <button
          onClick={dismissIncomingToast}
          className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs transition"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
