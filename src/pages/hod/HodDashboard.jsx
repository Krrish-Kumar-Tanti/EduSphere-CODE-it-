import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DigitalApprovals from './DigitalApprovals';
import SubstitutionEngine from './SubstitutionEngine';
import Broadcasts from './Broadcasts';
import GrievanceDrawer from '../student/GrievanceDrawer';
import VirtualIDCard from '../student/VirtualIDCard';
import { 
  PRESET_SECTION_S2_TIMETABLE, 
  PRESET_SECTION_A4_TIMETABLE,
  SEMESTER_LIST 
} from '../../data/syllabusData';
import { 
  ShieldCheck, 
  Send, 
  FileCheck2, 
  Users2, 
  Sparkles, 
  Building2, 
  Calendar,
  AlertTriangle,
  Clock,
  BookOpen,
  Plus,
  Save,
  Trash2,
  Share2,
  Check,
  Zap,
  Sliders,
  CreditCard,
  Lock,
  Radio
} from 'lucide-react';

export default function HodDashboard() {
  const { currentUser } = useAuth();
  const { grievances, broadcasts, substitutions, approvals, timetables, publishTimetable, facultyDirectory } = useData();
  const [activeTab, setActiveTab] = useState('timetables'); // 'timetables' | 'approvals' | 'substitutions' | 'broadcasts' | 'grievances' | 'idcard'

  // Immutable Scope from HOD Profile
  const hodCollege = currentUser?.college || 'Apex Institute of Technology & Management (AITM)';
  const hodDept = currentUser?.department || 'Computer Science & Engineering (CSE)';

  // Semester & Section Selector States
  const [selectedSemester, setSelectedSemester] = useState('3rd Semester (Year 2)');
  const [selectedSection, setSelectedSection] = useState('Section-S2');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Active grid working copy
  const [workingTimetable, setWorkingTimetable] = useState(PRESET_SECTION_S2_TIMETABLE);

  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  const pendingSubstitutions = substitutions.filter(s => s.status === 'Pending').length;
  const unresolvedGrievances = grievances.filter(g => g.destination === 'hod' && g.status !== 'Resolved').length;

  const tabs = [
    { id: 'timetables', label: 'Master Timetables', icon: Calendar, badge: 'Matrix Engine', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'approvals', label: 'RSA Approvals', icon: FileCheck2, badge: `${pendingApprovals} Pending`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'substitutions', label: 'Substitutions', icon: Users2, badge: `${pendingSubstitutions} Requests`, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 'broadcasts', label: 'Campus Broadcast', icon: Send, badge: `${broadcasts.length} Active`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'grievances', label: 'Academic Triage', icon: AlertTriangle, badge: `${unresolvedGrievances} Flags`, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'idcard', label: 'Executive Pass', icon: CreditCard, badge: 'HOD Seal', color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  // Preset Blueprint Loaders
  const handleLoadSectionS2Blueprint = () => {
    setSelectedSection('Section-S2');
    setWorkingTimetable(PRESET_SECTION_S2_TIMETABLE);
  };

  const handleLoadSectionA4Blueprint = () => {
    setSelectedSection('Section-A4');
    setWorkingTimetable(PRESET_SECTION_A4_TIMETABLE);
  };

  const handlePublishTimetable = async () => {
    const payload = {
      ...workingTimetable,
      college: hodCollege,
      department: hodDept,
      semester: selectedSemester,
      section: selectedSection,
      publishedBy: currentUser?.name || 'Prof. S. K. Naitik (HOD CSE)',
      updatedAt: new Date().toISOString()
    };

    await publishTimetable(payload);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handleSlotChange = (day, periodIdx, field, value) => {
    const updatedSchedule = { ...workingTimetable.schedule };
    if (updatedSchedule[day] && updatedSchedule[day][periodIdx]) {
      updatedSchedule[day][periodIdx] = {
        ...updatedSchedule[day][periodIdx],
        [field]: value
      };
      setWorkingTimetable({
        ...workingTimetable,
        schedule: updatedSchedule
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Immutable Institutional Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500 shadow-sm"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  HOD Executive Console
                </span>
                <span className="text-xs text-slate-500 font-semibold">{currentUser?.designation || 'Head of Department'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              
              {/* Verified Immutable Scope Pill */}
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                <Lock className="w-3 h-3 text-purple-600" />
                <span>Verified Scope: <strong>{hodCollege}</strong> • <strong>{hodDept}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Faculty Body</span>
              <span className="text-xl font-black text-purple-600">{facultyDirectory.length || 10}</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Active Teachers</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Pending Tasks</span>
              <span className="text-xl font-black text-emerald-600">{pendingApprovals}</span>
              <span className="text-[10px] text-slate-500 block font-medium">Approvals</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Timetables</span>
              <span className="text-xl font-black text-indigo-600">{timetables.length}</span>
              <span className="text-[10px] text-indigo-700 block font-semibold">Live Sections</span>
            </div>
          </div>

        </div>

      </div>

      {/* Main Tab Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-2 border-purple-600 shadow-md ring-2 ring-purple-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2.5 rounded-xl ${tab.bg} ${tab.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-purple-600"></div>}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-900 block">{tab.label}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{tab.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="transition-all animate-fadeIn">
        
        {/* ========================================================
            TAB 1: MASTER TIMETABLE COMMAND CENTER
            ======================================================== */}
        {activeTab === 'timetables' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                    Master Scheduling Studio
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{hodCollege}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  Department Weekly Schedule Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Select target semester and section, calibrate period slots, and broadcast live to all student and faculty dashboards.
                </p>
              </div>

              {/* 1-Click Blueprints & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                
                <button
                  onClick={handleLoadSectionS2Blueprint}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="Load Section S2 Preset (Room 4202)"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Preset: Section S2 (Room 4202)</span>
                </button>

                <button
                  onClick={handleLoadSectionA4Blueprint}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  title="Load Section A4 Preset (Room AB4-205)"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Preset: Section A4 (Room AB4-205)</span>
                </button>

                <button
                  onClick={handlePublishTimetable}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-purple-600/20"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{publishSuccess ? '✓ Published to Campus!' : 'Publish Master Timetable'}</span>
                </button>

              </div>
            </div>

            {/* Target Semester & Section Scoping Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              
              {/* Institution (Immutable) */}
              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">Institution</label>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 truncate">
                  {hodCollege}
                </div>
              </div>

              {/* Department (Immutable) */}
              <div>
                <label className="block text-slate-500 font-bold mb-1 uppercase text-[10px]">Department</label>
                <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 truncate">
                  {hodDept}
                </div>
              </div>

              {/* Target Semester */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Target Semester *</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                >
                  {SEMESTER_LIST.map(sem => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              </div>

              {/* Target Section */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">Target Section *</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                >
                  <option value="Section-S2">Section-S2 (Room 4202)</option>
                  <option value="Section-A4">Section-A4 (Room AB4-205)</option>
                  <option value="CSE-A">CSE-A (Section A)</option>
                  <option value="CSE-B">CSE-B (Section B)</option>
                  <option value="CSE-C">CSE-C (Section C)</option>
                  <option value="Section-S1">Section-S1</option>
                </select>
              </div>

            </div>

            {/* Weekly Timetable Matrix Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Weekly Period Allocation Matrix (Monday – Friday)
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  Room: {workingTimetable.roomNo || 'Room 4202'} • Incharge: {workingTimetable.timeTableIncharge || 'Ms. Pratibha Dabas'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="p-3 bg-slate-200/80 sticky left-0 z-10 w-28">Day</th>
                      {workingTimetable.timeSlots?.map(slot => (
                        <th key={slot} className="p-2.5 text-center font-mono border-l border-slate-200 min-w-[130px]">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workingTimetable.days?.map(day => (
                      <tr key={day} className="hover:bg-slate-50/70 transition">
                        
                        {/* Sticky Day Label */}
                        <td className="p-3 bg-white sticky left-0 z-10 font-black text-slate-900 border-r border-slate-200">
                          {day}
                        </td>

                        {/* Period Slots */}
                        {workingTimetable.schedule?.[day]?.map((period, pIdx) => {
                          const isBreak = period.type === 'break';
                          const isLab = period.type === 'lab';

                          return (
                            <td key={pIdx} className="p-2 border-l border-slate-100 align-top">
                              <div className={`p-2 rounded-xl border text-[11px] space-y-1 transition ${
                                isBreak 
                                  ? 'bg-amber-50/70 border-amber-200 text-amber-900 text-center font-bold' 
                                  : isLab 
                                  ? 'bg-emerald-50/80 border-emerald-200' 
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}>
                                {isBreak ? (
                                  <div className="py-2">
                                    <span>🥪 {period.subject}</span>
                                  </div>
                                ) : (
                                  <>
                                    <input
                                      type="text"
                                      value={period.subject}
                                      onChange={(e) => handleSlotChange(day, pIdx, 'subject', e.target.value)}
                                      className="w-full font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none truncate"
                                      placeholder="Subject Name"
                                    />
                                    <input
                                      type="text"
                                      value={period.faculty}
                                      onChange={(e) => handleSlotChange(day, pIdx, 'faculty', e.target.value)}
                                      className="w-full text-[10px] text-purple-700 font-semibold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-purple-600 focus:outline-none truncate"
                                      placeholder="Faculty Name"
                                    />
                                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono pt-0.5">
                                      <span>{period.room}</span>
                                      <span className="uppercase font-bold text-slate-500">{period.type}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          );
                        })}

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* Other HOD Sub-Tabs */}
        {activeTab === 'approvals' && <DigitalApprovals />}
        {activeTab === 'substitutions' && <SubstitutionEngine />}
        {activeTab === 'broadcasts' && <Broadcasts />}
        {activeTab === 'grievances' && <GrievanceDrawer />}
        {activeTab === 'idcard' && <VirtualIDCard />}

      </div>

    </div>
  );
}
