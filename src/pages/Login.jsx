import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  UserCheck, 
  ShieldCheck, 
  Wrench, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  Lock, 
  CheckCircle2, 
  QrCode,
  Zap
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roles = [
    {
      id: 'student',
      title: 'Student Portal',
      name: 'Krrish Kumar Tanti',
      desc: 'DTU BLE Attendance, Virtual QR ID, Grievances, Lecture Notes',
      icon: GraduationCap,
      badge: 'B.Tech CSE',
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-400',
      activeGlow: 'ring-2 ring-cyan-500 shadow-cyan-500/20'
    },
    {
      id: 'teacher',
      title: 'Faculty / Teacher',
      name: 'Dr. Manish Verma',
      desc: 'Take Live Attendance, Dynamic Code Gen, Color Roster Grid',
      icon: UserCheck,
      badge: 'Assoc. Professor',
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-400',
      activeGlow: 'ring-2 ring-emerald-500 shadow-emerald-500/20'
    },
    {
      id: 'hod',
      title: 'HOD Command Console',
      name: 'Prof. S. K. Naitik',
      desc: 'Faculty Substitution Matrix, Digital Signatures, Broadcasts',
      icon: ShieldCheck,
      badge: 'Head of Dept.',
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/40 text-purple-400',
      activeGlow: 'ring-2 ring-purple-500 shadow-purple-500/20'
    },
    {
      id: 'staff',
      title: 'Operations & Staff',
      name: 'Rajesh Sharma',
      desc: 'Maintenance, Cleanliness, Medical, Anti-Bullying Hotlines',
      icon: Wrench,
      badge: 'Ground Lead',
      color: 'from-amber-500/20 to-orange-600/20 border-amber-500/40 text-amber-400',
      activeGlow: 'ring-2 ring-amber-500 shadow-amber-500/20'
    }
  ];

  const handleInstantLogin = (roleId) => {
    login(roleId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Prasunethon 2.0 MVP
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
            EduSphere
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            The next-generation smart campus operating system connecting Students, Teachers, HODs, and Ground Staff in real-time.
          </p>
        </div>

        {/* 1-Click Fast Demo Role Selectors (Judges Love This!) */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-2xl">
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                Select Live Demo Persona (1-Click Entry)
              </h2>
              <p className="text-xs text-slate-400">
                Instant access to pre-configured role dashboards with live real-time simulation data.
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Radio className="w-3 h-3 animate-pulse" /> BLE Mesh Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;

              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer bg-slate-900/60 hover:bg-slate-900/90 ${
                    isSelected ? `${r.color} ${r.activeGlow}` : 'border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60 ${r.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{r.title}</h3>
                        <p className="text-xs text-slate-400">{r.name}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {r.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {r.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[11px] text-cyan-400 font-medium">1-Click Launch</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInstantLogin(r.id);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-md shadow-cyan-500/20"
                    >
                      <span>Enter</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Features Highlight Pill Bar */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="block text-xs font-bold text-cyan-400">Anti-Proxy BLE</span>
              <span className="text-[10px] text-slate-400">Zero Screenshot Fraud</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="block text-xs font-bold text-indigo-400">Double Triage</span>
              <span className="text-[10px] text-slate-400">Direct HOD & Staff Routing</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="block text-xs font-bold text-emerald-400">Paperless ID</span>
              <span className="text-[10px] text-slate-400">Dynamic Rotating QR</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="block text-xs font-bold text-purple-400">EduBot AI</span>
              <span className="text-[10px] text-slate-400">Context Campus Roamer</span>
            </div>
          </div>

        </div>

        {/* Footer Credit */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Built for Prasunethon 2.0 by <span className="text-slate-300 font-semibold">Team CODE it</span> (Krrish, Manish, Naitik)
        </div>

      </div>

    </div>
  );
}
