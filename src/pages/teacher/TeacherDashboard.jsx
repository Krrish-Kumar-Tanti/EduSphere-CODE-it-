import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TakeAttendance from './TakeAttendance';
import NotesPublisher from './NotesPublisher';
import { 
  UserCheck, 
  Radio, 
  BookOpen, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Layers, 
  TrendingUp,
  Award,
  Bell,
  ChevronRight
} from 'lucide-react';

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { activeSession, notes, studentsRoster } = useData();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'notes' | 'schedule'

  const tabs = [
    { id: 'attendance', label: 'Attendance Studio', icon: Radio, badge: 'Live BLE Radar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'notes', label: 'Notes & Syllabus Vault', icon: BookOpen, badge: `${notes.length} Active Files`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'schedule', label: 'Faculty Timetable', icon: Calendar, badge: '3 Classes Today', color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const todaySchedule = [
    { time: '09:00 AM - 10:00 AM', subject: 'Cloud Computing & DevOps (CSE-305)', room: 'Room 304, Block B', section: 'CSE-6B', status: 'Completed' },
    { time: '02:00 PM - 04:00 PM', subject: 'Operating Systems Lab (CSE-301)', room: 'Lab 204, Block A', section: 'CSE-6A', status: 'Live Now' },
    { time: '04:15 PM - 05:15 PM', subject: 'Computer Networks Tutorial', room: 'Room 201, Block A', section: 'CSE-6A', status: 'Upcoming' }
  ];

  const presentCount = studentsRoster.filter(s => s.status === 'present').length;
  const attendanceRate = studentsRoster.length > 0 ? Math.round((presentCount / studentsRoster.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header Banner (Light Card matching Screenshot 1) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Faculty Portal
                </span>
                <span className="text-xs text-slate-500 font-semibold">{currentUser?.designation}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • ID: <span className="font-mono text-slate-700 font-semibold">{currentUser?.id}</span>
              </p>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Live Class Code</span>
              <span className="text-xl font-black font-mono text-emerald-600 tracking-wider">
                {activeSession.code}
              </span>
              <span className="text-[10px] text-emerald-700 block font-semibold flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Active Broadcast
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Class Attendance</span>
              <span className="text-xl font-black text-indigo-600">{attendanceRate}%</span>
              <span className="text-[10px] text-slate-500 block font-medium">{presentCount}/{studentsRoster.length} Present</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Notes Vault</span>
              <span className="text-xl font-black text-purple-600">{notes.length} Docs</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Published</span>
            </div>

          </div>

        </div>

      </div>

      {/* Main Tab Navigation Cards (Matching Screenshot 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex items-center justify-between ${
                isActive
                  ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/60 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${tab.bg} ${tab.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{tab.label}</span>
                  <span className="text-[10px] text-slate-500">{tab.badge}</span>
                </div>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="transition-all animate-fadeIn">
        {activeTab === 'attendance' && <TakeAttendance />}
        {activeTab === 'notes' && <NotesPublisher />}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    Today's Academic Schedule & Timetable
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Faculty load distribution for Dr. Manish Verma</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  Semester 6 (Academic Year 2026)
                </span>
              </div>

              <div className="space-y-3">
                {todaySchedule.map((slot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      slot.status === 'Live Now'
                        ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                        : slot.status === 'Completed'
                        ? 'bg-slate-50 border-slate-200/80 opacity-75'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`p-2.5 rounded-xl text-xs font-mono font-bold ${
                        slot.status === 'Live Now' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-500">{slot.time}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {slot.section}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{slot.subject}</h4>
                        <p className="text-xs text-slate-500">{slot.room}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        slot.status === 'Live Now'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5'
                          : slot.status === 'Completed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {slot.status === 'Live Now' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                        {slot.status}
                      </span>
                      {slot.status === 'Live Now' && (
                        <button
                          onClick={() => setActiveTab('attendance')}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1 shadow-xs"
                        >
                          <span>Open Radar</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
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


