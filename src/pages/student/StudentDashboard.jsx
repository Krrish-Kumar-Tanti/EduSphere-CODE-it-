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
  const { broadcasts } = useData();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'idcard' | 'grievance' | 'notes'

  const tabs = [
    { id: 'attendance', label: 'Smart BLE Attendance', icon: Radio, badge: 'Live Class', color: 'text-indigo-600 bg-indigo-50' },
    { id: 'idcard', label: 'Virtual ID Pass', icon: QrCode, badge: 'Rotating QR', color: 'text-sky-600 bg-sky-50' },
    { id: 'grievance', label: 'Double Triage Desk', icon: AlertTriangle, badge: 'Anonymous', color: 'text-rose-600 bg-rose-50' },
    { id: 'notes', label: 'Notes & Faculty', icon: BookOpen, badge: 'PDF Vault', color: 'text-emerald-600 bg-emerald-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-panel-elevated border border-slate-200 shadow-xl bg-white/90">
        
        {/* Soft Ambient Corner Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shadow-indigo-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentUser?.enrollment}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {currentUser?.section}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Krrish'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentUser?.department} • {currentUser?.semester}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Overall Attendance</span>
              <div className="text-lg font-black text-indigo-600 mt-0.5">{currentUser?.attendanceOverall || 88.4}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">Eligible for Exams</span>
            </div>

            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current CGPA</span>
              <div className="text-lg font-black text-indigo-600 mt-0.5">{currentUser?.cgpa || '8.92'}</div>
              <span className="text-[10px] text-slate-500">Top 5% Rank</span>
            </div>

            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-sm text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Class</span>
              <div className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Lab 204
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Broadcast Flash Announcement */}
      {broadcasts.length > 0 && (
        <div className="p-3.5 px-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between gap-3 text-xs shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-rose-500 text-white">
              <Bell className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-rose-950">
              {broadcasts[0].title}:
            </span>
            <span className="text-rose-800 hidden md:inline">
              {broadcasts[0].message}
            </span>
          </div>
          <span className="text-[10px] text-rose-500 font-mono flex-shrink-0">
            {broadcasts[0].time}
          </span>
        </div>
      )}

      {/* Main Tab Navigation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 sm:p-5 rounded-3xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/10'
                  : 'glass-panel hover:bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-2xl ${tab.color} border border-slate-200/60`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                )}
              </div>

              <div>
                <span className="text-xs sm:text-sm font-black text-slate-900 block tracking-tight">
                  {tab.label}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block font-medium">
                  {tab.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="pt-2">
        {activeTab === 'attendance' && <AttendanceClient />}
        {activeTab === 'idcard' && <VirtualIDCard />}
        {activeTab === 'grievance' && <GrievanceDrawer />}
        {activeTab === 'notes' && <NotesFeed />}
      </div>

    </div>
  );
}
