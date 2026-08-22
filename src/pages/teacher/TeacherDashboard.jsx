import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { 
  UserCheck, 
  Radio, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles,
  QrCode,
  Share2
} from 'lucide-react';

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { activeSession, setActiveSession } = useData();

  // Mock live student attendance grid
  const [students, setStudents] = useState([
    { id: '1', roll: '04214802722', name: 'Krrish Kumar Tanti', status: 'present', bleRssi: '-42 dBm' },
    { id: '2', roll: '04214802723', name: 'Aryan Sharma', status: 'present', bleRssi: '-48 dBm' },
    { id: '3', roll: '04214802724', name: 'Priya Mukherjee', status: 'absent', bleRssi: 'Out of range' },
    { id: '4', roll: '04214802725', name: 'Rohan Gupta', status: 'leave', bleRssi: 'Approved Sick Leave' },
    { id: '5', roll: '04214802726', name: 'Sneha Patel', status: 'present', bleRssi: '-38 dBm' },
    { id: '6', roll: '04214802727', name: 'Devansh Verma', status: 'present', bleRssi: '-50 dBm' },
    { id: '7', roll: '04214802728', name: 'Ananya Roy', status: 'absent', bleRssi: 'Out of range' },
    { id: '8', roll: '04214802729', name: 'Tanmay Jain', status: 'present', bleRssi: '-45 dBm' }
  ]);

  const toggleStudentStatus = (id) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'present' ? 'absent' : s.status === 'absent' ? 'leave' : 'present';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const leaveCount = students.filter(s => s.status === 'leave').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Faculty Portal
              </span>
              <span className="text-xs text-slate-400">{currentUser?.designation}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white mt-1">{currentUser?.name}</h1>
            <p className="text-xs text-slate-400">{currentUser?.department}</p>
          </div>
        </div>

        {/* Live Active Room Passcode Generator */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-4">
          <div>
            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
              Active Room Passcode
            </span>
            <span className="text-2xl font-black font-mono text-white tracking-widest">
              {activeSession.code}
            </span>
          </div>
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </span>
        </div>
      </div>

      {/* Attendance Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Present (Verified BLE)</span>
            <span className="text-2xl font-bold text-emerald-400">{presentCount}</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Unmarked / Absent</span>
            <span className="text-2xl font-bold text-rose-400">{absentCount}</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-rose-400"></span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-semibold">Approved Leave</span>
            <span className="text-2xl font-bold text-slate-400">{leaveCount}</span>
          </div>
          <span className="w-3 h-3 rounded-full bg-slate-400"></span>
        </div>
      </div>

      {/* Live Color Roster Grid */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            Live Classroom Attendance Roster ({activeSession.subject})
          </h3>
          <span className="text-xs text-slate-400">Click any student to toggle manual override</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              onClick={() => toggleStudentStatus(student.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer select-none ${
                student.status === 'present'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : student.status === 'absent'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold">{student.roll}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  student.status === 'present' ? 'bg-emerald-500/20 text-emerald-400' :
                  student.status === 'absent' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {student.status}
                </span>
              </div>
              <h4 className="font-bold text-white text-sm mt-2">{student.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{student.bleRssi}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
