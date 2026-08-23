import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Wrench, 
  Bell, 
  LogOut, 
  Sparkles, 
  X,
  Building2,
  MessageCircle
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { broadcasts, openDirectChat, facultyDirectory, directMessages } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return { label: 'Student Scholar', color: 'bg-indigo-600 text-white', icon: GraduationCap, text: 'text-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'teacher':
        return { label: 'Faculty Member', color: 'bg-emerald-600 text-white', icon: UserCheck, text: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'hod':
        return { label: 'HOD Executive', color: 'bg-purple-600 text-white', icon: ShieldCheck, text: 'text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'staff':
        return { label: 'Operations Staff', color: 'bg-amber-600 text-white', icon: Wrench, text: 'text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Campus Member', color: 'bg-slate-700 text-white', icon: Sparkles, text: 'text-slate-600', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);
  const RoleIcon = badge?.icon || Sparkles;

  const handleOpenMessenger = () => {
    const myId = currentUser?.id || currentUser?.enrollment;
    const myName = currentUser?.name?.toLowerCase().trim();

    // 1. If there's a recent message thread for this user, open that partner!
    const recentMsg = [...(directMessages || [])].reverse().find(m => 
      m.senderId === myId || m.recipientId === myId || 
      (myName && (m.senderName?.toLowerCase().trim() === myName || m.recipientName?.toLowerCase().trim() === myName))
    );

    if (recentMsg && openDirectChat) {
      const isSender = (recentMsg.senderId === myId || recentMsg.senderName?.toLowerCase().trim() === myName);
      const partnerId = isSender ? (recentMsg.recipientId || recentMsg.receiverId) : recentMsg.senderId;
      const partnerName = isSender ? (recentMsg.recipientName || recentMsg.receiverName) : recentMsg.senderName;
      const partnerRole = isSender ? (recentMsg.recipientRole || recentMsg.receiverRole) : recentMsg.senderRole;
      const partnerAvatar = isSender ? recentMsg.recipientAvatar : recentMsg.senderAvatar;

      openDirectChat({
        id: partnerId,
        enrollment: partnerId,
        name: partnerName,
        role: partnerRole || (currentUser?.role === 'teacher' ? 'student' : 'teacher'),
        avatar: partnerAvatar,
        designation: partnerRole === 'student' ? 'Student Scholar' : 'Faculty Member'
      });
      return;
    }

    // 2. Role-specific smart defaults:
    if (currentUser?.role === 'teacher' && openDirectChat) {
      openDirectChat({
        id: '04214802722',
        enrollment: '04214802722',
        name: 'Krrish Kumar Tanti',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        designation: 'Student Scholar'
      });
      return;
    }

    const defaultPartner = facultyDirectory?.find(f => f.id !== myId) || {
      id: 'FAC-1092',
      name: 'Dr. Manish Verma',
      role: 'teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      designation: 'Associate Professor'
    };
    if (openDirectChat) {
      openDirectChat(defaultPartner);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-indigo-700 shadow-md shadow-indigo-200 text-white">
            <GraduationCap className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                EduSphere
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                v2.0 OS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              Smart Campus Operating System
            </p>
          </div>
        </div>

        {/* Center: Authenticated User Identity Pill */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 shadow-2xs">
            <img 
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'} 
              alt={currentUser.name} 
              className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-2xs"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5" />
                {currentUser.department?.split('(')[0]?.trim() || currentUser.college?.split('(')[0]?.trim() || 'Campus'}
              </span>
            </div>
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.badgeBg} border shadow-2xs ml-1`}>
              <RoleIcon className="w-3 h-3" />
              <span>{badge.label}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Online Live Mesh" />
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Direct WhatsApp-Style Chat Launcher */}
          {currentUser && (
            <button
              onClick={handleOpenMessenger}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition shadow-2xs flex items-center gap-1.5 text-xs font-bold"
              title="1-on-1 Direct Chat"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Direct Chat</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-2xs"
              title="Campus Broadcasts & Alerts"
            >
              <Bell className="w-4 h-4" />
              {broadcasts.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3.5 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Campus Broadcast Feed</span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                      {broadcasts.length} Live
                    </span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                    title="Close notifications"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2 mt-2 max-h-72 overflow-y-auto pr-1">
                  {broadcasts.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">No new broadcast notifications.</p>
                  ) : (
                    broadcasts.map(bc => (
                      <div key={bc.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs hover:bg-slate-100/70 transition">
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span className="line-clamp-1">{bc.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal ml-2 shrink-0">{bc.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{bc.message}</p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-indigo-600 font-semibold">From {bc.sender}</span>
                          {bc.targetAudience && (
                            <span className="text-slate-400 font-medium">{bc.targetAudience}</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Exit / Log Out */}
          {currentUser && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shadow-2xs"
              title="Log Out of Smart Campus OS"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
