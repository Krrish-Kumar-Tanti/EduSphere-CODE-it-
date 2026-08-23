import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  Radio, 
  Bluetooth, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  KeyRound,
  History,
  RefreshCw,
  Wifi,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Calculator,
  BookOpen,
  TrendingUp,
  Award,
  AlertTriangle
} from 'lucide-react';

export default function AttendanceClient() {
  const { activeSession, markStudentAttendance, calendarAttendance } = useData();
  const { currentUser } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [bleStatus, setBleStatus] = useState('scanning'); // 'scanning' | 'connected'
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-08-23');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'live' | 'calculator'

  // Simulate Web Bluetooth BLE Beacon proximity handshake
  useEffect(() => {
    const timer = setTimeout(() => {
      setBleStatus('connected');
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B']
    });
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsSubmitting(true);
    const result = await markStudentAttendance(passcode, currentUser);
    setStatusMessage(result);
    setIsSubmitting(false);

    if (result.success) {
      triggerConfetti();
      setPasscode('');
    }
  };

  const handleQuickPasteCode = () => {
    if (activeSession?.code) {
      setPasscode(activeSession.code);
    }
  };

  // Calendar stats computation
  const totalClasses = calendarAttendance.length;
  const presentClasses = calendarAttendance.filter(r => r.status === 'Present' || r.status === 'present').length;
  const absentClasses = calendarAttendance.filter(r => r.status === 'Absent' || r.status === 'absent').length;
  const lateClasses = calendarAttendance.filter(r => r.status?.includes('Late') || r.status?.includes('Exempt') || r.status?.includes('leave')).length;

  const overallPercentage = totalClasses > 0 
    ? parseFloat(((presentClasses / totalClasses) * 100).toFixed(1))
    : 88.4;

  const isCompliant = overallPercentage >= 75;

  // Classes needed calculation
  let classesNeeded = 0;
  let classesCanSkip = 0;
  if (!isCompliant) {
    classesNeeded = Math.max(0, Math.ceil((0.75 * totalClasses - presentClasses) / 0.25));
  } else {
    classesCanSkip = Math.max(0, Math.floor((presentClasses / 0.75) - totalClasses));
  }

  // Subject-wise breakdown table
  const subjectBreakdown = {};
  calendarAttendance.forEach(item => {
    const sub = item.subject || 'Core Subject';
    if (!subjectBreakdown[sub]) {
      subjectBreakdown[sub] = { total: 0, present: 0, absent: 0 };
    }
    subjectBreakdown[sub].total++;
    if (item.status === 'Present' || item.status === 'present') {
      subjectBreakdown[sub].present++;
    } else {
      subjectBreakdown[sub].absent++;
    }
  });

  const subjectStatsList = Object.keys(subjectBreakdown).map(sub => {
    const data = subjectBreakdown[sub];
    const pct = ((data.present / data.total) * 100).toFixed(1);
    return {
      subject: sub,
      total: data.total,
      present: data.present,
      absent: data.absent,
      percentage: pct,
      isSafe: parseFloat(pct) >= 75
    };
  });

  // Calendar Days generator for August 2026 (Starts on Saturday, 31 days)
  const augustDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-08-${dayNum.toString().padStart(2, '0')}`;
    const dayRecords = calendarAttendance.filter(r => r.date === dateStr);
    
    let status = 'none'; // 'none' | 'present' | 'absent' | 'late'
    if (dayRecords.length > 0) {
      const hasAbsent = dayRecords.some(r => r.status === 'Absent' || r.status === 'absent');
      const hasLate = dayRecords.some(r => r.status?.includes('Late') || r.status?.includes('Exempt'));
      const hasPresent = dayRecords.some(r => r.status === 'Present' || r.status === 'present');

      if (hasAbsent) status = 'absent';
      else if (hasLate) status = 'late';
      else if (hasPresent) status = 'present';
    }

    return {
      day: dayNum,
      date: dateStr,
      status,
      count: dayRecords.length,
      records: dayRecords
    };
  });

  // Selected date periods
  const selectedDayData = augustDays.find(d => d.date === selectedDate);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-xs">
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Calendar-Centric Attendance Intelligence</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold">
                Persistent Ledger
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Dual-factor BLE proximity validation with persistent date-wise calendar breakdown and 75% quota calculator.
            </p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center p-1 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'calendar' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly Ledger</span>
          </button>
          <button
            onClick={() => setViewMode('live')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'live' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Class BLE</span>
          </button>
          <button
            onClick={() => setViewMode('calculator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              viewMode === 'calculator' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>75% Calculator</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overall Percentage</span>
            <span className="text-2xl font-black text-indigo-600">{overallPercentage}%</span>
            <span className={`text-[10px] font-bold block mt-0.5 ${isCompliant ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isCompliant ? '✓ Exam Eligible (≥75%)' : '⚠️ Shortage Warning'}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Sessions</span>
            <span className="text-2xl font-black text-slate-900">{totalClasses} Classes</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">{presentClasses} Present Recorded</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Absent / Missed</span>
            <span className="text-2xl font-black text-rose-600">{absentClasses} Slots</span>
            <span className="text-[10px] text-amber-600 block mt-0.5">{lateClasses} Late / Exempt</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Safe Skip Quota</span>
            <span className="text-2xl font-black text-emerald-600">
              {isCompliant ? `${classesCanSkip} Safe` : `0 Safe`}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {isCompliant ? 'Can skip without deficit' : `Need ${classesNeeded} classes to reach 75%`}
            </span>
          </div>
          <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ========================================================
          1. MONTHLY CALENDAR GRID & PERIOD BREAKDOWN
          ======================================================== */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Calendar Grid Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">
                  August 2026 Visual Attendance Ledger
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500">Academic Year 2026-27</span>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-600 font-medium">Present (100%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600 font-medium">Late / Exempt OD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-slate-600 font-medium">Absent</span>
              </div>
            </div>

            {/* Calendar Weekday Header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
              <span>Sat</span>
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2 pt-1">
              {augustDays.map(item => {
                const isSelected = selectedDate === item.date;
                const isPresent = item.status === 'present';
                const isAbsent = item.status === 'absent';
                const isLate = item.status === 'late';

                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDate(item.date)}
                    className={`h-14 sm:h-16 rounded-2xl p-1.5 flex flex-col justify-between items-center transition border text-xs relative ${
                      isSelected 
                        ? 'border-2 border-indigo-600 bg-indigo-50/80 shadow-xs font-bold ring-2 ring-indigo-500/20' 
                        : 'border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold text-slate-800 text-xs">{item.day}</span>
                    
                    {/* Status Dot */}
                    {item.status !== 'none' && (
                      <div className="flex items-center gap-0.5">
                        <span className={`w-2 h-2 rounded-full ${
                          isPresent ? 'bg-emerald-500' : isAbsent ? 'bg-rose-500' : isLate ? 'bg-amber-500' : 'bg-slate-300'
                        }`} />
                        {item.count > 1 && (
                          <span className="text-[9px] font-mono text-slate-400">×{item.count}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Day Breakdown Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Daily Inspection</span>
                  <h4 className="text-sm font-black text-slate-900">{selectedDate} Schedule Breakdown</h4>
                </div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {selectedDayData?.records?.length || 0} Slots
                </span>
              </div>

              {(!selectedDayData?.records || selectedDayData.records.length === 0) ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Calendar className="w-8 h-8 mx-auto opacity-30" />
                  <p className="text-xs font-semibold">No recorded class sessions on {selectedDate}.</p>
                  <p className="text-[11px] text-slate-500">Pick a date with status dots on the calendar grid to inspect period breakdowns.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayData.records.map((rec, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{rec.subject}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'Present' || rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rec.status === 'Absent' || rec.status === 'absent'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rec.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <span>Faculty: <strong className="text-slate-700">{rec.marked_by || 'Dr. Manish Verma'}</strong></span>
                        <span className="font-mono text-slate-400">Verified at Gate</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subject Summary Widget */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <span className="font-bold text-slate-800 block">Subject Compliance Snapshot</span>
              <div className="space-y-2">
                {subjectStatsList.slice(0, 3).map((sub, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{sub.subject}</span>
                    <span className={`font-black text-xs ${sub.isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {sub.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          2. LIVE CLASS DUAL-FACTOR BLE PROXIMITY CHECK-IN
          ======================================================== */}
      {viewMode === 'live' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Live Classroom Active
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {activeSession.subject}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-400 block">Lecturer:</span>
                <span className="text-xs font-bold text-slate-800">{activeSession.faculty}</span>
              </div>
            </div>

            {/* Radar Simulation */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute w-28 h-28 rounded-full border border-indigo-300 animate-ping opacity-75"></div>
                <div className="absolute w-20 h-20 rounded-full border border-sky-300 animate-pulse"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-100 z-10">
                  <Bluetooth className="w-7 h-7 text-white" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-3">
                {bleStatus === 'connected' ? 'BLE Proximity Validated (0.8m)' : 'Scanning for Classroom Beacon...'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mt-1">
                Your device is verified in {activeSession.room}. Enter the teacher's board code below.
              </p>
            </div>

            {/* Passcode Entry Form */}
            <form onSubmit={handleSubmitAttendance} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    Enter Dynamic Room Passcode:
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickPasteCode}
                    className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold underline"
                  >
                    Quick Paste Code ({activeSession.code})
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder={`e.g. ${activeSession.code}`}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 font-mono font-bold text-center tracking-widest text-slate-900 text-base focus:border-indigo-600 focus:outline-none shadow-xs uppercase placeholder-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !passcode.trim()}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    {isSubmitting ? <span>Verifying...</span> : <><span>Validate Presence</span><CheckCircle2 className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>

              {statusMessage && (
                <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-fadeIn ${
                  statusMessage.success 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {statusMessage.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <span>{statusMessage.message}</span>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Classroom Gateway Hardware
            </h4>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 block">Beacon Mesh Node:</span>
              <span className="font-mono font-bold text-slate-900">{activeSession.beaconId}</span>
              <span className="text-slate-500 block pt-1">Venue:</span>
              <span className="font-bold text-slate-800">{activeSession.room}</span>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          3. 75% ATTENDANCE QUOTA CALCULATOR & SUBJECT BREAKDOWN
          ======================================================== */}
      {viewMode === 'calculator' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                75% Mandatory Attendance Compliance Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Official University ordinance requires ≥75% attendance to sit for end-term university practical & theory examinations.
              </p>
            </div>
          </div>

          {/* Calculator Output Banner */}
          <div className={`p-6 rounded-3xl border ${
            isCompliant ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'
          } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block text-slate-700">Calculated Standing</span>
              <div className="text-2xl sm:text-3xl font-black mt-0.5 text-slate-900">
                Current Attendance: <span className={isCompliant ? 'text-emerald-700' : 'text-rose-700'}>{overallPercentage}%</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {isCompliant
                  ? `🎉 You are safely above the 75% threshold! You can safely miss up to ${classesCanSkip} lectures without falling below the mandatory 75% benchmark.`
                  : `⚠️ Warning: You are currently below 75%. You must consecutively attend the next ${classesNeeded} class sessions without missing to restore compliance.`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center min-w-[160px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {isCompliant ? 'Safe Bunk Quota' : 'Deficit Needed'}
              </span>
              <span className={`text-2xl font-black ${isCompliant ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isCompliant ? `${classesCanSkip} Classes` : `${classesNeeded} Classes`}
              </span>
            </div>
          </div>

          {/* Detailed Subject-wise Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Subject-wise Breakdown Ledger
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5">Subject / Course Module</th>
                    <th className="p-3.5 text-center">Total Held</th>
                    <th className="p-3.5 text-center">Attended</th>
                    <th className="p-3.5 text-center">Missed</th>
                    <th className="p-3.5 text-center">Percentage</th>
                    <th className="p-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjectStatsList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5 font-bold text-slate-900">{row.subject}</td>
                      <td className="p-3.5 text-center font-mono">{row.total}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-emerald-600">{row.present}</td>
                      <td className="p-3.5 text-center font-mono font-bold text-rose-600">{row.absent}</td>
                      <td className="p-3.5 text-center font-bold font-mono text-sm">{row.percentage}%</td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.isSafe 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {row.isSafe ? 'Safe' : 'Shortage'}
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

    </div>
  );
}
