import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import SubstitutionEngine from './SubstitutionEngine';
import DigitalApprovals from './DigitalApprovals';
import Broadcasts from './Broadcasts';
import { 
  ShieldCheck, 
  Users, 
  Send, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  BarChart3,
  Building,
  GraduationCap,
  Award,
  Layers,
  Clock,
  Radio
} from 'lucide-react';

export default function HodDashboard() {
  const { currentUser } = useAuth();
  const { broadcasts, grievances, substitutions, approvals, updateGrievanceStatus } = useData();
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'substitutions' | 'approvals' | 'broadcasts' | 'grievances'

  const hodGrievances = grievances.filter(g => g.destination === 'hod');
  const pendingSubs = substitutions.filter(s => s.status === 'Pending').length;
  const pendingApprovals = approvals.filter(a => a.status === 'Pending').length;

  const tabs = [
    { id: 'analytics', label: 'Department Pulse', icon: BarChart3, badge: '92.4% Avg Attendance', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'substitutions', label: 'Substitution Matrix', icon: Users, badge: `${pendingSubs} Unfilled Slots`, color: 'text-rose-600', bg: 'bg-rose-50' },
    { id: 'approvals', label: 'Digital Approvals', icon: FileCheck, badge: `${pendingApprovals} Pending Sign`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'broadcasts', label: 'Urgent Push Alerts', icon: Send, badge: `${broadcasts.length} Broadcasts`, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'grievances', label: 'Academic Grievances', icon: AlertCircle, badge: `${hodGrievances.length} Tickets`, color: 'text-amber-600', bg: 'bg-amber-50' }
  ];

  const departmentClasses = [
    { name: 'CSE 6th Semester (Section A)', subject: 'Operating Systems Lab (Lab 204)', faculty: 'Dr. Manish Verma', attendance: '91.2%', status: 'Live Session' },
    { name: 'CSE 6th Semester (Section B)', subject: 'Machine Learning Elective (Room 304)', faculty: 'Dr. Rahul Saxena', attendance: '86.5%', status: 'Live Session' },
    { name: 'CSE 4th Semester (Section A)', subject: 'Database Management Systems (Lab 201)', faculty: 'Dr. Priya Sen', attendance: '94.8%', status: 'Upcoming' },
    { name: 'CSE 8th Semester (Section A)', subject: 'Cloud & Distributed Computing (Room 205)', faculty: 'Prof. Vikram Seth', attendance: '89.0%', status: 'Completed' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Command Header */}
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
                  HOD Command Console
                </span>
                <span className="text-xs text-slate-500 font-semibold">{currentUser?.cabin}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {currentUser?.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {currentUser?.department} • Designated Cryptographic Key Authority
              </p>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Total Enrolled</span>
              <span className="text-lg sm:text-xl font-black text-slate-900">1,240</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Undergraduate</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Faculty Load</span>
              <span className="text-lg sm:text-xl font-black text-purple-600">28/32</span>
              <span className="text-[10px] text-purple-700 block font-semibold">On-Duty Today</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Dept Attendance</span>
              <span className="text-lg sm:text-xl font-black text-indigo-600">92.4%</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">+2.1% YoY</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Grievance Rate</span>
              <span className="text-lg sm:text-xl font-black text-emerald-600">96.2%</span>
              <span className="text-[10px] text-slate-500 block font-medium">Closed</span>
            </div>

          </div>

        </div>

      </div>

      {/* Main Tab Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-2 ${
                isActive
                  ? 'bg-white border-2 border-purple-600 shadow-md ring-2 ring-purple-500/10'
                  : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${tab.bg} ${tab.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && <div className="w-2 h-2 rounded-full bg-purple-600"></div>}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">{tab.label}</span>
                <span className="text-[10px] text-slate-500">{tab.badge}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="transition-all animate-fadeIn">
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            
            {/* Live Classroom Radar & Attendance Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-600" />
                    Live Class Efficiency & BLE Proximity Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time attendance rates across ongoing lecture halls</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  4 Active Sections
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departmentClasses.map((cls, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        cls.status === 'Live Session' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cls.status}
                      </span>
                    </div>

                    <p className="text-slate-700 font-medium">{cls.subject}</p>
                    <p className="text-[11px] text-slate-500">Lecturer: {cls.faculty}</p>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Attendance Rate:</span>
                      <span className="font-black font-mono text-indigo-600 text-sm">{cls.attendance}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Department Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Semester Attendance Rank</span>
                <div className="text-2xl font-black text-emerald-600">#1 in Institute</div>
                <p className="text-xs text-slate-500">CSE Department outranks ECE (88.1%) and ME (82.4%).</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Smart BLE Coverage</span>
                <div className="text-2xl font-black text-indigo-600">100% Mesh Active</div>
                <p className="text-xs text-slate-500">12 BLE beacons calibrated across Block A & Block B labs.</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Digital Approvals Turnaround</span>
                <div className="text-2xl font-black text-purple-600">4.2 Hours Avg</div>
                <p className="text-xs text-slate-500">92% faster than physical paper approvals workflow.</p>
              </div>

            </div>

          </div>
        )}

        {activeTab === 'substitutions' && <SubstitutionEngine />}
        {activeTab === 'approvals' && <DigitalApprovals />}
        {activeTab === 'broadcasts' && <Broadcasts />}

        {activeTab === 'grievances' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Academic Grievance Desk Escalations ({hodGrievances.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Complaints routed directly to HOD level</p>
              </div>
            </div>

            <div className="space-y-3">
              {hodGrievances.map((g) => (
                <div
                  key={g.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">{g.id}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-medium">
                          {g.category}
                        </span>
                        {g.isAnonymous && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200 font-bold">
                            🔒 Anonymous Student
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{g.title}</h4>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      {g.status}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-medium">{g.description}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Logged: {g.timestamp}</span>
                    <button
                      onClick={() => updateGrievanceStatus(g.id, 'Resolved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge & Resolve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}


