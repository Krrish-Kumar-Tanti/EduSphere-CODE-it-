import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import SearchableSelect from '../components/SearchableSelect';
import { 
  GGSIPU_COLLEGES, 
  DEPARTMENTS, 
  BLOOD_GROUPS, 
  SEMESTERS, 
  SECTIONS 
} from '../data/ggsipuData';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  Radio, 
  ShieldCheck, 
  BookOpen, 
  QrCode, 
  Zap, 
  CheckCircle2, 
  Lock, 
  UserCheck, 
  Wrench, 
  Mail, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Building2, 
  Upload, 
  UserPlus, 
  LogIn, 
  Camera, 
  Heart, 
  Calendar, 
  Hash,
  Search
} from 'lucide-react';

export default function Login() {
  const { login, register, uploadPhoto } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form states
  const [identifier, setIdentifier] = useState('04214802722');
  const [password, setPassword] = useState('krrish@2026');
  const [rememberMe, setRememberMe] = useState(true);

  // Registration Form states (Independent profile creation with GGSIPU data)
  const [regName, setRegName] = useState('Krrish Kumar Tanti');
  const [regEnrollment, setRegEnrollment] = useState('04214802722');
  const [regCollege, setRegCollege] = useState('ADGITM (Dr. Akhilesh Das Gupta Institute of Technology & Management)');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering (CSE)');
  const [regSemester, setRegSemester] = useState('6th Semester (Year 3)');
  const [regSection, setRegSection] = useState('CSE-A');
  const [regBloodGroup, setRegBloodGroup] = useState('O+ positive');
  const [regValidUpto, setRegValidUpto] = useState('June 2026');
  const [regPassword, setRegPassword] = useState('krrish@2026');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  const [photoPreview, setPhotoPreview] = useState(null);

  const roleConfigs = {
    student: {
      id: 'student',
      title: 'Student Portal',
      subtitle: 'Smart BLE Attendance, Dynamic QR ID, Notes & Grievance Desk',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25',
      idLabel: 'University Enrollment / Roll Number',
      idPlaceholder: 'e.g. 04214802722',
      demoUser: 'Krrish Kumar Tanti (B.Tech CSE)',
      demoId: '04214802722',
      demoPass: 'krrish@2026'
    },
    teacher: {
      id: 'teacher',
      title: 'Faculty / Teacher Portal',
      subtitle: 'Dynamic PIN Attendance Generator & Real-time Color Roster',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
      idLabel: 'Faculty ID / University Email',
      idPlaceholder: 'e.g. manish.verma@adgitm.ac.in',
      demoUser: 'Dr. Manish Verma (Assoc. Professor)',
      demoId: 'manish.verma@adgitm.ac.in',
      demoPass: 'faculty@2026'
    },
    hod: {
      id: 'hod',
      title: 'HOD Command Console',
      subtitle: 'Substitution Matrix, Digital Signatures & Urgent Broadcasts',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      primaryBtn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25',
      idLabel: 'Department Admin Code / HOD ID',
      idPlaceholder: 'e.g. hod.cse@adgitm.ac.in',
      demoUser: 'Prof. S. K. Naitik (HOD CSE)',
      demoId: 'HOD-001',
      demoPass: 'hod@admin2026'
    },
    staff: {
      id: 'staff',
      title: 'Operations & Ground Staff',
      subtitle: 'Live Ticket Inbox, Maintenance, Sanitation & Emergency Medical',
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
      idLabel: 'Staff Badge ID / Service Unit PIN',
      idPlaceholder: 'e.g. STF-504',
      demoUser: 'Rajesh Sharma (Lead Supervisor)',
      demoId: 'STF-504',
      demoPass: 'staff@ops2026'
    }
  };

  const currentConfig = roleConfigs[selectedRole];
  const CurrentIcon = currentConfig.icon;

  const handleRoleSwitch = (roleId) => {
    setSelectedRole(roleId);
    const cfg = roleConfigs[roleId];
    setIdentifier(cfg.demoId);
    setPassword(cfg.demoPass);
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadPhoto(file);
      setRegAvatar(url);
      setPhotoPreview(url);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(selectedRole, { identifier, password, role: selectedRole });
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const studentData = {
      name: regName,
      enrollment: regEnrollment,
      college: regCollege,
      department: regDepartment,
      semester: regSemester,
      section: regSection,
      bloodGroup: regBloodGroup,
      validUpto: regValidUpto,
      avatar: regAvatar,
      password: regPassword,
      role: 'student'
    };

    await register(studentData);
    setIsLoading(false);
  };

  const handleFillDemoCredentials = () => {
    setIdentifier(currentConfig.demoId);
    setPassword(currentConfig.demoPass);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      
      {/* Soft Ambient Radial Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-100/60 via-sky-100/60 to-purple-100/60 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-slate-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> GGSIPU Affiliated Smart Campus System
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            EduSphere
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
            Universal multi-role campus management with GGSIPU centralized university selection & SQLite persistence.
          </p>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Register New Student) */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <button
              onClick={() => setAuthMode('login')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                authMode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Multi-Role Sign In</span>
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                authMode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Issue New ID / Register Student</span>
            </button>
          </div>
        </div>

        {authMode === 'login' ? (
          /* ========================================================
             1. UNIVERSAL MULTI-ROLE LOGIN CARD
             ======================================================== */
          <div className="glass-panel-elevated rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden bg-white/95">
            
            {/* Top 4-Role Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/70 p-2 gap-2">
              {Object.values(roleConfigs).map((cfg) => {
                const Icon = cfg.icon;
                const isActive = selectedRole === cfg.id;

                return (
                  <button
                    key={cfg.id}
                    type="button"
                    onClick={() => handleRoleSwitch(cfg.id)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border ${
                      isActive
                        ? `bg-white ${cfg.borderColor} shadow-md ring-2 ring-indigo-600/10 font-bold text-slate-900`
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/60'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${cfg.bgColor} ${cfg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold leading-tight block">
                      {cfg.title.split(' ')[0]} {cfg.title.split(' ')[1] || ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form Body for Selected Role */}
            <div className="p-6 sm:p-8">
              
              {/* Header info for currently active role */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${currentConfig.bgColor} ${currentConfig.color} border ${currentConfig.borderColor}`}>
                    <CurrentIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      {currentConfig.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {currentConfig.subtitle}
                    </p>
                  </div>
                </div>

                {/* Demo 1-Click Fast Auto-Fill button */}
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition shadow-sm"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Auto-Fill Demo Data</span>
                </button>
              </div>

              {/* Interactive Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                
                {/* Identifier Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {currentConfig.idLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={currentConfig.idPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold text-slate-900 placeholder-slate-400 transition shadow-inner"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Security Password
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Default demo password pre-filled. Click 'Sign In' to enter."); }} className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm font-semibold text-slate-900 placeholder-slate-400 transition shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Keep me authenticated on this device</span>
                  </label>

                  <span className="text-slate-500">
                    Logging in as: <strong className="text-slate-800">{currentConfig.demoUser}</strong>
                  </span>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${currentConfig.primaryBtn}`}
                >
                  {isLoading ? (
                    <span>Authenticating Session...</span>
                  ) : (
                    <>
                      <span>Sign In to {currentConfig.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>

            {/* Quick 1-Click Fast Bypass Selectors */}
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ⚡ 1-Click Fast Persona Entry
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" /> BLE Mesh Ready
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { role: 'student', title: 'Student', name: 'Krrish', color: 'hover:border-indigo-300 hover:bg-indigo-50/50' },
                  { role: 'teacher', title: 'Faculty', name: 'Dr. Manish', color: 'hover:border-emerald-300 hover:bg-emerald-50/50' },
                  { role: 'hod', title: 'HOD', name: 'Prof. Naitik', color: 'hover:border-purple-300 hover:bg-purple-50/50' },
                  { role: 'staff', title: 'Staff', name: 'Rajesh', color: 'hover:border-amber-300 hover:bg-amber-50/50' }
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => login(item.role)}
                    className={`p-2.5 rounded-xl border border-slate-200 bg-white text-left transition ${item.color} shadow-sm`}
                  >
                    <span className="block text-xs font-bold text-slate-800">{item.title}</span>
                    <span className="block text-[10px] text-slate-500">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================
             2. REGISTER NEW STUDENT (SEARCHABLE GGSIPU COLLEGES & FIELDS)
             ======================================================== */
          <div className="glass-panel-elevated rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 bg-white/95">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                  GGSIPU Student Registration & ID Issuance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your GGSIPU affiliated college, department branch, and upload your real picture to create a dynamic digital identity.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
              
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <img
                    src={photoPreview || regAvatar}
                    alt="Scholar Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-300 shadow-md"
                  />
                  <label className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md transition">
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Upload Real Student Photo</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload your picture (JPG, PNG). This will be printed on your dynamic Virtual ID Pass with anti-fraud rotating QR.
                  </p>
                  <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-50 shadow-sm transition">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Choose Picture File</span>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Row 1: Name & Enrollment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Krrish Kumar Tanti"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    University Enrollment / Roll Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regEnrollment}
                    onChange={(e) => setRegEnrollment(e.target.value)}
                    placeholder="e.g. 04214802722"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none font-mono shadow-sm"
                  />
                </div>
              </div>

              {/* Row 2: Searchable GGSIPU College & Academic Department */}
              <div className="space-y-4">
                <SearchableSelect
                  label="Select GGSIPU Affiliated College / University School *"
                  options={GGSIPU_COLLEGES}
                  value={regCollege}
                  onChange={setRegCollege}
                  placeholder="Search GGSIPU College (e.g. ADGITM, MAIT, USICT, MSIT, BPIT)..."
                  icon={Building2}
                  isCollegeList={true}
                />

                <SearchableSelect
                  label="Academic Department / Branch *"
                  options={DEPARTMENTS}
                  value={regDepartment}
                  onChange={setRegDepartment}
                  placeholder="Search Department (e.g. CSE, AIML, IT, ECE)..."
                  icon={BookOpen}
                />
              </div>

              {/* Row 3: Semester, Section, Blood Group, Valid Date (Searchable / Filterable) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableSelect
                  label="Semester"
                  options={SEMESTERS}
                  value={regSemester}
                  onChange={setRegSemester}
                  placeholder="Select Semester"
                  icon={Calendar}
                />

                <SearchableSelect
                  label="Section / Batch"
                  options={SECTIONS}
                  value={regSection}
                  onChange={setRegSection}
                  placeholder="Select Section"
                  icon={Hash}
                />

                <SearchableSelect
                  label="Blood Group"
                  options={BLOOD_GROUPS}
                  value={regBloodGroup}
                  onChange={setRegBloodGroup}
                  placeholder="Select Blood Group"
                  icon={Heart}
                />

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valid Upto</label>
                  <input
                    type="text"
                    value={regValidUpto}
                    onChange={(e) => setRegValidUpto(e.target.value)}
                    placeholder="June 2026"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Password & Submit */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Account Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set your account password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
              >
                {isLoading ? (
                  <span>Issuing Smart ID & Saving to SQLite Database...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create Scholar Profile & Enter Student Portal</span>
                  </>
                )}
              </button>

            </form>

          </div>
        )}

        {/* Footer Credit */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Built for Prasunethon 2.0 by <span className="text-slate-800 font-semibold">Team CODE it</span> (Krrish, Manish, Naitik)
        </div>

      </div>

    </div>
  );
}
