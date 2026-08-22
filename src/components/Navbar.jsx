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
  Layers, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, switchRole, logout } = useAuth();
  const { broadcasts } = useData();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student':
        return { label: 'Student Portal', color: 'from-cyan-500 to-blue-600', icon: GraduationCap, text: 'text-cyan-400', border: 'border-cyan-500/30' };
      case 'teacher':
        return { label: 'Faculty Portal', color: 'from-emerald-500 to-teal-600', icon: UserCheck, text: 'text-emerald-400', border: 'border-emerald-500/30' };
      case 'hod':
        return { label: 'HOD Console', color: 'from-purple-500 to-indigo-600', icon: ShieldCheck, text: 'text-purple-400', border: 'border-purple-500/30' };
      case 'staff':
        return { label: 'Ground Staff', color: 'from-amber-500 to-orange-600', icon: Wrench, text: 'text-amber-400', border: 'border-amber-500/30' };
      default:
        return { label: 'Portal', color: 'from-slate-500 to-slate-600', icon: Sparkles, text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);
  const RoleIcon = badge.icon;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <GraduationCap className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-300 bg-clip-text text-transparent">
                EduSphere
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                v2.0 MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
              Smart Campus Operating System
            </p>
          </div>
        </div>

        {/* Center: Live Role Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 shadow-inner">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${badge.color} text-white shadow-md`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
          <span className="text-xs text-slate-300 font-medium px-2">
            {currentUser?.name}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Switcher Dropdown (Crucial for Hackathon Demos) */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/60 text-xs font-medium text-slate-200 transition shadow-sm hover:border-cyan-500/40"
              title="Switch demo role instantly"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Demo Switcher</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-2xl">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Select Live Persona (1-Click)
                </div>
                
                <div className="space-y-1 mt-1">
                  {[
                    { role: 'student', label: 'Krrish (Student)', sub: 'B.Tech CSE 3rd Year', icon: GraduationCap, color: 'text-cyan-400' },
                    { role: 'teacher', label: 'Dr. Manish (Faculty)', sub: 'OS & Networks Dept.', icon: UserCheck, color: 'text-emerald-400' },
                    { role: 'hod', label: 'Prof. Naitik (HOD)', sub: 'CSE Department Head', icon: ShieldCheck, color: 'text-purple-400' },
                    { role: 'staff', label: 'Rajesh (Ground Staff)', sub: 'Maintenance & Facilities', icon: Wrench, color: 'text-amber-400' }
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = currentUser?.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchRole(item.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                          isActive 
                            ? 'bg-slate-800/90 text-white border border-slate-700' 
                            : 'hover:bg-slate-800/50 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg bg-slate-800 ${item.color}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-100">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.sub}</p>
                          </div>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleMenu(false);
              }}
              className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="Announcements & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-3 z-50 backdrop-blur-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-200">Campus Broadcast Feed</span>
                  <span className="text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">
                    {broadcasts.length} Active
                  </span>
                </div>
                
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {broadcasts.map(bc => (
                    <div key={bc.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-100">
                        <span>{bc.title}</span>
                        <span className="text-[10px] text-slate-500">{bc.time}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1 line-clamp-2">{bc.message}</p>
                      <div className="mt-1.5 text-[10px] text-cyan-400/80 font-medium">
                        By {bc.sender}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium transition"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>

        </div>
      </div>
    </header>
  );
}
