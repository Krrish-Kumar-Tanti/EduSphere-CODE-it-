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
  Zap,
  Mail,
  Key,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const [topTab, setTopTab] = useState('signin'); // 'signin' | 'register'

  const roleConfigs = {
    student: {
      id: 'student',
      title: 'Student Portal',
      subtitle: 'BLE Attendance, Dynamic QR ID & Academic Grievance Desk',
      emailLabel: 'Student Enrollment / University Email',
      demoEmail: 'krrish.tanti@adgitm.ac.in',
      loggingInAs: 'Krrish Kumar Tanti (B.Tech CSE)',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      borderActive: 'border-indigo-500',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-700'
    },
    teacher: {
      id: 'teacher',
      title: 'Faculty / Teacher Portal',
      subtitle: 'Dynamic PIN Attendance Generator & Real-time Color Roster',
      emailLabel: 'Faculty ID / University Email',
      demoEmail: 'manish.verma@adgitm.ac.in',
      loggingInAs: 'Dr. Manish Verma (Assoc. Professor)',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      borderActive: 'border-emerald-500',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700'
    },
    hod: {
      id: 'hod',
      title: 'HOD Command Console',
      subtitle: 'Substitution Matrix, Digital Signatures & Urgent Broadcasts',
      emailLabel: 'Department Admin Code / HOD ID',
      demoEmail: 'HOD-001',
      loggingInAs: 'Prof. S. K. Naitik (HOD CSE)',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgLight: 'bg-purple-50',
      borderActive: 'border-purple-500',
      buttonBg: 'bg-purple-600 hover:bg-purple-700'
    },
    staff: {
      id: 'staff',
      title: 'Ground Operations & Staff',
      subtitle: 'Campus Maintenance, Cleanliness & Emergency Hotline 108',
      emailLabel: 'Staff Employee ID / Work Email',
      demoEmail: 'STF-504',
      loggingInAs: 'Rajesh Sharma (Lead Supervisor)',
      icon: Wrench,
      color: 'text-amber-600',
      bgLight: 'bg-amber-50',
      borderActive: 'border-amber-500',
      buttonBg: 'bg-amber-600 hover:bg-amber-700'
    }
  };

  const currentConfig = roleConfigs[selectedRole];
  const CurrentIcon = currentConfig.icon;

  const [emailInput, setEmailInput] = useState(currentConfig.demoEmail);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setEmailInput(roleConfigs[roleId].demoEmail);
  };

  const handleAutoFill = () => {
    setEmailInput(currentConfig.demoEmail);
    setPasswordInput('password123');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      
      {/* Background Soft Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 space-y-6">
        
        {/* Top Switcher Capsule (As seen in Screenshot 3 & 4) */}
        <div className="flex justify-center">
          <div className="p-1 rounded-full bg-white border border-slate-200 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setTopTab('signin')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                topTab === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Multi-Role Sign In</span>
            </button>

            <button
              onClick={() => {
                setTopTab('register');
                alert('Student Registration Portal: Connect with Admission Cell (STF-504)');
                setTopTab('signin');
              }}
              className={`px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 ${
                topTab === 'register'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Issue New ID / Register Student</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          
          {/* 4 Role Tabs at top */}
          <div className="grid grid-cols-2 sm:grid-cols-4 p-3 gap-2 bg-slate-50/70 border-b border-slate-200/80">
            {[
              { id: 'student', label: 'Student Portal', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'teacher', label: 'Faculty / Teacher', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'hod', label: 'HOD Command', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
              { id: 'staff', label: 'Operations & Staff', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedRole === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleRoleSelect(tab.id)}
                  className={`p-3 rounded-2xl transition flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-white border-2 ' + roleConfigs[tab.id].borderActive + ' shadow-sm'
                      : 'bg-transparent border border-transparent hover:bg-white/60 text-slate-500'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${tab.bg} ${tab.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Role Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${currentConfig.bgLight} ${currentConfig.color}`}>
                  <CurrentIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {currentConfig.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentConfig.subtitle}
                  </p>
                </div>
              </div>

              {/* Auto-Fill Demo Data Button */}
              <button
                type="button"
                onClick={handleAutoFill}
                className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Fill Demo Data</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Email / ID Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">
                  {currentConfig.emailLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Security Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Demo Mode: Any password or 1-click login will work!')}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-medium transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox & Status bar */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Keep me authenticated on this device</span>
                </label>

                <span className="text-[11px] text-slate-500">
                  Logging in as: <strong className="text-slate-800">{currentConfig.loggingInAs}</strong>
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md ${currentConfig.buttonBg}`}
              >
                <span>Sign In to {currentConfig.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

          </div>

          {/* Bottom 1-Click Fast Persona Entry (As seen in Screenshot 3 & 4) */}
          <div className="p-5 bg-slate-50 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                1-CLICK FAST PERSONA ENTRY
              </span>
              <span className="font-bold text-emerald-600 flex items-center gap-1 text-[11px]">
                <Radio className="w-3 h-3 animate-pulse" />
                BLE Mesh Ready
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { role: 'student', label: 'Student', sub: 'Krrish' },
                { role: 'teacher', label: 'Faculty', sub: 'Dr. Manish' },
                { role: 'hod', label: 'HOD', sub: 'Prof. Naitik' },
                { role: 'staff', label: 'Staff', sub: 'Rajesh' }
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => login(item.role)}
                  className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-sm text-left transition"
                >
                  <span className="text-xs font-bold text-slate-900 block">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.sub}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

