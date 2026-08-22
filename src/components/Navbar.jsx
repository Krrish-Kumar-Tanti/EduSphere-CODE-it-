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
        return { label: 'Student Portal', color: 'bg-indigo-600 text-white', icon: GraduationCap, text: 'text-indigo-600', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'teacher':
        return { label: 'Faculty Portal', color: 'bg-emerald-600 text-white', icon: UserCheck, text: 'text-emerald-600', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'hod':
        return { label: 'HOD Console', color: 'bg-purple-600 text-white', icon: ShieldCheck, text: 'text-purple-600', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'staff':
        return { label: 'Ground Staff', color: 'bg-amber-600 text-white', icon: Wrench, text: 'text-amber-600', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Portal', color: 'bg-slate-700 text-white', icon: Sparkles, text: 'text-slate-600', badgeBg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);
  const RoleIcon = badge.icon;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-sky-600 to-indigo-700 shadow-md shadow-indigo-200">
            <GraduationCap className="w-5 h-5 text-white" />
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
                v2.0 MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              Smart Campus Operating System
            </p>
          </div>
        </div>

        {/* Center: Live Role Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${badge.color} shadow-sm`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{badge.label}</span>
          </div>
          <span className="text-xs text-slate-700 font-semibold px-2">
            {currentUser?.name}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-sm hover:border-slate-300"
              title="Switch demo persona"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Role Switcher</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Live Persona (1-Click)
                </div>
                
                <div className="space-y-1 mt-1">
                  {[
                    { role: 'student', label: 'Krrish (Student)', sub: 'B.Tech CSE 3rd Year', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
                    { role: 'teacher', label: 'Dr. Manish (Faculty)', sub: 'Assigned to Manish', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
                    { role: 'hod', label: 'Prof. Naitik (HOD)', sub: 'Assigned to Manish', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50' },
                    { role: 'staff', label: 'Rajesh (Ground Staff)', sub: 'Assigned to Manish', icon: Wrench, color: 'text-amber-600 bg-amber-50' }
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
                            ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-200 font-semibold' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg border border-slate-200/60 ${item.color}`}>
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{item.label}</p>
                            <p className="text-[10px] text-slate-500">{item.sub}</p>
                          </div>
                        </div>
                        {isActive && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
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
              className="relative p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition shadow-sm"
              title="Announcements & Alerts"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Campus Broadcast Feed</span>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                    {broadcasts.length} Active
                  </span>
                </div>
                
                <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                  {broadcasts.map(bc => (
                    <div key={bc.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{bc.title}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{bc.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{bc.message}</p>
                      <div className="mt-1.5 text-[10px] text-indigo-600 font-semibold">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition shadow-sm"
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
