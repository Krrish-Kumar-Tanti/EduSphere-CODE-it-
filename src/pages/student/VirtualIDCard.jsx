import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  QrCode, 
  ShieldCheck, 
  RotateCw, 
  Sparkles, 
  Building, 
  Hash, 
  Calendar, 
  Heart, 
  CheckCircle2, 
  Fingerprint,
  Award,
  Share2,
  Download
} from 'lucide-react';

export default function VirtualIDCard() {
  const { currentUser } = useAuth();
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [qrHash, setQrHash] = useState('EDUS-SECURE-9842');
  const [isFlipped, setIsFlipped] = useState(false);

  // Dynamic anti-screenshot rotating QR code generator (refreshes every 30 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Generate new token
          const randomSuffix = Math.floor(1000 + Math.random() * 9000);
          setQrHash(`EDUS-ROTATING-${randomSuffix}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert explaining the innovation */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-indigo-900">
              Anti-Fraud Dynamic Virtual ID
            </h4>
            <p className="text-xs text-indigo-700/80 font-medium">
              QR code auto-regenerates every 30 seconds to prevent static screenshots and proxy pass-sharing.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-mono bg-white border border-indigo-200 px-3 py-1.5 rounded-xl text-indigo-700 font-bold shadow-xs">
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
          <span>Refreshes in {secondsRemaining}s</span>
        </div>
      </div>

      {/* ID Card Display Area */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
        
        {/* The Cyber Digital ID Badge */}
        <div className="relative w-full max-w-sm sm:max-w-md">
          
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl p-6">
            
            {/* Top Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    ADGITM Smart Campus
                  </h3>
                  <p className="text-[10px] text-indigo-600 font-mono font-bold">
                    AFFILIATED TO GGSIPU, NEW DELHI
                  </p>
                </div>
              </div>
              
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE
              </span>
            </div>

            {/* Middle Section: Photo & Basic Details */}
            <div className="mt-5 flex gap-4 items-center">
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                />
                <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-md bg-indigo-600 text-white shadow">
                  <Fingerprint className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {currentUser?.name}
                </h2>
                <p className="text-xs font-semibold text-indigo-600">
                  {currentUser?.department}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    {currentUser?.semester}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                    Sec: {currentUser?.section}
                  </span>
                </div>
              </div>
            </div>

            {/* Grid of Student Credentials */}
            <div className="mt-5 grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Enrollment No:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser?.enrollment}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Student ID:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser?.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Blood Group:</span>
                <span className="font-bold text-rose-600">{currentUser?.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Valid Upto:</span>
                <span className="font-mono font-bold text-slate-900">{currentUser?.validUpto}</span>
              </div>
            </div>

            {/* Dynamic Rotating QR Code Box */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
              
              <div className="p-3 bg-white rounded-xl shadow-xs ring-4 ring-indigo-50 border border-slate-200">
                {/* Mock QR Code */}
                <div className="w-28 h-28 flex flex-col justify-between p-1 bg-white">
                  <div className="flex justify-between">
                    <div className="w-7 h-7 border-4 border-slate-900 rounded-sm flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900"></div>
                    </div>
                    <div className="w-7 h-7 border-4 border-slate-900 rounded-sm flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900"></div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center my-1 gap-1">
                    <div className="w-3 h-3 bg-indigo-600 rounded-sm animate-ping"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                    <div className="w-3 h-3 bg-slate-900"></div>
                    <div className="w-2 h-2 bg-slate-900"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-7 h-7 border-4 border-slate-900 rounded-sm flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900"></div>
                    </div>
                    <div className="w-7 h-7 grid grid-cols-2 gap-0.5">
                      <div className="bg-slate-900"></div>
                      <div className="bg-indigo-600"></div>
                      <div className="bg-slate-900"></div>
                      <div className="bg-slate-900"></div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 font-mono text-xs font-bold text-indigo-700 tracking-wider">
                {qrHash}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
                Dynamic Anti-Proxy Token • Scanned at Gate & Exams
              </p>
            </div>

            {/* Bottom Barcode */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">|||| | ||||| || |||||| | |||</span>
              <span className="flex items-center gap-1 text-indigo-600 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Verified Scholar
              </span>
            </div>

          </div>
        </div>

        {/* Card Actions & Stats Side Panel */}
        <div className="w-full max-w-sm space-y-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Campus Security Pass Status
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Library Access:</span>
                <span className="text-emerald-700 font-bold">Authorized (Tier 1)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Computer Labs:</span>
                <span className="text-emerald-700 font-bold">Active Access</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Hostel & Gate Curfew:</span>
                <span className="text-indigo-700 font-bold">Day Scholar</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Anti-Ragging Undertaking:</span>
                <span className="text-emerald-700 font-bold">Digitally Signed</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900">
            <p className="font-bold flex items-center gap-1.5 text-indigo-800 mb-1">
              <Award className="w-4 h-4 text-indigo-600" /> 100% Eco-Friendly & Paperless
            </p>
            Eliminates physical plastic PVC ID card manufacturing, loss reporting fines, and manual gate verification delays.
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => alert("Digital ID pass link copied to clipboard!")}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Share Pass</span>
            </button>
            <button 
              onClick={() => alert("Downloading encrypted offline ID token...")}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Offline Token</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
