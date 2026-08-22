import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
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
  RefreshCw
} from 'lucide-react';

export default function AttendanceClient() {
  const { activeSession, markStudentAttendance, studentAttendanceRecord } = useData();
  const [passcode, setPasscode] = useState('');
  const [bleStatus, setBleStatus] = useState('scanning'); // 'scanning' | 'connected' | 'out-of-range'
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate Web Bluetooth BLE Beacon proximity handshake
  useEffect(() => {
    const timer = setTimeout(() => {
      setBleStatus('connected');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38BDF8', '#818CF8', '#10B981', '#F59E0B']
    });
  };

  const handleSubmitAttendance = (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const result = markStudentAttendance(passcode);
      setStatusMessage(result);
      setIsSubmitting(false);

      if (result.success) {
        triggerConfetti();
        setPasscode('');
      }
    }, 600);
  };

  const handleQuickPasteCode = () => {
    setPasscode(activeSession.code);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining the DTU-style BLE anti-proxy system */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bluetooth className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-200">
              DTU-Style Dual-Factor Presence Protocol
            </h4>
            <p className="text-xs text-slate-300">
              Requires physical classroom BLE beacon proximity + teacher's live dynamic board PIN to prevent remote proxy attendance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bleStatus === 'connected' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Beacon In-Range (0.8m)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning for Classroom Beacon...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Active Class & Passcode Input */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Live Classroom Active
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeSession.subject}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-400 block">Lecturer:</span>
                <span className="text-xs font-bold text-slate-200">{activeSession.faculty}</span>
              </div>
            </div>

            {/* Room details & Beacon telemetry */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> Physical Venue
                </span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{activeSession.room}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block flex items-center gap-1">
                  <Radio className="w-3 h-3 text-indigo-400" /> Beacon Hardware ID
                </span>
                <span className="font-mono text-indigo-300 mt-0.5 block truncate">{activeSession.beaconId}</span>
              </div>
            </div>

            {/* Proximity Radar Simulation */}
            <div className="mt-6 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-cyan-500/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
              
              {/* Radar Pulsing Rings */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute w-28 h-28 rounded-full border border-cyan-500/20 animate-ping"></div>
                <div className="absolute w-20 h-20 rounded-full border border-indigo-500/40 animate-pulse"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 ring-4 ring-cyan-500/20 z-10">
                  <Bluetooth className="w-7 h-7 text-white" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mt-3">
                {bleStatus === 'connected' ? 'BLE Proximity Validated' : 'Handshaking with Classroom Node...'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                {bleStatus === 'connected' 
                  ? 'Your device is physically inside the lecture hall. Now enter the dynamic room code displayed on the teacher board.'
                  : 'Ensure Bluetooth is turned ON on your phone/laptop.'}
              </p>
            </div>

            {/* Passcode Entry Form */}
            <form onSubmit={handleSubmitAttendance} className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    Enter Dynamic Room Passcode:
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickPasteCode}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline"
                  >
                    Demo Auto-Fill ({activeSession.code})
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="e.g. EDUS-8492"
                    maxLength={12}
                    className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700/80 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-center font-mono text-lg font-bold text-cyan-300 placeholder-slate-600 tracking-widest uppercase transition"
                  />
                </div>
              </div>

              {/* Status feedback message */}
              {statusMessage && (
                <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn ${
                  statusMessage.success 
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}>
                  {statusMessage.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                  <span>{statusMessage.message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || bleStatus !== 'connected'}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  bleStatus === 'connected'
                    ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cryptographically Verifying Attendance...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit & Mark Present</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

        {/* Right Column: Attendance History & Statistics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Attendance KPI Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Semester Attendance Metric
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-extrabold text-white">88.4%</div>
                <p className="text-xs text-emerald-400 mt-0.5 font-medium">
                  +13.4% above 75% mandatory criteria
                </p>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <span className="text-xl font-bold text-emerald-400">Safe</span>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full w-[88.4%]"></div>
            </div>
          </div>

          {/* Recent Attendance Log */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              Recent Verification Logs
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {studentAttendanceRecord.map((rec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{rec.subject}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {rec.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rec.date}</span>
                    <span className="font-mono text-cyan-400/80 text-[10px]">{rec.verifiedVia}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
