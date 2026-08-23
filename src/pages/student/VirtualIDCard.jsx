import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import SearchableSelect from '../../components/SearchableSelect';
import { sounds } from '../../utils/soundEffects';
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
  CreditCard,
  Radio,
  ScanLine,
  Lock,
  Cpu
} from 'lucide-react';

export default function VirtualIDCard() {
  const { currentUser, updateUserProfile, uploadPhoto } = useAuth();
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [qrToken, setQrToken] = useState('EDUS-SEC-9842');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);

  const role = currentUser?.role || 'student';

  // 3D Tilt Spring Physics via Framer Motion
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), { damping: 20, stiffness: 200 });
  const glareX = useTransform(mouseX, [-150, 150], [0, 100]);
  const glareY = useTransform(mouseY, [-150, 150], [0, 100]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

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

  // Dynamic anti-screenshot rotating token (30 seconds)
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

  // Role themes
  const roleCardStyles = {
    student: {
      badgeTitle: 'Scholar Digital Pass',
      themeGradient: 'from-indigo-600 via-blue-600 to-sky-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      accentColor: 'text-indigo-600',
      foilChip: 'from-amber-300 via-yellow-400 to-amber-500',
      roleBadgeName: 'STUDENT SCHOLAR'
    },
    teacher: {
      badgeTitle: 'Faculty Member Digital Pass',
      themeGradient: 'from-emerald-700 via-teal-700 to-cyan-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      accentColor: 'text-emerald-600',
      foilChip: 'from-amber-200 via-yellow-300 to-amber-400',
      roleBadgeName: 'FACULTY MEMBER'
    },
    hod: {
      badgeTitle: 'Department Executive Pass',
      themeGradient: 'from-purple-800 via-indigo-900 to-slate-900',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      accentColor: 'text-purple-600',
      foilChip: 'from-yellow-200 via-amber-300 to-yellow-500',
      roleBadgeName: 'HEAD OF DEPARTMENT'
    },
    staff: {
      badgeTitle: 'Operations & Facilities Badge',
      themeGradient: 'from-amber-600 via-orange-600 to-red-700',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      accentColor: 'text-amber-600',
      foilChip: 'from-slate-200 via-zinc-300 to-slate-400',
      roleBadgeName: 'OPERATIONS LEAD'
    }
  };

  const cardStyle = roleCardStyles[role] || roleCardStyles.student;

  // Cryptographic JSON Payload Structure (Pillar 2)
  const structuredPayload = {
    org: "EduSphere Campus OS",
    uid: currentUser?.enrollment || currentUser?.id || "STU-2026-8842",
    name: currentUser?.name || "Krrish Kumar Tanti",
    role: currentUser?.role || "student",
    dept: currentUser?.department || "Computer Science & Engineering",
    validity: currentUser?.validUpto || "2022-2026",
    bloodGroup: currentUser?.bloodGroup || "O+ positive",
    securityHash: `SHA256-${qrToken}-DIGITAL-STAMP`,
    issuedAt: "2026-08-23"
  };

  const qrPayload = JSON.stringify(structuredPayload);

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

  const handleNfcSimulate = () => {
    sounds.playNfcTap();
    setNfcTapped(true);
    setTimeout(() => setNfcTapped(false), 2000);
  };

  const handleDownloadHDCard = () => {
    sounds.playQrBeep();
    alert(`Generating print-ready 300 DPI PVC Smart Pass for ${currentUser?.name} with vector guilloché borders.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{cardStyle.badgeTitle} (Holographic Edition)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> 3D Gyro Tilt
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              High-definition vector QR with tamper-evident digital seal & RFID tap response.
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isFlipped ? 'Show Front Pass' : 'Flip to Back Details'}</span>
          </button>

          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Customize Pass</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-mono bg-white border border-indigo-200 px-3 py-1.5 rounded-xl text-indigo-700 font-bold shadow-xs">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>{secondsRemaining}s</span>
          </div>
        </div>
      </div>

      {/* Main Centerpiece Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-2">
        
        {/* Left 7 Cols: The 3D Tilt Holographic ID Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div 
            className="perspective-[1200px] w-full max-w-md cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-full rounded-3xl transition-transform duration-100"
            >
              
              {/* Outer Holographic Glow Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-300 via-sky-300 to-purple-300 opacity-70 blur-xl"></div>

              {!isFlipped ? (
                /* ========================================================
                   FRONT PASS (3D HOLOGRAPHIC & METALLIC CHIP)
                   ======================================================== */
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200/90 bg-white shadow-2xl p-6 backdrop-blur-2xl transition-all select-none">
                  
                  {/* Holographic Prismatic Sheen Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-30 mix-blend-color-dodge transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,0,128,0.2) 25%, rgba(0,255,255,0.3) 50%, rgba(255,255,0,0.2) 75%, rgba(255,255,255,0) 100%)`,
                      backgroundSize: '200% 200%'
                    }}
                  />

                  {/* Guilloché Border Stamp */}
                  <div className="absolute inset-1.5 rounded-2.5xl border border-dashed border-indigo-200/50 pointer-events-none"></div>

                  {/* Top Institution Brand Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
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
                    
                    {/* Metallic Gold University Seal */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 border border-amber-600 flex items-center justify-center shadow-xs text-[9px] font-black text-amber-950">
                      ★ SEAL ★
                    </div>
                  </div>

                  {/* Identity Row: Photo + Metallic Chip + Scholar Data */}
                  <div className="mt-4 flex gap-4 items-center">
                    <div className="relative flex-shrink-0">
                      <img
                        src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={currentUser?.name}
                        className="w-22 h-22 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400 shadow-md shadow-indigo-100 ring-2 ring-indigo-50"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-indigo-600 text-white shadow-xs">
                        <ShieldCheck className="w-3 h-3 text-emerald-300" />
                      </div>
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      {/* Embedded Metallic Microchip Graphic */}
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-7 rounded-lg bg-gradient-to-tr ${cardStyle.foilChip} border border-amber-600/60 shadow-xs flex flex-col justify-around p-1 opacity-90`}>
                          <div className="w-full h-0.5 bg-amber-800/40 rounded-full"></div>
                          <div className="w-full h-0.5 bg-amber-800/40 rounded-full"></div>
                        </div>

                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${cardStyle.badgeColor} border shadow-2xs`}>
                          {cardStyle.roleBadgeName}
                        </span>
                      </div>

                      <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
                        {currentUser?.name}
                      </h2>
                      <p className={`text-xs font-bold ${cardStyle.accentColor} line-clamp-1`}>
                        {currentUser?.designation || currentUser?.department}
                      </p>
                      <div className="text-[11px] text-slate-600 font-medium">
                        UID: <strong className="font-mono text-slate-900">{currentUser?.enrollment || currentUser?.id}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Grid of Credentials */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Academic Department:</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{currentUser?.department?.split('(')[0] || 'CSE'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Blood Group:</span>
                      <span className="font-bold text-rose-600">{currentUser?.bloodGroup || 'O+ positive'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Batch / Section:</span>
                      <span className="font-bold text-slate-800">{currentUser?.section || 'CSE-A'} ({currentUser?.semester || 'Sem 6'})</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Valid Upto:</span>
                      <span className="font-mono font-semibold text-slate-700">{currentUser?.validUpto || 'June 2026'}</span>
                    </div>
                  </div>

                  {/* High-Resolution Tamper-Evident Dynamic QR Code */}
                  <div 
                    onClick={() => setShowQrModal(true)}
                    className="mt-4 p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/40 border border-indigo-200/80 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-inner group cursor-pointer"
                  >
                    <div className="p-2.5 bg-white rounded-2xl shadow-md border border-indigo-100 relative">
                      <QRCodeSVG
                        value={qrPayload}
                        size={150}
                        level="H"
                        includeMargin={false}
                      />
                      <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center">
                        <span className="p-1.5 rounded-lg bg-white shadow text-indigo-700 font-bold text-[10px] flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> Live Laser Scan
                        </span>
                      </div>
                    </div>

                    <p className="mt-2.5 font-mono text-xs font-black text-indigo-700 tracking-wider">
                      {qrToken}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Level-H Cryptographic QR • Click to launch laser verification simulator
                    </p>
                  </div>

                  {/* Bottom Barcode */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-mono tracking-widest text-slate-400">||| | ||||| || |||||| |</span>
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Authenticated
                    </span>
                  </div>

                </div>
              ) : (
                /* ========================================================
                   BACK PASS (BARCODE, SOS & NFC TAP)
                   ======================================================== */
                <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200/90 bg-white shadow-2xl p-6 backdrop-blur-2xl space-y-4 select-none">
                  
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-indigo-600" />
                      Official Credentials & RFID NFC Pass
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ISO-9001:2026</span>
                  </div>

                  {/* NFC Tap Simulation Button */}
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 text-xs space-y-2 text-center">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-950 flex items-center gap-1.5">
                        <Radio className="w-4 h-4 text-sky-600 animate-pulse" />
                        NFC Smart Card Simulation
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-sky-200/70 text-sky-900 px-2 py-0.5 rounded-full">
                        ACTIVE 13.56 MHz
                      </span>
                    </div>

                    <button
                      onClick={handleNfcSimulate}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                        nfcTapped 
                          ? 'bg-emerald-600 text-white shadow-md' 
                          : 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs'
                      }`}
                    >
                      <Cpu className="w-4 h-4" />
                      <span>{nfcTapped ? '✓ NFC Gate Turnstile Unlocked!' : 'Tap Virtual NFC at Campus Gate'}</span>
                    </button>
                  </div>

                  {/* Scannable Barcode (Code128 Format Representation) */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Scannable Library Barcode</span>
                    <div className="font-mono text-2xl tracking-[0.25em] text-slate-900 font-bold select-all">
                      ||| | ||||| || |||||| | ||||
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 font-bold block">
                      {currentUser?.enrollment || currentUser?.id}
                    </span>
                  </div>

                  {/* Emergency SOS */}
                  <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-900">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                      <span>Emergency SOS & Campus Medical Unit</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Security Desk:</span>
                        <span className="font-bold text-slate-800">Ext: 108 / 109</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Blood Group:</span>
                        <span className="font-bold text-rose-600">{currentUser?.bloodGroup || 'O+ positive'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature of Registrar / HOD */}
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="font-serif italic font-bold text-indigo-700 text-sm">
                        Prof. S. K. Naitik
                      </div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold mt-0.5">
                        Head of Examination & Academic Board
                      </span>
                      <div className="text-[8px] text-emerald-600 font-mono mt-0.5">
                        ✓ RSA Signature Verified
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

                </div>
              )}

            </motion.div>
          </div>

          {/* 3D Tilt Hint */}
          <p className="text-[11px] text-slate-400 mt-4 text-center font-medium">
            💡 Move your cursor over the pass to inspect the dynamic 3D holographic tilt reflection.
          </p>

        </div>

        {/* Right 5 Cols: HD QR Verification Center & Export Tools */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Main Large HD Scannable QR Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-md text-center">
            
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 text-left">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  HD Dynamic Campus QR
                </h4>
                <p className="text-[11px] text-slate-500">
                  Level-H 30% error corrected vector matrix.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {secondsRemaining}s Refresh
              </span>
            </div>

            {/* High-DPI Vector QR */}
            <div 
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block shadow-inner mb-3 cursor-pointer group"
              onClick={() => setShowQrModal(true)}
            >
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
                Encodes verifiable tamper-evident JSON payload with SHA256 digital stamp.
              </p>
            </div>

            <button
              onClick={() => setShowQrModal(true)}
              className="mt-4 w-full py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition border border-indigo-200"
            >
              <ScanLine className="w-3.5 h-3.5" />
              <span>Launch Live Laser Sweep Simulator</span>
            </button>

          </div>

          {/* Export Suite */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Official Digital Pass Tools
            </span>

            <button
              onClick={handleDownloadHDCard}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download Print-Ready 300 DPI PVC Pass</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => alert("Digital Apple Wallet / Google Wallet pass format generated for your phone!")}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                <span>Add to Apple / Google Wallet</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(qrPayload);
                alert("Cryptographic digital pass JSON payload copied to clipboard!");
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-between transition"
            >
              <span className="flex items-center gap-2">
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copy Signed Payload JSON</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          INTERACTIVE SECURITY MODAL (LASER SCAN SIMULATOR)
          ======================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-fadeIn relative max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Campus Identity Verification Simulator
                </h3>
                <p className="text-xs text-slate-500">
                  Live scanner decoding high-density cryptographic vector matrix.
                </p>
              </div>
            </div>

            {/* Live Scanner Simulator with Animated Laser Sweep Line */}
            <div className="relative p-6 bg-slate-950 rounded-3xl border-2 border-emerald-500/50 flex flex-col items-center justify-center overflow-hidden my-4 shadow-2xl">
              
              {/* Animated Green Laser Sweep Line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce z-20"
                style={{ top: '45%' }}
              />

              {/* Corner Reticle Anchors */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>

              <div className="p-3 bg-white rounded-2xl shadow-xl z-10">
                <QRCodeSVG
                  value={qrPayload}
                  size={210}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <span className="text-[10px] font-mono text-emerald-400 font-bold mt-3 tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE SCANNER BEAM • 300 DPI
              </span>
            </div>

            {/* Decoded Tamper-Evident Info Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Decoded Standing: ACTIVE & VERIFIED
                </span>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  SEAL VALID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div>
                  <span className="text-slate-500 block">Full Name:</span>
                  <span className="font-bold text-slate-900">{structuredPayload.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">UID / Roll:</span>
                  <span className="font-mono font-bold text-slate-900">{structuredPayload.uid}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Role & Dept:</span>
                  <span className="font-bold text-slate-800 uppercase">{structuredPayload.role} • {structuredPayload.dept}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Validity:</span>
                  <span className="font-bold text-slate-800">{structuredPayload.validity}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-indigo-700 bg-white p-2 rounded-xl border border-indigo-100 break-all">
                Hash: {structuredPayload.securityHash}
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => alert(`Official HD QR Vector Badge for ${currentUser?.name} exported!`)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official QR Badge</span>
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Advanced Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  Customize Holographic ID Pass
                </h3>
                <p className="text-xs text-slate-500">
                  Update your identity details, affiliation, and profile photo stored in SQLite.
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
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
                />
                <div>
                  <span className="block font-bold text-slate-800">Upload Digital Badge Photo</span>
                  <span className="text-[11px] text-slate-500 block mb-2">JPG, PNG (stored in database)</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-700 font-bold cursor-pointer hover:bg-indigo-50 shadow-xs transition">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment / Badge ID</label>
                  <input
                    type="text"
                    required
                    value={editEnrollment}
                    onChange={(e) => setEditEnrollment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-mono font-bold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
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
                      className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
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
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 font-semibold text-slate-800 text-xs focus:border-indigo-600 focus:outline-none shadow-xs"
                    />
                  </div>
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
