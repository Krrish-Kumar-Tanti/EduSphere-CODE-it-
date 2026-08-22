import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  RefreshCw, 
  Copy, 
  QrCode, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Play,
  Pause,
  Download,
  Share2,
  FileSpreadsheet,
  Signal,
  Smartphone,
  Send,
  Filter
} from 'lucide-react';

export default function TakeAttendance() {
  const { 
    activeSession, 
    generateNewPasscode, 
    toggleBeaconActive, 
    studentsRoster, 
    updateStudentRosterStatus,
    markAllStudents
  } = useData();

  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'present' | 'absent' | 'leave'
  const [alertSent, setAlertSent] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeSession.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Stats calculation
  const totalStudents = studentsRoster.length;
  const presentCount = studentsRoster.filter(s => s.status === 'present').length;
  const absentCount = studentsRoster.filter(s => s.status === 'absent').length;
  const leaveCount = studentsRoster.filter(s => s.status === 'leave').length;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const filteredRoster = studentsRoster.filter(s => {
    if (filterMode === 'all') return true;
    return s.status === filterMode;
  });

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "RollNo,Name,Status,Signal,Device,Time\n"
      + studentsRoster.map(e => `${e.roll || e.rollNo},${e.name},${e.status},${e.bleRssi || 'N/A'},${e.device || 'N/A'},${e.verifiedAt || 'N/A'}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_${activeSession.subject}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendAbsenteeAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Board PIN & Beacon Control Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Dynamic Room PIN Generator & Broadcast Engine */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Attendance Studio
                </span>
                <span className="text-xs text-slate-500 font-semibold">{activeSession.room || activeSession.venue}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {activeSession.subject}
              </h2>
            </div>

            {/* Session Countdown Timer */}
            <div className="p-2.5 px-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{formatTimer(timerSeconds)}</span>
              </div>
              <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-600"
                  title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setTimerSeconds(prev => prev + 300)}
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 text-[10px] font-bold"
                  title="Add 5 minutes"
                >
                  +5m
                </button>
              </div>
            </div>
          </div>

          {/* Huge Dynamic PIN Showcase Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 shadow-inner">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
              Dynamic Classroom Room Code (Projector Ready)
            </span>
            
            <div className="flex items-center justify-center gap-3">
              <div className="font-mono text-4xl sm:text-6xl font-black text-emerald-600 tracking-wider">
                {activeSession.code}
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Students must be physically within <strong className="text-slate-800">0.8m of BLE Beacon</strong> before entering this room PIN.
            </p>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={generateNewPasscode}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Randomize Code</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Board!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={() => setShowQRModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Projector QR Modal</span>
              </button>
            </div>
          </div>

          {/* Quick BLE Broadcast Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${activeSession.beaconActive !== false ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
              <span>Hardware Beacon: <strong className="font-mono text-slate-800">{activeSession.beaconId}</strong></span>
            </div>
            
            <button
              onClick={toggleBeaconActive}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSession.beaconActive !== false
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                  : 'bg-slate-100 text-slate-500 border border-slate-200'
              }`}
            >
              BLE Broadcasting: {activeSession.beaconActive !== false ? 'ON' : 'PAUSED'}
            </button>
          </div>

        </div>

        {/* Right Col: Live KPI Cards Strip */}
        <div className="space-y-4">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Attendance Live Pulse
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {attendancePercentage}% Quorum
              </span>
            </div>

            {/* Attendance Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 flex gap-1">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(presentCount / totalStudents) * 100}%` }}
                ></div>
                <div 
                  className="bg-slate-300 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(leaveCount / totalStudents) * 100}%` }}
                ></div>
                <div 
                  className="bg-rose-400 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${(absentCount / totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Summary Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Present</span>
                <span className="text-xl font-black text-emerald-700">{presentCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-800 font-bold uppercase block">Absent</span>
                <span className="text-xl font-black text-rose-700">{absentCount}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-600 font-bold uppercase block">Leave</span>
                <span className="text-xl font-black text-slate-700">{leaveCount}</span>
              </div>
            </div>
          </div>

          {/* Batch Quick Operations */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
              Batch Quick Controls
            </span>

            <div className="space-y-2">
              <button
                onClick={() => markAllStudents('present')}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark All As Present</span>
              </button>

              <button
                onClick={handleSendAbsenteeAlert}
                className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{alertSent ? 'Alert Dispatched to Students!' : 'Broadcast Alert to Absentees'}</span>
              </button>

              <button
                onClick={exportCSV}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Attendance CSV</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Real-Time Student Roster Grid ("See Results") */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Roster Controls & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Real-Time Student Roster Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Color coding: 🟢 Present (BLE Verified) • 🔴 Absent • ⚪ Approved Leave. Click any card to toggle.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-auto">
            {['all', 'present', 'absent', 'leave'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                  filterMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode} ({mode === 'all' ? totalStudents : studentsRoster.filter(s => s.status === mode).length})
              </button>
            ))}
          </div>
        </div>

        {/* Live Grid of 30+ Students */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredRoster.map((student) => {
            const isPresent = student.status === 'present';
            const isAbsent = student.status === 'absent';
            const isLeave = student.status === 'leave';

            return (
              <div
                key={student.id || student.roll || student.rollNo}
                onClick={() => updateStudentRosterStatus(student.id || student.roll || student.rollNo)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-xs flex flex-col justify-between gap-2 ${
                  isPresent
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs hover:border-emerald-400'
                    : isAbsent
                    ? 'bg-rose-50/80 border-rose-300 shadow-xs hover:border-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono font-bold text-[10px] text-slate-600">
                    {(student.roll || student.rollNo || '').slice(-3)}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isPresent ? 'bg-emerald-500' : isAbsent ? 'bg-rose-500' : 'bg-slate-400'
                  }`}></span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-xs truncate" title={student.name}>
                    {student.name}
                  </h4>
                  <span className={`text-[10px] font-semibold block uppercase ${
                    isPresent ? 'text-emerald-700' : isAbsent ? 'text-rose-700' : 'text-slate-500'
                  }`}>
                    {student.status}
                  </span>
                </div>

                {isPresent && (
                  <div className="text-[9px] text-emerald-800 font-mono flex items-center justify-between border-t border-emerald-200/80 pt-1">
                    <span>{student.bleRssi || '-68 dBm'}</span>
                    <span>{student.verifiedAt || 'Live'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Projector QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-center space-y-6 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Projector Display Mode
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Scan with EduSphere App
              </h3>
            </div>

            {/* Huge QR Mockup */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 inline-block shadow-inner">
              <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-800 flex flex-col items-center justify-center relative">
                <QrCode className="w-44 h-44 text-slate-900" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 block">Dynamic Room Code</span>
              <span className="text-4xl font-mono font-black text-emerald-600 tracking-wider">
                {activeSession.code}
              </span>
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Close Projector View
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

