import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import TakeAttendance from './TakeAttendance';
import NotesPublisher from './NotesPublisher';
import VirtualIDCard from '../student/VirtualIDCard';
import { getCurriculumForUniversity, getSubjectsList } from '../../data/syllabusData';
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
  ChevronRight,
  CreditCard,
  Building2,
  Sliders,
  Check
} from 'lucide-react';

export default function TeacherDashboard() {
  const { currentUser } = useAuth();
  const { activeSession, notes, studentsRoster, timetables, syllabusProgress, updateSyllabusProgress } = useData();
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'notes' | 'syllabus' | 'schedule' | 'pass'
  const [selectedUni, setSelectedUni] = useState(currentUser?.university || 'GGSIPU');
  const [selectedBranch, setSelectedBranch] = useState('Computer Science & Engineering (CSE)');
  const [selectedSem, setSelectedSem] = useState('3rd Semester');

  const tabs = [
    { id: 'attendance', label: 'Attendance Studio', icon: Radio, badge: 'Live BLE Radar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'notes', label: 'Notes Vault', icon: BookOpen, badge: `${notes.length} Active Files`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'syllabus', label: 'Syllabus Tracker', icon: Sliders, badge: `${selectedUni} Units`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'schedule', label: 'Faculty Timetable', icon: Calendar, badge: 'Weekly Schedule', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'pass', label: 'Faculty Digital Pass', icon: CreditCard, badge: 'Scannable Badge', color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const presentCount = studentsRoster.filter(s => s.status === 'present').length;
  const attendanceRate = studentsRoster.length > 0 ? Math.round((presentCount / studentsRoster.length) * 100) : 0;

  // Course modules for selected curriculum
  const courseModules = getSubjectsList(selectedUni, selectedBranch, selectedSem);

  // Unit completion toggle
  const [unitProgress, setUnitProgress] = useState({
    'CSE-301-U1': 100,
    'CSE-301-U2': 85,
    'CSE-301-U3': 60,
    'CSE-301-U4': 30,
    'TH-CS207-U1': 100,
    'TH-CS207-U2': 75,
    'TH-CS207-U3': 40,
    'TH-CS207-U4': 10
  });

  const handleUnitProgressChange = (key, val) => {
    const next = { ...unitProgress, [key]: val };
    setUnitProgress(next);
    updateSyllabusProgress({
      faculty_id: currentUser?.id || 'FAC-1092',
      university: selectedUni,
      department: selectedBranch,
      subject_code: key.split('-')[0],
      subject_name: 'Core Module',
      progress: next
    });
  };

  // Find timetable where this faculty teaches
  const facultyTimetableSlots = [];
  timetables.forEach(tt => {
    if (tt.schedule) {
      Object.keys(tt.schedule).forEach(day => {
        tt.schedule[day].forEach(period => {
          if (period.faculty && (
            period.faculty.toLowerCase().includes(currentUser?.name?.split(' ')[1]?.toLowerCase() || 'verma') ||
            period.faculty.toLowerCase().includes('manish') ||
            period.faculty.toLowerCase().includes('nipun') ||
            period.faculty.toLowerCase().includes('aditi') ||
            period.faculty.toLowerCase().includes('poonam')
          )) {
            facultyTimetableSlots.push({
              day,
              slot: period.slot,
              subject: period.subject,
              room: period.room,
              section: tt.section,
              university: tt.university
            });
          }
        });
      });
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Header Banner */}
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
                  Faculty Member
                </span>
                <span className="text-xs text-slate-500 font-semibold">{currentUser?.designation}</span>
                <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-200">
                  {currentUser?.university || selectedUni} Framework
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • ID: <span className="font-mono text-slate-700 font-semibold">{currentUser?.id}</span> • Cabin: {currentUser?.cabin || 'Room 304'}
              </p>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Live Class PIN</span>
              <span className="text-xl font-black font-mono text-emerald-600 tracking-wider">
                {activeSession.code}
              </span>
              <span className="text-[10px] text-emerald-700 block font-semibold flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                BLE Active
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Class Quorum</span>
              <span className="text-xl font-black text-indigo-600">{attendanceRate}%</span>
              <span className="text-[10px] text-slate-500 block font-medium">{presentCount}/{studentsRoster.length} Present</span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Course Vault</span>
              <span className="text-xl font-black text-purple-600">{notes.length} Files</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Published</span>
            </div>

          </div>

        </div>

      </div>

      {/* Main Tab Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2.5 rounded-xl ${tab.bg} ${tab.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-emerald-600"></div>}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block">{tab.label}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{tab.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="transition-all animate-fadeIn">
        {activeTab === 'attendance' && <TakeAttendance />}
        {activeTab === 'notes' && <NotesPublisher />}
        {activeTab === 'pass' && <VirtualIDCard />}

        {/* DTU vs GGSIPU Syllabus Progress Tracker */}
        {activeTab === 'syllabus' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600" />
                  Dual-Curriculum Syllabus Coverage Tracker (DTU & GGSIPU)
                </h3>
                <p className="text-xs text-slate-500">
                  Update unit-by-unit lecture progress. Changes persist into the database and sync to student dashboards.
                </p>
              </div>

              {/* University Selector */}
              <div className="flex items-center gap-2">
                {['GGSIPU', 'DTU'].map(uni => (
                  <button
                    key={uni}
                    onClick={() => setSelectedUni(uni)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                      selectedUni === uni 
                        ? 'bg-indigo-600 text-white shadow-xs' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {uni} Curriculum
                  </button>
                ))}
              </div>
            </div>

            {/* Course Units Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courseModules.map((course, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{course.code}: {course.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Credits: {course.credits}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  {/* Units slider and checklist */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    {course.units?.map((unitText, uIdx) => {
                      const key = `${course.code}-U${uIdx + 1}`;
                      const currentVal = unitProgress[key] || (uIdx === 0 ? 100 : uIdx === 1 ? 70 : 25);

                      return (
                        <div key={uIdx} className="space-y-1 bg-white p-2.5 rounded-xl border border-slate-200/80">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span className="truncate max-w-[200px]">Unit {uIdx + 1}: {unitText}</span>
                            <span className="font-mono text-indigo-600 text-[11px]">{currentVal}%</span>
                          </div>
                          
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={currentVal}
                            onChange={(e) => handleUnitProgressChange(key, parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Faculty Timetable View */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Personalized Faculty Teaching Load
                </h3>
                <p className="text-xs text-slate-500">Allocated lecture, tutorial & laboratory slots across all department sections</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                Weekly Timetable
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facultyTimetableSlots.length === 0 ? (
                <div className="col-span-full p-8 text-center text-slate-400">
                  <p className="text-xs font-semibold">Allocated teaching sessions loaded below from master schedule:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-left">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block">Operating Systems Lab (CSE-301)</span>
                      <span className="text-slate-500 text-[11px] block">Mon & Wed • 02:00 PM - 04:00 PM • Lab 204, Block A</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-2">Section CSE-6A</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-bold text-slate-900 block">TH-CS207 Operating System Design</span>
                      <span className="text-slate-500 text-[11px] block">Tue & Thu • 10:00 AM - 11:00 AM • Room AB4-205</span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 inline-block mt-2">Section A4 (DTU)</span>
                    </div>
                  </div>
                </div>
              ) : (
                facultyTimetableSlots.map((slot, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-indigo-700 uppercase">{slot.day} • {slot.slot}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                        {slot.section}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{slot.subject}</h4>
                    <p className="text-slate-500 text-[11px]">{slot.room} • {slot.university}</p>
                    <button
                      onClick={() => setActiveTab('attendance')}
                      className="mt-2 w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Radio className="w-3 h-3" />
                      <span>Start Class / Attendance</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
