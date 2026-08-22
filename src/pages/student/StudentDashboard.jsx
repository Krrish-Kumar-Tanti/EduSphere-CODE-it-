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
    { id: 'attendance', label: 'DTU BLE Attendance', icon: Radio, badge: 'Live Class', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'idcard', label: 'Virtual ID Pass', icon: QrCode, badge: 'Rotating QR', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'grievance', label: 'Double Triage Desk', icon: AlertTriangle, badge: 'Anonymous', color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'notes', label: 'Notes & Faculty', icon: BookOpen, badge: 'PDF Vault', color: 'text-emerald-600', bg: 'bg-emerald-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {currentUser?.enrollment}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  {currentUser?.section}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Welcome back, {currentUser?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • {currentUser?.semester}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Overall Attendance</span>
              <span className="text-lg sm:text-xl font-black text-indigo-600">88.4%</span>
              <span className="text-[10px] text-emerald-700 block font-bold">Eligible for Exams</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Current CGPA</span>
              <span className="text-lg sm:text-xl font-black text-purple-600">{currentUser?.cgpa || '8.92'}</span>
              <span className="text-[10px] text-slate-500 block font-medium">Top 5% Rank</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Class</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Lab 204
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* Live Broadcast Marquee Banner if any urgent announcements */}
      {broadcasts.length > 0 && broadcasts[0].isUrgent && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <Bell className="w-4 h-4" />
            </span>
            <span className="font-bold text-rose-800">{broadcasts[0].title}:</span>
            <span className="text-slate-700 line-clamp-1 font-medium">{broadcasts[0].message}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap hidden sm:inline">
            {broadcasts[0].time}
          </span>
        </div>
      )}

      {/* Main Feature Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-white border-2 border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${tab.bg} ${tab.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{tab.label}</span>
                <span className="text-[10px] text-slate-500 font-medium">{tab.badge}</span>
              </div>
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

