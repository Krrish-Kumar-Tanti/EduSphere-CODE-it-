import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DigitalApprovals from './DigitalApprovals';
import SubstitutionEngine from './SubstitutionEngine';
import Broadcasts from './Broadcasts';
import GrievanceDrawer from '../student/GrievanceDrawer';
import VirtualIDCard from '../student/VirtualIDCard';
import { 
  UNIVERSITIES, 
  PRESET_GGSIPU_S2_TIMETABLE, 
  PRESET_DTU_A4_TIMETABLE,
  getSubjectsList 
} from '../../data/syllabusData';
import { 
  ShieldCheck, 
  Send, 
  FileCheck2, 
  Users2, 
  Sparkles, 
  Flame, 
  Building2, 
  Radio, 
  Layers, 
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
  CreditCard
} from 'lucide-react';

export default function HodDashboard() {
  const { currentUser } = useAuth();
  const { grievances, broadcasts, substitutions, approvals, timetables, publishTimetable, facultyDirectory } = useData();
  const [activeTab, setActiveTab] = useState('timetables'); // 'timetables' | 'approvals' | 'substitutions' | 'broadcasts' | 'grievances' | 'idcard'

  // Timetable Command Center States
  const [selectedUniversity, setSelectedUniversity] = useState('GGSIPU');
  const [selectedDept, setSelectedDept] = useState('Computer Science & Engineering (CSE)');
  const [selectedSemester, setSelectedSemester] = useState('3rd Semester (Year 2)');
  const [selectedSection, setSelectedSection] = useState('Section-S2');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Active grid working copy
  const [workingTimetable, setWorkingTimetable] = useState(PRESET_GGSIPU_S2_TIMETABLE);

  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;
  const pendingSubstitutions = substitutions.filter(s => s.status === 'Pending').length;
  const unresolvedGrievances = grievances.filter(g => g.destination === 'hod' && g.status !== 'Resolved').length;

  const tabs = [
    { id: 'timetables', label: 'Master Timetables', icon: Calendar, badge: 'DTU / GGSIPU Matrix', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'approvals', label: 'RSA Approvals', icon: FileCheck2, badge: `${pendingApprovals} Pending`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'substitutions', label: 'Substitutions', icon: Users2, badge: `${pendingSubstitutions} Requests`, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 'broadcasts', label: 'Campus Broadcast', icon: Send, badge: `${broadcasts.length} Active`, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'grievances', label: 'Academic Triage', icon: AlertTriangle, badge: `${unresolvedGrievances} Flags`, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'idcard', label: 'Executive Pass', icon: CreditCard, badge: 'HOD Seal', color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  // Preset Loaders matching the User's uploaded images
  const handleLoadGgsipuPreset = () => {
    setSelectedUniversity('GGSIPU');
    setSelectedSection('Section-S2');
    setWorkingTimetable(PRESET_GGSIPU_S2_TIMETABLE);
  };

  const handleLoadDtuPreset = () => {
    setSelectedUniversity('DTU');
    setSelectedSection('Section-A4');
    setWorkingTimetable(PRESET_DTU_A4_TIMETABLE);
  };

  const handlePublishTimetable = async () => {
    const payload = {
      ...workingTimetable,
      university: selectedUniversity,
      department: selectedDept,
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
      setWorkingTimetable({ ...workingTimetable, schedule: updatedSchedule });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Executive Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-purple-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  HOD Executive Console
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {currentUser?.adminCode || 'HOD-001'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • Cabin: {currentUser?.cabin || 'Room 101, Executive Wing'}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Faculty</span>
              <span className="text-xl font-black text-purple-600">{facultyDirectory.length}</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Registered</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Pending Grants</span>
              <span className="text-xl font-black text-emerald-600">{pendingApprovals}</span>
              <span className="text-[10px] text-slate-500 block font-medium">RSA Queue</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Substitutions</span>
              <span className="text-xl font-black text-sky-600">{pendingSubstitutions}</span>
              <span className="text-[10px] text-slate-500 block font-medium">Pending Slots</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Timetables</span>
              <span className="text-xl font-black text-amber-600">{timetables.length}</span>
              <span className="text-[10px] text-slate-500 block font-medium">Broadcasted</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Tab Navigation Cards */}
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

      {/* Active Tab View */}
      <div className="transition-all animate-fadeIn">
        
        {/* ========================================================
            1. MASTER TIMETABLE COMMAND CENTER (DTU & GGSIPU)
            ======================================================== */}
        {activeTab === 'timetables' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    HOD Master Schedule Engine
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{workingTimetable.campus || 'Main Campus'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  Department Timetable Command Center
                </h2>
                <p className="text-xs text-slate-500">
                  Build and publish section-wise weekly timetables with faculty and syllabus integration.
                </p>
              </div>

              {/* 1-Click Preset Loaders matching User's Uploaded Images */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block sm:inline">
                  Preset Blueprints:
                </span>
                
                <button
                  type="button"
                  onClick={handleLoadGgsipuPreset}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load GGSIPU S2 Blueprint (Image 1)</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadDtuPreset}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 flex items-center gap-1.5 transition shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span>Load DTU A4 Blueprint (Image 2)</span>
                </button>
              </div>
            </div>

            {/* University & Target Selector Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">University Framework</label>
                <select
                  value={selectedUniversity}
                  onChange={(e) => {
                    setSelectedUniversity(e.target.value);
                    if (e.target.value === 'DTU') handleLoadDtuPreset();
                    else handleLoadGgsipuPreset();
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 text-xs focus:outline-none"
                >
                  <option value="GGSIPU">GGSIPU (Guru Gobind Singh IPU)</option>
                  <option value="DTU">DTU (Delhi Technological University)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 text-xs focus:outline-none"
                >
                  <option value="Computer Science & Engineering (CSE)">Computer Science & Engineering (CSE)</option>
                  <option value="Information Technology (IT)">Information Technology (IT)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 text-xs focus:outline-none"
                >
                  <option value="3rd Semester (Year 2)">3rd Semester (Year 2)</option>
                  <option value="6th Semester (Year 3)">6th Semester (Year 3)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Section</label>
                <input
                  type="text"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-800 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Timetable Interactive Grid Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Weekly Schedule Matrix ({workingTimetable.roomNo || 'Room 4202 / AB4-205'})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Click any cell to edit assigned subject or faculty
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 bg-slate-200 w-24 text-center font-bold">Day</th>
                      {workingTimetable.timeSlots?.map((slot, i) => (
                        <th key={i} className="p-2.5 text-center border-l border-slate-200 font-mono text-[10px]">
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {workingTimetable.days?.map(day => (
                      <tr key={day} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-black bg-slate-100 text-center text-slate-900 border-r border-slate-200">
                          {day}
                        </td>
                        {workingTimetable.schedule?.[day]?.map((period, pIdx) => {
                          const isBreak = period.type === 'break';
                          const isLab = period.type === 'lab';

                          return (
                            <td 
                              key={pIdx} 
                              className={`p-2 border-l border-slate-200 text-[10px] min-w-[130px] ${
                                isBreak ? 'bg-amber-50/50' : isLab ? 'bg-indigo-50/40' : ''
                              }`}
                            >
                              <input
                                type="text"
                                value={period.subject || ''}
                                onChange={(e) => handleSlotChange(day, pIdx, 'subject', e.target.value)}
                                placeholder="Subject"
                                className="w-full p-1 rounded-md bg-transparent font-bold text-slate-900 focus:bg-white focus:outline-none border-b border-transparent focus:border-purple-600 truncate"
                              />
                              <input
                                type="text"
                                value={period.faculty || ''}
                                onChange={(e) => handleSlotChange(day, pIdx, 'faculty', e.target.value)}
                                placeholder="Faculty"
                                className="w-full p-0.5 rounded-md bg-transparent text-slate-600 text-[9px] focus:bg-white focus:outline-none truncate"
                              />
                              <input
                                type="text"
                                value={period.room || ''}
                                onChange={(e) => handleSlotChange(day, pIdx, 'room', e.target.value)}
                                placeholder="Room"
                                className="w-full p-0.5 rounded-md bg-transparent text-slate-400 font-mono text-[8px] focus:bg-white focus:outline-none truncate"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Publishing & Broadcast Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Timetable Incharge: <strong className="text-slate-800">{workingTimetable.timeTableIncharge || 'Ms. Pratibha Dabas'}</strong> • HOD: <strong className="text-slate-800">{workingTimetable.hodName || currentUser?.name}</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePublishTimetable}
                  className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-md shadow-purple-600/20 flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{publishSuccess ? '✓ Broadcasted to Students & Faculty!' : 'Publish & Broadcast Timetable'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Retain other HOD modules */}
        {activeTab === 'approvals' && <DigitalApprovals />}
        {activeTab === 'substitutions' && <SubstitutionEngine />}
        {activeTab === 'broadcasts' && <Broadcasts />}
        {activeTab === 'grievances' && <GrievanceDrawer />}
        {activeTab === 'idcard' && <VirtualIDCard />}

      </div>

    </div>
  );
}
