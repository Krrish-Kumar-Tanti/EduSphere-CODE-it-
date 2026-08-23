import React, { useState } from 'react';
import { useAuth, INITIAL_USER_ACCOUNTS } from '../context/AuthContext';
import SearchableSelect from '../components/SearchableSelect';
import { 
  UNIVERSAL_COLLEGES, 
  DEPARTMENTS, 
  BLOOD_GROUPS, 
  SEMESTERS, 
  SECTIONS, 
  DESIGNATIONS, 
  STAFF_UNITS, 
  SUPERVISOR_LEVELS 
} from '../data/ggsipuData';
import { UNIVERSITIES } from '../data/syllabusData';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
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
  Briefcase,
  Layers,
  Award,
  AlertCircle,
  Zap
} from 'lucide-react';

export default function Login() {
  const { login, register, uploadPhoto } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student');
  const [regRole, setRegRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Clean Zero-Pollution Login Form states (EMPTY BY DEFAULT)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Universal Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUniversity, setRegUniversity] = useState('GGSIPU');
  const [regCollege, setRegCollege] = useState('Apex Institute of Technology & Management (AITM)');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering (CSE)');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Role-Specific Registration States
  // Student
  const [regEnrollment, setRegEnrollment] = useState('');
  const [regSemester, setRegSemester] = useState('6th Semester (Year 3)');
  const [regSection, setRegSection] = useState('CSE-A');
  const [regBloodGroup, setRegBloodGroup] = useState('O+ positive');
  const [regValidUpto, setRegValidUpto] = useState('June 2026');

  // Faculty
  const [regFacultyId, setRegFacultyId] = useState('');
  const [regDesignation, setRegDesignation] = useState('Associate Professor');
  const [regSubjects, setRegSubjects] = useState('Operating Systems Lab, Cloud Computing');
  const [regCabin, setRegCabin] = useState('Room 304, Academic Block A');

  // HOD
  const [regAdminCode, setRegAdminCode] = useState('');
  const [regHodCabin, setRegHodCabin] = useState('Room 101, Executive Wing');
  const [regSignature, setRegSignature] = useState('RSA-SEAL-HOD-CSE-CHAIR');

  // Ground Staff
  const [regStaffBadge, setRegStaffBadge] = useState('');
  const [regAssignedUnit, setRegAssignedUnit] = useState('Campus Infrastructure & Maintenance');
  const [regSupervisorLevel, setRegSupervisorLevel] = useState('Lead Operations Supervisor');

  const roleConfigs = {
    student: {
      id: 'student',
      title: 'Student Scholar Portal',
      subtitle: 'Dynamic BLE Presence, 3D Holographic Pass & Notes Vault',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      primaryBtn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25',
      idLabel: 'University Enrollment / Roll Number',
      idPlaceholder: 'e.g. 04214802722 or student email',
      demoCreds: { id: '04214802722', pass: 'krrish@2026' }
    },
    teacher: {
      id: 'teacher',
      title: 'Faculty Member Portal',
      subtitle: 'Attendance Studio, DTU/GGSIPU Syllabus Tracker & Timetable View',
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25',
      idLabel: 'Faculty Employee Code / University Email',
      idPlaceholder: 'e.g. FAC-1092 or manish.verma@campus.edu',
      demoCreds: { id: 'FAC-1092', pass: 'faculty@2026' }
    },
    hod: {
      id: 'hod',
      title: 'HOD Executive Console',
      subtitle: 'Master Timetable Command Center, Digital Signatures & Approvals',
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      primaryBtn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/25',
      idLabel: 'HOD Admin Code / University Email',
      idPlaceholder: 'e.g. HOD-001 or hod.cse@campus.edu',
      demoCreds: { id: 'HOD-001', pass: 'hod@admin2026' }
    },
    staff: {
      id: 'staff',
      title: 'Operations & Facilities Portal',
      subtitle: 'Live Ticket Inbox, Maintenance & Emergency Medical Dispatch',
      icon: Wrench,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      primaryBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25',
      idLabel: 'Staff Badge ID / Service Unit PIN',
      idPlaceholder: 'e.g. STF-504 or rajesh.facilities@campus.edu',
      demoCreds: { id: 'STF-504', pass: 'staff@ops2026' }
    }
  };

  const currentConfig = roleConfigs[selectedRole];
  const CurrentIcon = currentConfig.icon;

  const handleRoleSwitch = (roleId) => {
    setSelectedRole(roleId);
    setAuthError(null);
  };

  const handleQuickDemoFill = (roleId) => {
    const cfg = roleConfigs[roleId];
    setSelectedRole(roleId);
    setIdentifier(cfg.demoCreds.id);
    setPassword(cfg.demoCreds.pass);
    setAuthError(null);
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
    if (!identifier.trim() || !password.trim()) {
      setAuthError('Please enter your enrollment/ID and password.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    const result = await login(selectedRole, { 
      identifier: identifier.trim(), 
      password: password.trim(), 
      role: selectedRole 
    });

    if (result && result.error) {
      setAuthError(result.error);
    }
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regPassword.trim()) {
      setAuthError('Full name and password are required.');
      return;
    }

    setIsLoading(true);
    setAuthError(null);

    let userData = {
      name: regName.trim(),
      email: regEmail.trim(),
      university: regUniversity,
      college: regCollege,
      department: regDepartment,
      avatar: regAvatar,
      password: regPassword,
      role: regRole
    };

    if (regRole === 'student') {
      userData = {
        ...userData,
        enrollment: regEnrollment.trim() || `0421480${Math.floor(1000 + Math.random() * 9000)}`,
        semester: regSemester,
        section: regSection,
        bloodGroup: regBloodGroup,
        validUpto: regValidUpto
      };
    } else if (regRole === 'teacher') {
      userData = {
        ...userData,
        enrollment: regFacultyId.trim() || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
        badgeId: regFacultyId.trim() || `FAC-${Math.floor(1000 + Math.random() * 9000)}`,
        designation: regDesignation,
        subjects: regSubjects,
        cabin: regCabin,
        semester: 'Faculty',
        section: 'Department Wide'
      };
    } else if (regRole === 'hod') {
      userData = {
        ...userData,
        enrollment: regAdminCode.trim() || `HOD-${Math.floor(100 + Math.random() * 900)}`,
        adminCode: regAdminCode.trim() || `HOD-${Math.floor(100 + Math.random() * 900)}`,
        cabin: regHodCabin,
        digitalSignature: regSignature || 'RSA-SEAL-HOD-VERIFIED',
        designation: 'Head of Department & Professor',
        semester: 'Executive Office',
        section: 'All Department Sections'
      };
    } else if (regRole === 'staff') {
      userData = {
        ...userData,
        enrollment: regStaffBadge.trim() || `STF-${Math.floor(100 + Math.random() * 900)}`,
        badgeId: regStaffBadge.trim() || `STF-${Math.floor(100 + Math.random() * 900)}`,
        assignedUnit: regAssignedUnit,
        supervisorLevel: regSupervisorLevel,
        designation: regSupervisorLevel,
        semester: 'Operations',
        section: 'Campus Wide'
      };
    }

    const result = await register(userData);
    if (result && result.error) {
      setAuthError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      
      {/* Ambient Radial Background Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-indigo-100/70 via-sky-100/60 to-purple-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-sky-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-slate-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Smart Campus Operating System
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            EduSphere
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Unified next-gen academic OS with DTU & GGSIPU curriculum intelligence, 3D holographic virtual IDs, and live attendance mesh.
          </p>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Register 4-Role Digital ID) */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <button
              onClick={() => { setAuthMode('login'); setAuthError(null); }}
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
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                authMode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Issue New ID / Register</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Fill Bar */}
        {authMode === 'login' && (
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-2xl bg-white/80 border border-slate-200/90 shadow-2xs backdrop-blur-sm">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Quick Demo Fill:
            </span>
            {[
              { id: 'student', label: 'Student (Krrish)', color: 'hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200' },
              { id: 'teacher', label: 'Faculty (Dr. Manish)', color: 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200' },
              { id: 'hod', label: 'HOD (Prof. Naitik)', color: 'hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200' },
              { id: 'staff', label: 'Staff (Rajesh)', color: 'hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' }
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => handleQuickDemoFill(pill.id)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 transition ${pill.color}`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        )}

        {/* Auth Error Banner if any */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

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
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Remember my session on this browser</span>
                  </label>

                  <span className="text-slate-500 font-medium">
                    Role: <strong className="text-slate-800 uppercase">{selectedRole}</strong>
                  </span>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${currentConfig.primaryBtn}`}
                >
                  {isLoading ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Enter {currentConfig.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>

          </div>
        ) : (
          /* ========================================================
             2. DYNAMIC 4-ROLE REGISTRATION & DIGITAL BADGE ISSUANCE
             ======================================================== */
          <div className="glass-panel-elevated rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-8 bg-white/95">
            
            <div className="pb-4 mb-6 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-6 h-6 text-indigo-600" />
                Issue New Digital Identity Pass & Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your role to load the dedicated credentials form. Registered details are persisted into SQLite and printed on your 3D holographic virtual pass.
              </p>
            </div>

            {/* Target Role Selector for Registration */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {[
                { id: 'student', title: 'Student Scholar', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                { id: 'teacher', title: 'Faculty Member', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                { id: 'hod', title: 'HOD Executive', icon: ShieldCheck, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                { id: 'staff', title: 'Ground Staff', icon: Wrench, color: 'text-amber-600 bg-amber-50 border-amber-200' }
              ].map(item => {
                const ItemIcon = item.icon;
                const isSelected = regRole === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRegRole(item.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 transition text-left ${
                      isSelected 
                        ? `${item.color} font-bold ring-2 ring-indigo-600/20 shadow-xs` 
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ItemIcon className="w-4 h-4 shrink-0" />
                    <span className="text-xs">{item.title}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-5 text-xs">
              
              {/* Photo Upload Section */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <img
                    src={photoPreview || regAvatar}
                    alt="Digital Pass Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-300 shadow-md"
                  />
                  <label className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md transition">
                    <Camera className="w-3.5 h-3.5" />
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Upload Digital Badge Photo</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload your picture (JPG, PNG). This will be printed on your {regRole.toUpperCase()} Holographic Virtual ID Pass with dynamic rotating security QR code.
                  </p>
                  <label className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-700 font-semibold cursor-pointer hover:bg-indigo-50 shadow-xs transition">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Choose Picture File</span>
                    <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                  </label>
                </div>
              </div>

              {/* University Affiliation Choice (DTU vs GGSIPU) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Target Curriculum & University Framework *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {UNIVERSITIES.map(uni => (
                    <button
                      key={uni.id}
                      type="button"
                      onClick={() => setRegUniversity(uni.id)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        regUniversity === uni.id
                          ? 'border-indigo-600 bg-indigo-50/70 font-bold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-slate-900 block text-xs">{uni.shortName}</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">{uni.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Universal Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Manish Verma or Krrish Kumar Tanti"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Official / University Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. name@campus.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                  />
                </div>
              </div>

              {/* Universal Row 2: College & Academic Department */}
              <div className="space-y-4">
                <SearchableSelect
                  label="Select Affiliated College / Institute *"
                  options={UNIVERSAL_COLLEGES}
                  value={regCollege}
                  onChange={setRegCollege}
                  placeholder="Search College / Institute..."
                  icon={Building2}
                  isCollegeList={true}
                />

                <SearchableSelect
                  label="Department / Operating Unit *"
                  options={DEPARTMENTS}
                  value={regDepartment}
                  onChange={setRegDepartment}
                  placeholder="Select Academic or Operations Department..."
                  icon={BookOpen}
                />
              </div>

              {/* ROLE SPECIFIC FIELDS */}

              {/* --- A. STUDENT SPECIFIC FIELDS --- */}
              {regRole === 'student' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none font-mono shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Valid Upto</label>
                      <input
                        type="text"
                        value={regValidUpto}
                        onChange={(e) => setRegValidUpto(e.target.value)}
                        placeholder="June 2026"
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  </div>
                </div>
              )}

              {/* --- B. FACULTY SPECIFIC FIELDS --- */}
              {regRole === 'teacher' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Faculty ID / Employee Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={regFacultyId}
                        onChange={(e) => setRegFacultyId(e.target.value)}
                        placeholder="e.g. FAC-1092"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-emerald-600 focus:outline-none font-mono shadow-xs"
                      />
                    </div>

                    <SearchableSelect
                      label="Academic Designation *"
                      options={DESIGNATIONS}
                      value={regDesignation}
                      onChange={setRegDesignation}
                      placeholder="Select Designation"
                      icon={Briefcase}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Subjects Taught
                      </label>
                      <input
                        type="text"
                        value={regSubjects}
                        onChange={(e) => setRegSubjects(e.target.value)}
                        placeholder="e.g. Operating Systems Lab, Cloud Computing"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-emerald-600 focus:outline-none shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Cabin / Room Number
                      </label>
                      <input
                        type="text"
                        value={regCabin}
                        onChange={(e) => setRegCabin(e.target.value)}
                        placeholder="e.g. Room 304, Academic Block A"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-emerald-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* --- C. HOD SPECIFIC FIELDS --- */}
              {regRole === 'hod' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        HOD Admin Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={regAdminCode}
                        onChange={(e) => setRegAdminCode(e.target.value)}
                        placeholder="e.g. HOD-001"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-purple-600 focus:outline-none font-mono shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        HOD Executive Cabin
                      </label>
                      <input
                        type="text"
                        value={regHodCabin}
                        onChange={(e) => setRegHodCabin(e.target.value)}
                        placeholder="e.g. Room 101, Executive Wing"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-purple-600 focus:outline-none shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Department Seal / RSA Signature Stamp
                    </label>
                    <input
                      type="text"
                      value={regSignature}
                      onChange={(e) => setRegSignature(e.target.value)}
                      placeholder="e.g. RSA-SEAL-HOD-CSE-CHAIR"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-purple-600 focus:outline-none font-mono shadow-xs"
                    />
                  </div>
                </div>
              )}

              {/* --- D. GROUND STAFF SPECIFIC FIELDS --- */}
              {regRole === 'staff' && (
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Staff Badge ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={regStaffBadge}
                        onChange={(e) => setRegStaffBadge(e.target.value)}
                        placeholder="e.g. STF-504"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-amber-600 focus:outline-none font-mono shadow-xs"
                      />
                    </div>

                    <SearchableSelect
                      label="Assigned Operations Unit *"
                      options={STAFF_UNITS}
                      value={regAssignedUnit}
                      onChange={setRegAssignedUnit}
                      placeholder="Select Unit"
                      icon={Wrench}
                    />

                    <SearchableSelect
                      label="Supervisor Level *"
                      options={SUPERVISOR_LEVELS}
                      value={regSupervisorLevel}
                      onChange={setRegSupervisorLevel}
                      placeholder="Select Level"
                      icon={Award}
                    />
                  </div>
                </div>
              )}

              {/* Security Password */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 mb-1">
                  Create Account Password *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Set your secure account password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition"
              >
                {isLoading ? (
                  <span>Issuing Digital Badge & Saving Profile...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Issue {regRole.toUpperCase()} Digital ID & Launch Portal</span>
                  </>
                )}
              </button>

            </form>

          </div>
        )}

        {/* Footer Credit */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Smart Campus Operating System • <span className="text-slate-800 font-semibold">Team CODE it</span>
        </div>

      </div>

    </div>
  );
}
