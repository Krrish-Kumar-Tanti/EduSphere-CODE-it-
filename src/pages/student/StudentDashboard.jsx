import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import VirtualIDCard from './VirtualIDCard';
import AttendanceClient from './AttendanceClient';
import GrievanceDrawer from './GrievanceDrawer';
import NotesFeed from './NotesFeed';
import { 
  QrCode, 
  Radio, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  Award, 
  Bell, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { broadcasts, activeSession } = useData();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'idcard' | 'grievance' | 'notes'

  const tabs = [
    { id: 'attendance', label: 'DTU BLE Attendance', icon: Radio, badge: 'Live Class', color: 'text-cyan-400' },
    { id: 'idcard', label: 'Virtual ID Pass', icon: QrCode, badge: 'Rotating QR', color: 'text-indigo-400' },
    { id: 'grievance', label: 'Double Triage Desk', icon: AlertTriangle, badge: 'Anonymous', color: 'text-rose-400' },
    { id: 'notes', label: 'Notes & Faculty', icon: BookOpen, badge: 'PDF Vault', color: 'text-emerald-400' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-cyan-950/30">
        
        {/* Glow orb in corner */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {currentUser?.enrollment}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentUser?.section}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Welcome back, {currentUser?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                {currentUser?.department} • {currentUser?.semester}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Overall Attendance</span>
              <span className="text-lg sm:text-xl font-black text-cyan-400">88.4%</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Eligible for Exams</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Current CGPA</span>
              <span className="text-lg sm:text-xl font-black text-indigo-400">{currentUser?.cgpa || '8.92'}</span>
              <span className="text-[10px] text-slate-400 block">Top 5% Rank</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Class</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Lab 204
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Live Broadcast Marquee Banner if any urgent announcements */}
      {broadcasts.length > 0 && broadcasts[0].isUrgent && (
        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Bell className="w-4 h-4" />
            </span>
            <span className="font-bold text-rose-200">{broadcasts[0].title}:</span>
            <span className="text-slate-300 line-clamp-1">{broadcasts[0].message}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap hidden sm:inline">
            {broadcasts[0].time}
          </span>
        </div>
      )}

      {/* Main Feature Tabs Navigation */}
      <div className="flex overflow-x-auto pb-1 gap-3 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[200px] p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between ${
                isActive
                  ? 'bg-slate-900 border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{tab.label}</span>
                  <span className="text-[10px] text-slate-400">{tab.badge}</span>
                </div>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div className="transition-all animate-fadeIn">
        {activeTab === 'attendance' && <AttendanceClient />}
        {activeTab === 'idcard' && <VirtualIDCard />}
        {activeTab === 'grievance' && <GrievanceDrawer />}
        {activeTab === 'notes' && <NotesFeed />}
      </div>

    </div>
  );
}
