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
  RefreshCw,
  Wifi
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
      colors: ['#4F46E5', '#7C3AED', '#10B981', '#F59E0B']
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
      
      {/* Top Banner matching Screenshot: Dual-Factor BLE Presence Protocol */}
      <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-xs">
            <Bluetooth className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-950">
              Dual-Factor BLE Presence Protocol
            </h4>
            <p className="text-xs text-indigo-800/80 font-medium">
              Proximity Check + Dynamic OTP Multi-Vector Verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bleStatus === 'connected' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Beacon In-Range (0.8m)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning for Classroom Beacon...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Active Class & Passcode Input */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  SESSION ACTIVE • 04:38 REMAINING
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">
                  {activeSession.subject}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-400 block">Lecturer:</span>
                <span className="text-xs font-bold text-slate-800">{activeSession.faculty}</span>
              </div>
            </div>

            {/* Room details & Beacon telemetry */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-600" /> Physical Venue
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">{activeSession.room}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                  <Radio className="w-3 h-3 text-purple-600" /> BLE Mesh Node
                </span>
                <span className="font-mono text-purple-700 font-bold mt-0.5 block truncate">{activeSession.beaconId}</span>
              </div>
            </div>

            {/* Step 1 & Step 2 Verification Cards */}
            <div className="space-y-3">
              {/* Step 1: Proximity */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Step 1: Physical Proximity RSSI</span>
                    <span className="text-[11px] text-slate-500">Signal Strength: 94% • Distance: 0.8m</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified In-Hall
                </span>
              </div>

              {/* Step 2: Dynamic Passcode */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-xs block">Step 2: Dynamic Room Code</span>
                      <span className="text-[11px] text-slate-500">Displayed on Professor's Live Studio Board</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickPasteCode}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold underline"
                  >
                    Auto-Fill ({activeSession.code})
                  </button>
                </div>

                <form onSubmit={handleSubmitAttendance} className="space-y-3 pt-1">
                  <input
                    type="text"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="e.g. EDUS-8492"
                    maxLength={12}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 text-center font-mono text-lg font-black text-indigo-700 placeholder-slate-400 tracking-widest uppercase transition shadow-xs"
                  />

                  {/* Status feedback message */}
                  {statusMessage && (
                    <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 animate-fadeIn ${
                      statusMessage.success 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold' 
                        : 'bg-rose-50 border border-rose-200 text-rose-800 font-bold'
                    }`}>
                      {statusMessage.success ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      )}
                      <span>{statusMessage.message}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || bleStatus !== 'connected'}
                    className={`w-full py-3.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      bleStatus === 'connected'
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
                        <span>Mark My Attendance & Broadcast BLE Handshake</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Attendance History & Statistics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Attendance KPI Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Semester Attendance Metric
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-black text-slate-900">88.4%</div>
                <p className="text-xs text-emerald-700 mt-0.5 font-bold">
                  +13.4% above 75% mandatory criteria
                </p>
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <span className="text-lg font-black text-emerald-700">Safe</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full w-[88.4%]"></div>
            </div>
          </div>

          {/* Recent Attendance Log */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4 text-purple-600" />
              Recent Verification Logs
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {studentAttendanceRecord.map((rec, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{rec.subject}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rec.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{rec.date}</span>
                    <span className="font-mono text-indigo-700 text-[10px] font-bold">{rec.verifiedVia}</span>
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

