import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
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
  Filter,
  Calendar,
  Save,
  History,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Search,
  Eye,
  AlertTriangle,
  Award,
  Layers,
  X
} from 'lucide-react';

export default function TakeAttendance() {
  const { currentUser } = useAuth();
  const { 
    activeSession, 
    generateNewPasscode, 
    toggleBeaconActive, 
    studentsRoster, 
    updateStudentRosterStatus,
    markAllStudents,
    saveBatchAttendance,
    calendarAttendance
  } = useData();

  // Dual View Mode: 'live' (Live Beacon Roster) vs 'matrix' (Calendar Matrix Ledger)
  const [viewMode, setViewMode] = useState('live'); // 'live' | 'matrix'

  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'present' | 'absent' | 'leave'
  const [alertSent, setAlertSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Date, Subject, Section Selectors
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedSubject, setSelectedSubject] = useState(activeSession.subject || 'Operating Systems Lab (CSE-301)');
  const [selectedSection, setSelectedSection] = useState('CSE-A');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [dateRangeMode, setDateRangeMode] = useState('month'); // 'day' | 'week' | 'month'

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

  // Live Roster Stats calculation
  const totalStudents = studentsRoster.length;
  const presentCount = studentsRoster.filter(s => s.status === 'present').length;
  const absentCount = studentsRoster.filter(s => s.status === 'absent').length;
  const leaveCount = studentsRoster.filter(s => s.status === 'leave').length;
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  const filteredRoster = studentsRoster.filter(s => {
    if (filterMode === 'all') return true;
    return s.status === filterMode;
  });

  // Calendar Matrix Dates Generator (August 2026 dates)
  const augustLectureDates = [
    '2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07',
    '2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14',
    '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21',
    '2026-08-22', '2026-08-23'
  ];

  // Map student attendance across past lecture dates
  const studentMatrixRows = studentsRoster.map((student, idx) => {
    const records = calendarAttendance.filter(r => (r.enrollment === student.roll || r.student_name === student.name));
    const totalRecorded = augustLectureDates.length;
    
    // Compute date-wise statuses
    const dateStatusMap = {};
    augustLectureDates.forEach((d, dIdx) => {
      const match = records.find(r => r.date === d);
      if (match) {
        dateStatusMap[d] = match.status;
      } else {
        // Deterministic simulation for historical depth
        if (student.status === 'absent' && dIdx % 3 === 0) dateStatusMap[d] = 'Absent';
        else if (student.status === 'leave' && dIdx % 4 === 0) dateStatusMap[d] = 'Late / Exempt';
        else dateStatusMap[d] = 'Present';
      }
    });

    const attendedCount = Object.values(dateStatusMap).filter(st => st === 'Present' || st === 'present').length;
    const absentNum = Object.values(dateStatusMap).filter(st => st === 'Absent' || st === 'absent').length;
    const leaveNum = Object.values(dateStatusMap).filter(st => st?.includes('Late') || st?.includes('Exempt')).length;
    const cumulativePct = ((attendedCount / totalRecorded) * 100).toFixed(1);

    return {
      ...student,
      attendedCount,
      absentNum,
      leaveNum,
      totalRecorded,
      cumulativePct: parseFloat(cumulativePct),
      isEligible: parseFloat(cumulativePct) >= 75,
      dateStatusMap
    };
  });

  const filteredMatrixRows = studentMatrixRows.filter(s =>
    s.name.toLowerCase().includes(matrixSearch.toLowerCase()) ||
    s.roll?.toLowerCase().includes(matrixSearch.toLowerCase())
  );

  // Overall Matrix Metrics
  const matrixTotalSlots = studentMatrixRows.length * augustLectureDates.length;
  const matrixTotalPresent = studentMatrixRows.reduce((acc, s) => acc + s.attendedCount, 0);
  const matrixTotalAbsent = studentMatrixRows.reduce((acc, s) => acc + s.absentNum, 0);
  const matrixTotalLeave = studentMatrixRows.reduce((acc, s) => acc + s.leaveNum, 0);
  const matrixOverallPct = matrixTotalSlots > 0 ? ((matrixTotalPresent / matrixTotalSlots) * 100).toFixed(1) : 89.2;

  // Export CSV
  const exportCSV = () => {
    const headers = ['Roll No', 'Student Name', 'Total Classes', 'Attended', 'Absent', 'Leave', 'Cumulative %', 'Exam Standing'];
    const rows = studentMatrixRows.map(s => [
      `"${s.roll || s.id}"`,
      `"${s.name}"`,
      s.totalRecorded,
      s.attendedCount,
      s.absentNum,
      s.leaveNum,
      `${s.cumulativePct}%`,
      s.isEligible ? 'Eligible (>=75%)' : 'Shortage (<75%)'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + `Institution,${currentUser?.college || 'Apex Institute of Technology & Management'}\n`
      + `Subject,${selectedSubject}\n`
      + `Section,${selectedSection}\n`
      + `Generated On,${new Date().toLocaleDateString()}\n\n`
      + headers.join(',') + '\n'
      + rows.map(r => r.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Attendance_Matrix_${selectedSubject.replace(/[^a-zA-Z0-9]/g, '_')}_${selectedSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToDatabase = async () => {
    const recordsToSave = studentsRoster.map(s => ({
      id: s.id,
      name: s.name,
      enrollment: s.roll || s.id,
      status: s.status === 'present' ? 'Present' : s.status === 'leave' ? 'Late / Exempt' : 'Absent'
    }));

    await saveBatchAttendance(
      selectedDate,
      selectedSubject,
      selectedSection,
      currentUser?.name || 'Dr. Manish Verma',
      recordsToSave
    );

    setSaveSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#38BDF8', '#818CF8']
    });
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendAbsenteeAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header & Mode Switcher */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title & Affiliation Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" />
              Faculty Attendance Studio
            </span>
            <span className="text-xs text-slate-500 font-semibold">{currentUser?.college || 'College Affiliation'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            {selectedSubject} ({selectedSection})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch between real-time BLE proximity check-in and the comprehensive student calendar attendance matrix.
          </p>
        </div>

        {/* Dual View Toggle & Export Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* View Switcher Pill */}
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('live')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'live'
                  ? 'bg-white text-emerald-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Beacon Roster</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === 'matrix'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Calendar Matrix Ledger</span>
            </button>
          </div>

          {/* Export Ledger Button */}
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* Print Formal Roll-Sheet Button */}
          <button
            onClick={() => setShowPrintModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="Print Formal Roll-Sheet"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Formal PDF View</span>
          </button>

          {/* Save Ledger Button */}
          <button
            onClick={handleSaveToDatabase}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? '✓ Saved!' : 'Save Batch'}</span>
          </button>

        </div>

      </div>

      {/* Target Filters Strip */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none max-w-[220px] truncate"
            >
              <option value="Operating Systems Lab (CSE-301)">Operating Systems Lab (CSE-301)</option>
              <option value="Cloud Computing Architecture (CSE-305)">Cloud Computing Architecture (CSE-305)</option>
              <option value="Computer Networks (CSE-303)">Computer Networks (CSE-303)</option>
              <option value="Design & Analysis of Algorithms (CSE-305)">Design & Analysis of Algorithms</option>
              <option value="Object Oriented Software Design (CSE-303)">Object Oriented Software Design</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
            >
              <option value="CSE-A">CSE-A (Section A)</option>
              <option value="CSE-B">CSE-B (Section B)</option>
              <option value="Section-S1">Section-S1</option>
              <option value="Section-S2">Section-S2</option>
              <option value="Section-A4">Section-A4</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-medium">
          Teacher: <strong className="text-slate-800">{currentUser?.name || 'Dr. Manish Verma'}</strong>
        </div>

      </div>

      {/* ========================================================
          VIEW 1: LIVE BEACON ROSTER
          ======================================================== */}
      {viewMode === 'live' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Passcode Showcase */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 font-semibold">{activeSession.room || 'Lab 204, Block A'}</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {selectedSubject}
                  </h3>
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

              {/* Passcode Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 shadow-inner">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                  Dynamic Classroom Passcode (Projector Ready)
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
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Randomize Code</span>
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Board!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={() => setShowQRModal(true)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Projector QR Modal</span>
                  </button>
                </div>
              </div>

              {/* Beacon Mesh Status */}
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

            {/* Right Col: Live KPI Cards */}
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
                  Batch Controls
                </span>

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => markAllStudents('present')}
                      className="py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>All Present</span>
                    </button>

                    <button
                      onClick={() => markAllStudents('absent')}
                      className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>All Absent</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSendAbsenteeAlert}
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{alertSent ? 'Dispatched to Students!' : 'Broadcast Alert to Absentees'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Real-Time Student Roster Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Roster Matrix for {selectedSubject} ({selectedSection})
                </h3>
                <p className="text-xs text-slate-500">
                  Date: <strong className="text-slate-800">{selectedDate}</strong> • Click any card to toggle status.
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
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {mode} ({mode === 'all' ? totalStudents : studentsRoster.filter(s => s.status === mode).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Live Grid of Students */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredRoster.map((student) => {
                const isPresent = student.status === 'present';
                const isAbsent = student.status === 'absent';

                return (
                  <div
                    key={student.id || student.roll}
                    onClick={() => updateStudentRosterStatus(student.id || student.roll)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-xs flex flex-col justify-between gap-2 ${
                      isPresent
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-2xs hover:border-emerald-400'
                        : isAbsent
                        ? 'bg-rose-50/80 border-rose-300 shadow-2xs hover:border-rose-400'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono font-bold text-[10px] text-slate-600">
                        {(student.roll || student.id || '').slice(-3)}
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

        </div>
      )}

      {/* ========================================================
          VIEW 2: CALENDAR MATRIX LEDGER (DATE-BY-DATE GRID)
          ======================================================== */}
      {viewMode === 'matrix' && (
        <div className="space-y-6">
          
          {/* Class KPI Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Class Quorum</span>
                <span className="text-2xl font-black text-indigo-600">{matrixOverallPct}%</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{matrixTotalPresent} / {matrixTotalSlots} Lectures</span>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">🟢 Total Present</span>
                <span className="text-2xl font-black text-emerald-600">{matrixTotalPresent}</span>
                <span className="text-[10px] text-emerald-700 block mt-0.5">{matrixOverallPct}% Attendance Rate</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">🔴 Total Absent</span>
                <span className="text-2xl font-black text-rose-600">{matrixTotalAbsent}</span>
                <span className="text-[10px] text-rose-700 block mt-0.5">Missed Lecture Slots</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">🟡 On Approved Leave</span>
                <span className="text-2xl font-black text-amber-600">{matrixTotalLeave}</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">Medical / Official Duty OD</span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Student-by-Student Attendance Matrix Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Student-by-Student Attendance Calendar Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  Period-by-period status overview for {selectedSubject} across August 2026 lecture schedule.
                </p>
              </div>

              {/* Student Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Search student or roll..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase tracking-wider">
                  <tr>
                    <th className="p-3 bg-slate-200/80 sticky left-0 z-10 w-48 font-bold">Student Scholar</th>
                    {augustLectureDates.map(date => (
                      <th key={date} className="p-2 text-center font-mono border-l border-slate-200 min-w-[54px]">
                        {date.slice(8)} Aug
                      </th>
                    ))}
                    <th className="p-3 text-center border-l border-slate-200 bg-slate-200/80 font-bold">Held / Attended</th>
                    <th className="p-3 text-center border-l border-slate-200 bg-slate-200/80 font-bold">Cumulative %</th>
                    <th className="p-3 text-center border-l border-slate-200 bg-slate-200/80 font-bold">75% Quota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMatrixRows.map((s, sIdx) => (
                    <tr key={sIdx} className="hover:bg-slate-50/80 transition">
                      
                      {/* Sticky Student Name Column */}
                      <td className="p-3 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                            {s.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate text-xs">{s.name}</span>
                            <span className="font-mono text-[9px] text-slate-400 block">{s.roll}</span>
                          </div>
                        </div>
                      </td>

                      {/* Date Status Cells */}
                      {augustLectureDates.map(date => {
                        const status = s.dateStatusMap[date];
                        const isP = status === 'Present' || status === 'present';
                        const isA = status === 'Absent' || status === 'absent';
                        const isL = status?.includes('Late') || status?.includes('Exempt');

                        return (
                          <td key={date} className="p-1.5 text-center border-l border-slate-100">
                            <span className={`inline-block px-1.5 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                              isP ? 'bg-emerald-100 text-emerald-800' :
                              isA ? 'bg-rose-100 text-rose-800 font-black' :
                              isL ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {isP ? 'P' : isA ? 'A' : isL ? 'OD' : '-'}
                            </span>
                          </td>
                        );
                      })}

                      {/* Ratio */}
                      <td className="p-3 text-center border-l border-slate-200 font-mono font-bold text-slate-700">
                        {s.attendedCount} / {s.totalRecorded}
                      </td>

                      {/* Cumulative % */}
                      <td className="p-3 text-center border-l border-slate-200">
                        <span className={`font-mono font-black text-xs ${
                          s.isEligible ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {s.cumulativePct}%
                        </span>
                      </td>

                      {/* Standing Status Pill */}
                      <td className="p-3 text-center border-l border-slate-200">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          s.isEligible 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {s.isEligible ? 'Eligible' : 'Shortage'}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          PRINTABLE FORMAL PDF / CLEAN PRINT VIEW MODAL
          ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div className="max-w-4xl w-full rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Formal Institutional Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                OFFICIAL DEPARTMENT ATTENDANCE ROLL-SHEET
              </span>
              <h2 className="text-xl font-black text-slate-900 uppercase">
                {currentUser?.college || 'Apex Institute of Technology & Management (AITM)'}
              </h2>
              <p className="text-xs text-slate-600 font-semibold">
                {currentUser?.department || 'Department of Computer Science & Engineering'} • Academic Session 2026-27
              </p>
              <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-slate-700 pt-1">
                <span>Course: <strong>{selectedSubject}</strong></span>
                <span>•</span>
                <span>Section: <strong>{selectedSection}</strong></span>
                <span>•</span>
                <span>Lecturer: <strong>{currentUser?.name || 'Dr. Manish Verma'}</strong></span>
              </div>
            </div>

            {/* Statistics Summary Block */}
            <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Scholars</span>
                <strong className="text-slate-900">{studentMatrixRows.length}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Lectures Held</span>
                <strong className="text-slate-900">{augustLectureDates.length}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Average Attendance</span>
                <strong className="text-emerald-700">{matrixOverallPct}%</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Exam Compliant</span>
                <strong className="text-emerald-700">{studentMatrixRows.filter(s => s.isEligible).length} Students</strong>
              </div>
            </div>

            {/* Roll Sheet Print Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[10px] uppercase">
                  <tr>
                    <th className="p-2 border-r border-slate-300 w-12 text-center">S.No</th>
                    <th className="p-2 border-r border-slate-300">Enrollment No</th>
                    <th className="p-2 border-r border-slate-300">Scholar Name</th>
                    <th className="p-2 border-r border-slate-300 text-center">Attended</th>
                    <th className="p-2 border-r border-slate-300 text-center">Absent</th>
                    <th className="p-2 border-r border-slate-300 text-center">Attendance %</th>
                    <th className="p-2 text-center">Examination Eligibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentMatrixRows.map((s, i) => (
                    <tr key={i} className="text-[11px]">
                      <td className="p-2 border-r border-slate-200 text-center font-mono">{i + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono font-bold">{s.roll}</td>
                      <td className="p-2 border-r border-slate-200 font-semibold text-slate-900">{s.name}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">{s.attendedCount}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono">{s.absentNum}</td>
                      <td className="p-2 border-r border-slate-200 text-center font-mono font-black">{s.cumulativePct}%</td>
                      <td className="p-2 text-center">
                        <span className={`font-bold ${s.isEligible ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {s.isEligible ? '✓ ELIGIBLE' : '⚠️ SHORTAGE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formal Signature Blocks */}
            <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="font-serif italic font-bold text-slate-800 text-sm">
                  {currentUser?.name || 'Dr. Manish Verma'}
                </div>
                <div className="w-36 h-0.5 bg-slate-800 mx-auto"></div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  Subject Faculty Signature
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-serif italic font-bold text-indigo-700 text-sm">
                  Prof. S. K. Naitik
                </div>
                <div className="w-36 h-0.5 bg-slate-800 mx-auto"></div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                  HOD / Dean Academic Approval Stamp
                </span>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

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
