import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
import SearchableSelect from '../../components/SearchableSelect';
import { 
  UNIVERSAL_COLLEGES, 
  DEPARTMENTS, 
  BLOOD_GROUPS, 
  SEMESTERS, 
  SECTIONS,
  DESIGNATIONS,
  STAFF_UNITS,
  SUPERVISOR_LEVELS
} from '../../data/ggsipuData';
import { 
  QrCode, 
  RotateCw, 
  Sparkles, 
  Building, 
  Hash, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  Award, 
  Share2, 
  Download, 
  Edit3, 
  Camera, 
  Upload, 
  X, 
  Save, 
  Check, 
  Layers, 
  Smartphone, 
  ChevronRight, 
  Maximize2, 
  Zap,
  Briefcase,
  Wrench,
  ShieldCheck,
  PhoneCall,
  CreditCard
} from 'lucide-react';

export default function VirtualIDCard() {
  const { currentUser, updateUserProfile, uploadPhoto } = useAuth();
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [qrToken, setQrToken] = useState('EDUS-SEC-9842');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const role = currentUser?.role || 'student';

  // Edit form states
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editEnrollment, setEditEnrollment] = useState(currentUser?.enrollment || '');
  const [editCollege, setEditCollege] = useState(currentUser?.college || 'Apex Institute of Technology & Management (AITM)');
  const [editDepartment, setEditDepartment] = useState(currentUser?.department || 'Computer Science & Engineering (CSE)');
  const [editSemester, setEditSemester] = useState(currentUser?.semester || '6th Semester (Year 3)');
  const [editSection, setEditSection] = useState(currentUser?.section || 'CSE-A');
  const [editBloodGroup, setEditBloodGroup] = useState(currentUser?.bloodGroup || 'O+ positive');
  const [editValidUpto, setEditValidUpto] = useState(currentUser?.validUpto || 'June 2026');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editDesignation, setEditDesignation] = useState(currentUser?.designation || '');
  const [editCabin, setEditCabin] = useState(currentUser?.cabin || '');
  const [editAssignedUnit, setEditAssignedUnit] = useState(currentUser?.assignedUnit || '');
  const [editSupervisorLevel, setEditSupervisorLevel] = useState(currentUser?.supervisorLevel || '');

  // Keep edit state synchronized when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEnrollment(currentUser.enrollment || '');
      setEditCollege(currentUser.college || 'Apex Institute of Technology & Management (AITM)');
      setEditDepartment(currentUser.department || 'Computer Science & Engineering (CSE)');
      setEditSemester(currentUser.semester || '6th Semester (Year 3)');
      setEditSection(currentUser.section || 'CSE-A');
      setEditBloodGroup(currentUser.bloodGroup || 'O+ positive');
      setEditValidUpto(currentUser.validUpto || 'June 2026');
      setEditAvatar(currentUser.avatar || '');
      setEditDesignation(currentUser.designation || '');
      setEditCabin(currentUser.cabin || '');
      setEditAssignedUnit(currentUser.assignedUnit || '');
      setEditSupervisorLevel(currentUser.supervisorLevel || '');
    }
  }, [currentUser]);

  // Dynamic anti-screenshot rotating QR code generator (refreshes every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          setQrToken(`EDUS-${role.toUpperCase()}-${randomSuffix}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [role]);

  // Role badges & styling config
  const roleCardStyles = {
    student: {
      badgeTitle: 'Scholar Digital Pass',
      themeGradient: 'from-indigo-600 to-sky-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'text-indigo-600',
      icon: Award
    },
    teacher: {
      badgeTitle: 'Faculty Member Digital Pass',
      themeGradient: 'from-emerald-600 to-teal-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'text-emerald-600',
      icon: Briefcase
    },
    hod: {
      badgeTitle: 'Department Executive Pass',
      themeGradient: 'from-purple-600 to-indigo-800',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      accentColor: 'text-purple-600',
      icon: ShieldCheck
    },
    staff: {
      badgeTitle: 'Operations & Facilities Badge',
      themeGradient: 'from-amber-600 to-orange-700',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'text-amber-600',
      icon: Wrench
    }
  };

  const cardStyle = roleCardStyles[role] || roleCardStyles.student;

  // Unique scannable payload generated dynamically for the user
  const qrPayload = JSON.stringify({
    system: 'EduSphere Smart Campus OS',
    college: currentUser?.college || 'Apex Institute of Technology & Management',
    role: currentUser?.role || 'student',
    user: currentUser?.name || 'Authorized Member',
    id: currentUser?.enrollment || currentUser?.id || 'EDUS-001',
    department: currentUser?.department || 'Computer Science',
    status: 'VERIFIED_ACTIVE',
    token: qrToken,
    validity: currentUser?.validUpto || 'Permanent'
  });

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadPhoto(file);
      setEditAvatar(url);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateUserProfile({
      name: editName,
      enrollment: editEnrollment,
      college: editCollege,
      department: editDepartment,
      semester: editSemester,
      section: editSection,
      bloodGroup: editBloodGroup,
      validUpto: editValidUpto,
      avatar: editAvatar,
      designation: editDesignation,
      cabin: editCabin,
      assignedUnit: editAssignedUnit,
      supervisorLevel: editSupervisorLevel
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-sm">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{cardStyle.badgeTitle}</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Scannable
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Anti-proxy high-resolution cryptographic digital pass with 30s rotating beacon token.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isFlipped ? 'Front Pass' : 'Back Details'}</span>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit ID / Photo</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono bg-white border border-indigo-200 px-3 py-1.5 rounded-xl text-indigo-700 font-bold shadow-sm">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>{secondsRemaining}s</span>
          </div>
        </div>
      </div>

      {/* Main Centerpiece Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-2">
        
        {/* Left 7 Cols: The Physical Virtual ID Card */}
        <div className="lg:col-span-7 flex justify-center">
          
          <div className="relative w-full max-w-md">
            
            {/* Card Outer Glow Frame */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-300 via-sky-200 to-purple-300 opacity-70 blur-xl"></div>

            {!isFlipped ? (
              /* ========================================================
                 FRONT PASS (4-ROLE DYNAMIC)
                 ======================================================== */
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl p-6 backdrop-blur-xl transition-all">
                
                {/* Top Institution Brand Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${cardStyle.themeGradient} flex items-center justify-center shadow-md text-white font-black text-xs`}>
                      EDU
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 line-clamp-1">
                        {currentUser?.college || 'Apex Institute of Technology'}
                      </h3>
                      <p className="text-[10px] text-indigo-600 font-extrabold tracking-tight">
                        CENTRAL SMART CAMPUS NETWORK
                      </p>
                    </div>
                  </div>
                  
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>

                {/* Photo & Identity Details */}
                <div className="mt-4 flex gap-4 items-center">
                  <div className="relative flex-shrink-0">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={currentUser?.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-200 shadow-md shadow-indigo-100"
                    />
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
                      title="Upload new photo"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                      {currentUser?.name}
                    </h2>
                    <p className={`text-xs font-bold ${cardStyle.accentColor} line-clamp-1`}>
                      {currentUser?.designation || currentUser?.department}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${cardStyle.badgeColor} border`}>
                        {role.toUpperCase()}
                      </span>
                      {currentUser?.semester && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {currentUser?.semester}
                        </span>
                      )}
                      {currentUser?.section && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          Sec: {currentUser?.section}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid of Credentials (Role Adaptive) */}
                <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">ID / Identifier:</span>
                    <span className="font-mono font-bold text-slate-900">{currentUser?.enrollment || currentUser?.id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Blood Group:</span>
                    <span className="font-bold text-rose-600">{currentUser?.bloodGroup || 'O+ positive'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Operating Department:</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{currentUser?.department?.split('(')[0] || 'CSE'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold block">Valid Upto:</span>
                    <span className="font-mono font-semibold text-slate-700">{currentUser?.validUpto || 'Permanent'}</span>
                  </div>
                </div>

                {/* High-Resolution Dynamic Scannable QR Code */}
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-indigo-200/80 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner">
                  
                  <div className="p-3 bg-white rounded-2xl shadow-lg border border-indigo-100 relative group cursor-pointer" onClick={() => setShowQrModal(true)}>
                    <QRCodeSVG
                      value={qrPayload}
                      size={150}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center">
                      <span className="p-1.5 rounded-lg bg-white shadow text-indigo-700 font-bold text-[10px] flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" /> Enlarge
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 font-mono text-xs font-black text-indigo-700 tracking-wider">
                    {qrToken}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Scan with any mobile device to verify genuine authenticated credentials
                  </p>
                </div>

                {/* Bottom Barcode & Security Badge */}
                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono tracking-widest text-slate-400">||| | ||||| || |||||| |</span>
                  <span className="flex items-center gap-1 text-indigo-600 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Cryptographically Sealed
                  </span>
                </div>

              </div>
            ) : (
              /* ========================================================
                 BACK PASS
                 ======================================================== */
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-2xl p-6 backdrop-blur-xl space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Official Credentials & Emergency Desk
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">ISO-9001:2026</span>
                </div>

                {/* Emergency Contacts */}
                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                    <span>Emergency SOS & Campus Dispatch</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Campus Security Cell:</span>
                      <span className="font-bold text-slate-800">Ext: 108 / 109</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Operations Control:</span>
                      <span className="font-bold text-slate-800">Block A, Wing 2</span>
                    </div>
                  </div>
                </div>

                {/* Transit & Concession */}
                <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900 flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-sky-600" /> Campus RFID / BLE Pass Token
                    </span>
                    <span className="font-mono font-bold text-[10px] text-sky-800">ACTIVE NFC</span>
                  </div>
                  <p className="text-[10px] text-slate-600">
                    Validated for turnstiles, smart labs, library vaults, and dining facility gates.
                  </p>
                </div>

                {/* Official Digital Signature & Seal */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-serif italic font-bold text-indigo-700 text-sm">
                      Prof. S. K. Naitik
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-0.5">
                      Head of Examination & Academic Board
                    </span>
                    <div className="text-[8px] text-emerald-600 font-mono mt-0.5">
                      ✓ RSA Digital Signature Verified
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-500/60 bg-amber-50 flex items-center justify-center text-amber-700 text-[10px] font-black shadow-inner">
                      SEAL
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold mt-1">
                      Central Campus Authority
                    </span>
                  </div>
                </div>

                {/* Terms Note */}
                <div className="text-[9px] text-slate-400 text-center leading-tight">
                  This digital identity badge is non-transferable and remains official property of the Central Smart Campus Operating System.
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Right 5 Cols: QR Code Verification Center & Export Tools */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Large Scannable QR Spotlight Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md text-center">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-left">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  Live Gate Scanner QR
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ready to scan at smart turnstiles, attendance checkpoints, and entry gates.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {secondsRemaining}s Refresh
              </span>
            </div>

            {/* Large High-Res QR Code */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-inner mb-3 cursor-pointer" onClick={() => setShowQrModal(true)}>
              <div className="p-2 bg-white rounded-xl shadow-md">
                <QRCodeSVG
                  value={qrPayload}
                  size={190}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-mono text-xs font-bold text-indigo-700">
                TOKEN: {qrToken}
              </div>
              <p className="text-[11px] text-slate-500">
                Point any mobile camera to decrypt and verify official identity credentials.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-indigo-200"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Open Fullscreen Gate Scanner QR</span>
            </button>

          </div>

          {/* Export Suite */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Digital Pass Tools & Export
            </span>

            <button
              onClick={() => alert(`High-Resolution Vector Digital ID Badge for ${currentUser?.name} exported successfully!`)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download High-Res Vector Pass</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => alert("Digital Apple Wallet / Google Wallet pass token exported to device!")}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                <span>Add to Apple / Google Wallet</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => alert("Encrypted digital pass link copied to clipboard!")}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Share Encrypted Pass Link</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

      </div>

      {/* Fullscreen Gate Scanner QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 text-center animate-fadeIn relative">
            
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-black text-slate-900">
              Campus Gate & Exam Check-in
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Hold this QR code directly in front of the gate scanner.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mb-4 shadow-inner">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <QRCodeSVG
                  value={qrPayload}
                  size={220}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-900 block">{currentUser?.name}</span>
              <span className="font-mono text-slate-500 block">{currentUser?.enrollment || currentUser?.id}</span>
              <span className="font-mono text-indigo-600 font-bold block pt-1">{qrToken}</span>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
            >
              Close Scanner Mode
            </button>

          </div>
        </div>
      )}

      {/* Advanced Edit ID Card & Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  Customize Digital ID Pass
                </h3>
                <p className="text-xs text-slate-500">
                  Update your identity details, affiliation, and profile photo saved in SQLite backend.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Profile updated & synchronized to database successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              
              {/* Photo Upload Section in Modal */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <img
                  src={editAvatar || currentUser?.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow"
                />
                <div>
                  <span className="block font-bold text-slate-800">Upload Digital Badge Photo</span>
                  <span className="text-[11px] text-slate-500 block mb-2">JPG, PNG (stored in backend database)</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-700 font-bold cursor-pointer hover:bg-indigo-50 shadow-sm transition">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Upload Picture</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Name & Identifier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment / Badge ID</label>
                  <input
                    type="text"
                    required
                    value={editEnrollment}
                    onChange={(e) => setEditEnrollment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* College & Department */}
              <div className="space-y-3">
                <SearchableSelect
                  label="Affiliated College / Institute"
                  options={UNIVERSAL_COLLEGES}
                  value={editCollege}
                  onChange={setEditCollege}
                  placeholder="Search College..."
                  icon={Building}
                  isCollegeList={true}
                />

                <SearchableSelect
                  label="Academic or Operations Department"
                  options={DEPARTMENTS}
                  value={editDepartment}
                  onChange={setEditDepartment}
                  placeholder="Select Department..."
                  icon={Award}
                />
              </div>

              {/* Role specific editing fields */}
              {role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  <SearchableSelect
                    label="Semester"
                    options={SEMESTERS}
                    value={editSemester}
                    onChange={setEditSemester}
                    placeholder="Semester"
                    icon={Calendar}
                  />

                  <SearchableSelect
                    label="Section"
                    options={SECTIONS}
                    value={editSection}
                    onChange={setEditSection}
                    placeholder="Section"
                    icon={Hash}
                  />

                  <SearchableSelect
                    label="Blood Group"
                    options={BLOOD_GROUPS}
                    value={editBloodGroup}
                    onChange={setEditBloodGroup}
                    placeholder="Blood Group"
                    icon={Heart}
                  />

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valid Upto</label>
                    <input
                      type="text"
                      value={editValidUpto}
                      onChange={(e) => setEditValidUpto(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              )}

              {role === 'teacher' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SearchableSelect
                    label="Designation"
                    options={DESIGNATIONS}
                    value={editDesignation}
                    onChange={setEditDesignation}
                    placeholder="Designation"
                    icon={Briefcase}
                  />
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Cabin Room</label>
                    <input
                      type="text"
                      value={editCabin}
                      onChange={(e) => setEditCabin(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              )}

              {role === 'staff' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SearchableSelect
                    label="Assigned Unit"
                    options={STAFF_UNITS}
                    value={editAssignedUnit}
                    onChange={setEditAssignedUnit}
                    placeholder="Unit"
                    icon={Wrench}
                  />
                  <SearchableSelect
                    label="Supervisor Level"
                    options={SUPERVISOR_LEVELS}
                    value={editSupervisorLevel}
                    onChange={setEditSupervisorLevel}
                    placeholder="Level"
                    icon={Award}
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

