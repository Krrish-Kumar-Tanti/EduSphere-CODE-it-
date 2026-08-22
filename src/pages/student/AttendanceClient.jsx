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
    }, 1200);

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
    if (activeSession?.code) {
      setPasscode(activeSession.code);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Protocol Banner */}
      <div className="p-4 rounded-3xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-sm">
            <Bluetooth className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Dual-Factor BLE Presence Protocol</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold">
                Anti-Proxy Mesh
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Requires physical classroom BLE beacon proximity + teacher's live dynamic board PIN to prevent remote proxy attendance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {bleStatus === 'connected' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Beacon In-Range (0.8m)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Scanning for Classroom Beacon...
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Active Class & Passcode Input */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="glass-panel-elevated p-6 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden bg-white/95">
            
            {/* Header */}
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

            {/* Room details & Beacon telemetry */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-semibold block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-600" /> Physical Venue
                </span>
                <span className="font-bold text-slate-800 mt-0.5 block">{activeSession.room}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 font-semibold block flex items-center gap-1">
                  <Radio className="w-3 h-3 text-sky-600" /> Beacon Hardware ID
                </span>
                <span className="font-mono font-semibold text-slate-700 mt-0.5 block truncate">{activeSession.beaconId}</span>
              </div>
            </div>

            {/* Proximity Radar Simulation */}
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
              
              {/* Radar Pulsing Rings */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute w-28 h-28 rounded-full border border-indigo-300 animate-ping opacity-75"></div>
                <div className="absolute w-20 h-20 rounded-full border border-sky-300 animate-pulse"></div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center shadow-lg shadow-indigo-200 ring-4 ring-indigo-100 z-10">
                  <Bluetooth className="w-7 h-7 text-white" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-3">
                {bleStatus === 'connected' ? 'BLE Proximity Validated' : 'Handshaking with Classroom Node...'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mt-1">
                {bleStatus === 'connected' 
                  ? 'Your device is physically inside the lecture hall. Now enter the dynamic room code displayed on the teacher board.'
                  : 'Ensure Bluetooth is turned ON on your phone/laptop.'}
              </p>
            </div>

            {/* Passcode Entry Form */}
            <form onSubmit={handleSubmitAttendance} className="mt-6 space-y-4">
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
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-200 font-mono font-bold text-center tracking-widest text-slate-900 text-base focus:border-indigo-600 focus:outline-none shadow-sm uppercase placeholder-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !passcode.trim()}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Verifying...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Validate Presence</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status feedback message */}
              {statusMessage && (
                <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 animate-fadeIn ${
                  statusMessage.success 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}>
                  {statusMessage.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{statusMessage.message}</span>
                </div>
              )}
            </form>

          </div>

        </div>

        {/* Right Column: Attendance Records & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Attendance Stats Card */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Semester Attendance Metric
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Safe
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">88.4%</span>
              <span className="text-xs font-bold text-emerald-600">+13.4% above 75% mandatory criteria</span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden mt-3">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full" style={{ width: '88.4%' }}></div>
            </div>
          </div>

          {/* Verification Logs */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-600" />
                Recent Verification Logs
              </h4>
            </div>

            <div className="space-y-3">
              {studentAttendanceRecord.map((rec) => (
                <div key={rec.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{rec.subject}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rec.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      rec.status === 'Present' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {rec.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{rec.verifiedVia}</span>
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
