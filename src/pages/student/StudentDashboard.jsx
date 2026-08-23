import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import VirtualIDCard from './VirtualIDCard';
import AttendanceClient from './AttendanceClient';
import GrievanceDrawer from './GrievanceDrawer';
import NotesFeed from './NotesFeed';
import { getSubjectsList } from '../../data/syllabusData';
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
  ShieldCheck,
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { broadcasts, timetables, syllabusProgress } = useData();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'idcard' | 'timetable' | 'notes' | 'grievance'

  const tabs = [
    { id: 'attendance', label: 'Smart BLE Attendance', icon: Radio, badge: 'Live Radar & Calendar', color: 'text-indigo-600 bg-indigo-50' },
    { id: 'idcard', label: 'Virtual ID Pass', icon: QrCode, badge: '3D Hologram & QR', color: 'text-sky-600 bg-sky-50' },
    { id: 'timetable', label: 'Class Timetable', icon: Calendar, badge: `${currentUser?.section || 'CSE-A'} Schedule`, color: 'text-purple-600 bg-purple-50' },
    { id: 'notes', label: 'Notes & Faculty', icon: BookOpen, badge: 'PDF Vault & Chat', color: 'text-emerald-600 bg-emerald-50' },
    { id: 'grievance', label: 'Grievance Desk', icon: AlertTriangle, badge: 'Anonymous Triage', color: 'text-rose-600 bg-rose-50' }
  ];

  // Find matching section timetable
  const currentSection = currentUser?.section || 'CSE-A';
  const matchedTimetable = timetables.find(t => 
    t.section === currentSection || 
    t.section?.toLowerCase().includes(currentSection.toLowerCase()) ||
    t.section === 'Section-S2' ||
    t.section === 'Section-A4'
  ) || timetables[0];

  const subjects = getSubjectsList(currentUser?.department || 'Computer Science & Engineering (CSE)', currentUser?.semester || '3rd Semester (Year 2)');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl overflow-hidden glass-panel-elevated border border-slate-200 shadow-xl bg-white/90">
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
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {currentUser?.section}
                </span>
                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {currentUser?.college || 'College Affiliation'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
                Welcome back, {currentUser?.name?.split(' ')[0] || 'Scholar'} 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentUser?.department} • {currentUser?.semester}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Attendance Ledger</span>
              <div className="text-lg font-black text-indigo-600 mt-0.5">{currentUser?.attendanceOverall || 88.4}%</div>
              <span className="text-[10px] text-emerald-600 font-semibold">✓ Exam Eligible</span>
            </div>

            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Current CGPA</span>
              <div className="text-lg font-black text-indigo-600 mt-0.5">{currentUser?.cgpa || '8.92'}</div>
              <span className="text-[10px] text-slate-500">Top 5% Rank</span>
            </div>

            <div className="flex-1 lg:flex-none p-3.5 px-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 shadow-xs text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Venue</span>
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
        <div className="p-3.5 px-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-center justify-between gap-3 text-xs shadow-xs animate-fadeIn">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
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
                  : 'glass-panel hover:bg-white hover:border-slate-300 hover:shadow-xs'
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
        {activeTab === 'notes' && <NotesFeed />}
        {activeTab === 'grievance' && <GrievanceDrawer />}
        
        {/* Class Timetable & Syllabus Progress Tracker */}
        {activeTab === 'timetable' && (
          <div className="space-y-6">
            
            {/* Header */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {matchedTimetable.university || 'GGSIPU'} Schedule
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">{matchedTimetable.roomNo || 'Room AB4-205'}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {matchedTimetable.department} — {matchedTimetable.section} Timetable
                  </h2>
                  <p className="text-xs text-slate-500">
                    {matchedTimetable.campus || 'Main Campus'} • {matchedTimetable.effectiveDate || 'w.e.f. Aug 2026'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">HOD / Incharge</span>
                  <span className="font-bold text-slate-800">{matchedTimetable.timeTableIncharge || matchedTimetable.hodName || 'Dr. Megha Gupta'}</span>
                </div>
              </div>

              {/* Weekly Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="p-3 bg-slate-100 w-20 text-center font-bold">Day</th>
                      {matchedTimetable.timeSlots?.map((slot, i) => (
                        <th key={i} className="p-3 text-center border-l border-slate-200 font-mono text-[10px]">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {matchedTimetable.days?.map(day => (
                      <tr key={day} className="hover:bg-slate-50/70 transition">
                        <td className="p-3 font-black bg-slate-50/80 text-center text-slate-900 border-r border-slate-200">
                          {day}
                        </td>
                        {matchedTimetable.schedule?.[day]?.map((period, pIdx) => {
                          const isBreak = period.type === 'break';
                          const isLab = period.type === 'lab';
                          const isLecture = period.type === 'lecture';

                          return (
                            <td 
                              key={pIdx} 
                              className={`p-2.5 text-center border-l border-slate-100 text-[11px] ${
                                isBreak ? 'bg-amber-50/40 text-amber-800 font-bold' : isLab ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <span className={`font-bold block line-clamp-1 ${isLab ? 'text-indigo-700' : 'text-slate-900'}`}>
                                {period.subject}
                              </span>
                              {period.faculty && (
                                <span className="text-[10px] text-slate-500 block line-clamp-1">
                                  {period.faculty}
                                </span>
                              )}
                              {period.room && (
                                <span className="text-[9px] font-mono text-slate-400 block">
                                  {period.room}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Course Curriculum & Syllabus Progress Tracker */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Semester Course Modules & Faculty Syllabus Coverage
                    </h3>
                    <p className="text-xs text-slate-500">Live syllabus completion tracked by assigned faculty members</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((sub, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{sub.code}: {sub.name}</span>
                      <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                        {sub.credits}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Syllabus Coverage</span>
                        <span className="font-black text-emerald-600">75% Complete</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {sub.units?.map((u, uIdx) => (
                        <span key={uIdx} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-700">
                          Unit {uIdx + 1}: {u}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
